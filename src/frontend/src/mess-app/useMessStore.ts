import { useEffect, useState } from "react";
import type { Expense, Member, MessStore } from "./types";

const STORAGE_KEY = "hostel_mess_data";

const today = new Date().toISOString().split("T")[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
const twoDaysAgo = new Date(Date.now() - 2 * 86400000)
  .toISOString()
  .split("T")[0];
const threeDaysAgo = new Date(Date.now() - 3 * 86400000)
  .toISOString()
  .split("T")[0];
const fourDaysAgo = new Date(Date.now() - 4 * 86400000)
  .toISOString()
  .split("T")[0];

const INITIAL_DATA: MessStore = {
  openingBalance: 500,
  members: [
    { id: "m1", name: "Rahul Sharma", contribution: 2500 },
    { id: "m2", name: "Amit Verma", contribution: 2500 },
    { id: "m3", name: "Priya Singh", contribution: 2000 },
    { id: "m4", name: "Suresh Kumar", contribution: 2500 },
  ],
  expenses: [
    {
      id: "e1",
      item: "Rice & Dal (5 kg)",
      amount: 450,
      date: today,
      paidById: "m1",
    },
    {
      id: "e2",
      item: "Vegetables & Onions",
      amount: 320,
      date: yesterday,
      paidById: "m2",
    },
    {
      id: "e3",
      item: "Cooking Oil (2L)",
      amount: 280,
      date: twoDaysAgo,
      paidById: "m3",
    },
    {
      id: "e4",
      item: "LPG Gas Cylinder",
      amount: 950,
      date: threeDaysAgo,
      paidById: "m4",
    },
    {
      id: "e5",
      item: "Milk (30 packets)",
      amount: 360,
      date: fourDaysAgo,
      paidById: "m1",
    },
    {
      id: "e6",
      item: "Spices & Masala",
      amount: 185,
      date: fourDaysAgo,
      paidById: "m2",
    },
  ],
};

function loadStore(): MessStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as MessStore;
  } catch {}
  return INITIAL_DATA;
}

function saveStore(data: MessStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useMessStore() {
  const [store, setStore] = useState<MessStore>(loadStore);

  useEffect(() => {
    saveStore(store);
  }, [store]);

  // Members
  const addMember = (name: string) => {
    const newMember: Member = {
      id: crypto.randomUUID(),
      name,
      contribution: 0,
    };
    setStore((s) => ({ ...s, members: [...s.members, newMember] }));
  };

  const updateMember = (id: string, updates: Partial<Omit<Member, "id">>) => {
    setStore((s) => ({
      ...s,
      members: s.members.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    }));
  };

  const deleteMember = (id: string) => {
    setStore((s) => ({
      ...s,
      members: s.members.filter((m) => m.id !== id),
      expenses: s.expenses.filter((e) => e.paidById !== id),
    }));
  };

  // Expenses
  const addExpense = (exp: Omit<Expense, "id">) => {
    const newExp: Expense = { id: crypto.randomUUID(), ...exp };
    setStore((s) => ({ ...s, expenses: [...s.expenses, newExp] }));
  };

  const updateExpense = (id: string, updates: Partial<Omit<Expense, "id">>) => {
    setStore((s) => ({
      ...s,
      expenses: s.expenses.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
  };

  const deleteExpense = (id: string) => {
    setStore((s) => ({
      ...s,
      expenses: s.expenses.filter((e) => e.id !== id),
    }));
  };

  const setOpeningBalance = (val: number) => {
    setStore((s) => ({ ...s, openingBalance: val }));
  };

  // Derived
  const totalContributions = store.members.reduce(
    (sum, m) => sum + m.contribution,
    0,
  );
  const totalExpenses = store.expenses.reduce((sum, e) => sum + e.amount, 0);
  const closingBalance =
    store.openingBalance + totalContributions - totalExpenses;

  const memberExpenseMap: Record<string, number> = {};
  for (const exp of store.expenses) {
    memberExpenseMap[exp.paidById] =
      (memberExpenseMap[exp.paidById] ?? 0) + exp.amount;
  }

  return {
    store,
    totalContributions,
    totalExpenses,
    closingBalance,
    memberExpenseMap,
    addMember,
    updateMember,
    deleteMember,
    addExpense,
    updateExpense,
    deleteExpense,
    setOpeningBalance,
  };
}
