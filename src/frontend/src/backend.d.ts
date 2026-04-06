import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CalculatorResult {
    emi: number;
    gst: number;
    totalDeductions: number;
    processingFee: number;
    netDisbursal: number;
    totalRepayment: number;
    totalInterest: number;
    tenureYears: number;
    insurance: number;
    totalMonths: number;
    amount: number;
}
export interface UserProfile {
    name: string;
}
export interface UpdateParams {
    insurancePer1000?: number;
    processingFeeRate?: number;
    numberOfPersons?: bigint;
    interestRate?: number;
    gstRate?: number;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    calculateLoan(amount: number, tenureYears: number): Promise<CalculatorResult>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getParameters(): Promise<{
        insurancePer1000: number;
        processingFeeRate: number;
        numberOfPersons: bigint;
        interestRate: number;
        gstRate: number;
    }>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateParameters(params: UpdateParams): Promise<void>;
}
