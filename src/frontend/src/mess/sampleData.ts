import type {
  AttendanceRecord,
  BillingRecord,
  Student,
  WeeklyMenu,
} from "./types";

export const SAMPLE_STUDENTS: Student[] = [
  {
    id: "STU001",
    name: "Arjun Sharma",
    roomNumber: "101",
    block: "A",
    mealPlan: "Full",
    status: "Active",
  },
  {
    id: "STU002",
    name: "Priya Patel",
    roomNumber: "203",
    block: "B",
    mealPlan: "Full",
    status: "Active",
  },
  {
    id: "STU003",
    name: "Rohit Verma",
    roomNumber: "305",
    block: "C",
    mealPlan: "Partial",
    status: "Active",
  },
  {
    id: "STU004",
    name: "Anjali Singh",
    roomNumber: "108",
    block: "A",
    mealPlan: "Full",
    status: "Active",
  },
  {
    id: "STU005",
    name: "Vikram Nair",
    roomNumber: "214",
    block: "D",
    mealPlan: "Partial",
    status: "Inactive",
  },
  {
    id: "STU006",
    name: "Deepa Menon",
    roomNumber: "412",
    block: "B",
    mealPlan: "Full",
    status: "Active",
  },
  {
    id: "STU007",
    name: "Suresh Yadav",
    roomNumber: "310",
    block: "C",
    mealPlan: "None",
    status: "Active",
  },
  {
    id: "STU008",
    name: "Kavya Reddy",
    roomNumber: "207",
    block: "D",
    mealPlan: "Full",
    status: "Active",
  },
];

export const SAMPLE_WEEKLY_MENU: WeeklyMenu = {
  Monday: {
    breakfast: "Idli, Sambar, Coconut Chutney, Tea",
    lunch: "Dal Tadka, Jeera Rice, Sabzi, Roti, Salad",
    dinner: "Paneer Butter Masala, Naan, Dal Fry, Kheer",
  },
  Tuesday: {
    breakfast: "Poha, Jalebi, Boiled Egg, Tea",
    lunch: "Rajma, Steamed Rice, Aloo Gobi, Roti, Raita",
    dinner: "Chole, Bhature, Mixed Veg, Rice Pudding",
  },
  Wednesday: {
    breakfast: "Paratha, Pickle, Curd, Tea",
    lunch: "Kadhi Pakora, Rice, Baingan Bharta, Chapati",
    dinner: "Fish Curry, Steamed Rice, Dal Soup, Gulab Jamun",
  },
  Thursday: {
    breakfast: "Upma, Banana, Boiled Egg, Coffee",
    lunch: "Sambar Rice, Papad, Potato Fry, Buttermilk",
    dinner: "Mutton Curry, Roti, Dal Makhani, Ice Cream",
  },
  Friday: {
    breakfast: "Puri, Aloo Bhaji, Tea",
    lunch: "Egg Curry, Steamed Rice, Mix Veg, Chapati, Salad",
    dinner: "Biryani, Raita, Mirchi Salan, Phirni",
  },
  Saturday: {
    breakfast: "Dosa, Sambar, Red Chutney, Tea",
    lunch: "Dal Palak, Rice, Jeera Aloo, Roti, Pickle",
    dinner: "Chicken Tikka Masala, Butter Naan, Dal, Halwa",
  },
  Sunday: {
    breakfast: "Choley Bhature, Lassi",
    lunch: "Special Biryani, Raita, Pickle, Papad",
    dinner: "Paneer Lababdar, Roti, Dal, Sweet Rabri",
  },
};

const today = new Date();
function dateStr(daysAgo: number): string {
  const d = new Date(today);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
}

export const SAMPLE_ATTENDANCE: AttendanceRecord[] = [
  // Today
  {
    studentId: "STU001",
    date: dateStr(0),
    breakfast: true,
    lunch: true,
    dinner: false,
  },
  {
    studentId: "STU002",
    date: dateStr(0),
    breakfast: true,
    lunch: true,
    dinner: true,
  },
  {
    studentId: "STU003",
    date: dateStr(0),
    breakfast: false,
    lunch: true,
    dinner: false,
  },
  {
    studentId: "STU004",
    date: dateStr(0),
    breakfast: true,
    lunch: false,
    dinner: true,
  },
  {
    studentId: "STU006",
    date: dateStr(0),
    breakfast: true,
    lunch: true,
    dinner: true,
  },
  {
    studentId: "STU007",
    date: dateStr(0),
    breakfast: false,
    lunch: false,
    dinner: false,
  },
  {
    studentId: "STU008",
    date: dateStr(0),
    breakfast: true,
    lunch: true,
    dinner: false,
  },
  // Yesterday
  {
    studentId: "STU001",
    date: dateStr(1),
    breakfast: true,
    lunch: true,
    dinner: true,
  },
  {
    studentId: "STU002",
    date: dateStr(1),
    breakfast: false,
    lunch: true,
    dinner: true,
  },
  {
    studentId: "STU003",
    date: dateStr(1),
    breakfast: true,
    lunch: false,
    dinner: true,
  },
  {
    studentId: "STU004",
    date: dateStr(1),
    breakfast: true,
    lunch: true,
    dinner: false,
  },
  {
    studentId: "STU006",
    date: dateStr(1),
    breakfast: true,
    lunch: true,
    dinner: true,
  },
  {
    studentId: "STU008",
    date: dateStr(1),
    breakfast: false,
    lunch: true,
    dinner: true,
  },
  // 2 days ago
  {
    studentId: "STU001",
    date: dateStr(2),
    breakfast: true,
    lunch: false,
    dinner: true,
  },
  {
    studentId: "STU002",
    date: dateStr(2),
    breakfast: true,
    lunch: true,
    dinner: false,
  },
  {
    studentId: "STU004",
    date: dateStr(2),
    breakfast: false,
    lunch: true,
    dinner: true,
  },
  {
    studentId: "STU006",
    date: dateStr(2),
    breakfast: true,
    lunch: true,
    dinner: true,
  },
  {
    studentId: "STU008",
    date: dateStr(2),
    breakfast: true,
    lunch: false,
    dinner: false,
  },
];

export const SAMPLE_BILLING: BillingRecord[] = [
  {
    studentId: "STU001",
    month: "2026-03",
    mealsAttended: 78,
    totalAmount: 3120,
    status: "Paid",
  },
  {
    studentId: "STU002",
    month: "2026-03",
    mealsAttended: 85,
    totalAmount: 3400,
    status: "Paid",
  },
  {
    studentId: "STU003",
    month: "2026-03",
    mealsAttended: 42,
    totalAmount: 1680,
    status: "Unpaid",
  },
  {
    studentId: "STU004",
    month: "2026-03",
    mealsAttended: 75,
    totalAmount: 3000,
    status: "Paid",
  },
  {
    studentId: "STU005",
    month: "2026-03",
    mealsAttended: 30,
    totalAmount: 1200,
    status: "Unpaid",
  },
  {
    studentId: "STU006",
    month: "2026-03",
    mealsAttended: 88,
    totalAmount: 3520,
    status: "Paid",
  },
  {
    studentId: "STU007",
    month: "2026-03",
    mealsAttended: 15,
    totalAmount: 600,
    status: "Unpaid",
  },
  {
    studentId: "STU008",
    month: "2026-03",
    mealsAttended: 80,
    totalAmount: 3200,
    status: "Paid",
  },
  {
    studentId: "STU001",
    month: "2026-04",
    mealsAttended: 12,
    totalAmount: 480,
    status: "Unpaid",
  },
  {
    studentId: "STU002",
    month: "2026-04",
    mealsAttended: 10,
    totalAmount: 400,
    status: "Unpaid",
  },
  {
    studentId: "STU004",
    month: "2026-04",
    mealsAttended: 9,
    totalAmount: 360,
    status: "Unpaid",
  },
  {
    studentId: "STU006",
    month: "2026-04",
    mealsAttended: 11,
    totalAmount: 440,
    status: "Paid",
  },
];
