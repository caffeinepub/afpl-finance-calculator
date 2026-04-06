import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Float "mo:core/Float";
import Text "mo:core/Text";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var interestRate = 24.49; // Annual Interest Rate
  var processingFeeRate = 1.5; // % of loan amount
  var gstRate = 18.0; // GST on processing fee
  var insurancePer1000 = 7.5;
  var numberOfPersons = 2;

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public type CalculatorResult = {
    amount : Float;
    tenureYears : Float;
    totalMonths : Float;
    processingFee : Float;
    gst : Float;
    insurance : Float;
    totalDeductions : Float;
    netDisbursal : Float;
    emi : Float;
    totalRepayment : Float;
    totalInterest : Float;
  };

  type UpdateParams = {
    interestRate : ?Float;
    processingFeeRate : ?Float;
    gstRate : ?Float;
    insurancePer1000 : ?Float;
    numberOfPersons : ?Nat;
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func updateParameters(params : UpdateParams) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update parameters");
    };

    switch (params.interestRate) {
      case (?newInterestRate) { interestRate := newInterestRate };
      case (null) {};
    };
    switch (params.processingFeeRate) {
      case (?newProcessingFeeRate) { processingFeeRate := newProcessingFeeRate };
      case (null) {};
    };
    switch (params.gstRate) {
      case (?newGstRate) { gstRate := newGstRate };
      case (null) {};
    };
    switch (params.insurancePer1000) {
      case (?newInsurancePer1000) { insurancePer1000 := newInsurancePer1000 };
      case (null) {};
    };
    switch (params.numberOfPersons) {
      case (?newNumberOfPersons) { numberOfPersons := newNumberOfPersons };
      case (null) {};
    };
  };

  public query func getParameters() : async {
    interestRate : Float;
    processingFeeRate : Float;
    gstRate : Float;
    insurancePer1000 : Float;
    numberOfPersons : Nat;
  } {
    {
      interestRate;
      processingFeeRate;
      gstRate;
      insurancePer1000;
      numberOfPersons;
    };
  };

  public query func calculateLoan(amount : Float, tenureYears : Float) : async CalculatorResult {
    calculate(amount, tenureYears);
  };

  func calculate(amount : Float, tenureYears : Float) : CalculatorResult {
    let totalMonths = tenureYears * 12.0;
    let processingFee = amount * (processingFeeRate / 100.0);
    let gst = processingFee * (gstRate / 100.0);

    let insurance = (amount / 1000.0) * insurancePer1000 * numberOfPersons.toFloat() * tenureYears;

    let totalDeductions = insurance + processingFee + gst;
    let netDisbursal = amount - totalDeductions;

    let monthlyRate = (interestRate / 100.0) / 12.0;
    let emiFactorNumerator = monthlyRate * ((1.0 + monthlyRate) ** totalMonths);
    let emiFactorDenominator = (((1.0 + monthlyRate) ** totalMonths) - 1.0);

    let emi = if (emiFactorDenominator > 0) {
      amount * (emiFactorNumerator / emiFactorDenominator);
    } else {
      amount / totalMonths;
    };

    let totalRepayment = emi * totalMonths;
    let totalInterest = totalRepayment - amount;

    {
      amount;
      tenureYears;
      totalMonths;
      processingFee;
      gst;
      insurance;
      totalDeductions;
      netDisbursal;
      emi;
      totalRepayment;
      totalInterest;
    };
  };
};
