export interface Member {
  id: string;
  name: string;
  contribution: number;
}

export interface Expense {
  id: string;
  item: string;
  amount: number;
  date: string; // YYYY-MM-DD
  paidById: string;
}

export interface MessStore {
  members: Member[];
  expenses: Expense[];
  openingBalance: number;
}
