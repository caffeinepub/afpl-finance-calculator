export type MealPlan = "Full" | "Partial" | "None";
export type Block = "A" | "B" | "C" | "D";
export type StudentStatus = "Active" | "Inactive";
export type MealType = "Breakfast" | "Lunch" | "Dinner";
export type BillingStatus = "Paid" | "Unpaid";

export interface Student {
  id: string;
  name: string;
  roomNumber: string;
  block: Block;
  mealPlan: MealPlan;
  status: StudentStatus;
}

export interface AttendanceRecord {
  studentId: string;
  date: string; // ISO date string YYYY-MM-DD
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

export interface WeeklyMenu {
  [day: string]: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
}

export interface BillingRecord {
  studentId: string;
  month: string; // YYYY-MM
  mealsAttended: number;
  totalAmount: number;
  status: BillingStatus;
}

export interface MealRates {
  breakfast: number;
  lunch: number;
  dinner: number;
}

export interface Settings {
  hostelName: string;
  wardenName: string;
  mealRates: MealRates;
}

export type AppRoute =
  | "dashboard"
  | "students"
  | "attendance"
  | "menu"
  | "billing"
  | "settings";
