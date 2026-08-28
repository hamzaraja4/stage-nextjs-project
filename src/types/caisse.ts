export interface StaffProfile {
  id: string;
  name: string;
  role: string;
  empId: string;
  avatarUrl: string;
  balance: number;
  currency: string;
  isAccountActive: boolean;
  overdraftLimitDescription: string;
}

export interface MealItem {
  id: string;
  title: string;
  subtitle: string;
  quantity: number;
  price: number;
  currency: string;
  icon: string;
}

export interface Transaction {
  id: string;
  date: string;
  label: string;
  amount: number;
  balanceAfter: number;
  type: "debit" | "credit";
  icon: string;
  currency: string;
}
