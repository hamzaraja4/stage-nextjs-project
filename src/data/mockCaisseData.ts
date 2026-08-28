import { StaffProfile, MealItem, Transaction } from "../types/caisse";

export const MOCK_STAFF_PROFILE: StaffProfile = {
  id: "emp-10459",
  name: "Dr. Samir Alaoui",
  role: "Médecin — Urgences",
  empId: "10459-EMP",
  avatarUrl:
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=256&auto=format&fit=crop",
  balance: 184.5,
  currency: "MAD",
  isAccountActive: true,
  overdraftLimitDescription:
    "Découvert technique autorisé plafonné à 1 repas (45 MAD).",
};

export const MOCK_MEAL_ITEMS: MealItem[] = [
  {
    id: "meal-1",
    title: "Menu Unique — Déjeuner",
    subtitle: "Plat + Entrée ou Dessert",
    quantity: 1,
    price: 45.0,
    currency: "MAD",
    icon: "restaurant",
  },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    date: "Aujourd'hui, 12:14",
    label: "Menu Self",
    amount: -45.0,
    balanceAfter: 184.5,
    type: "debit",
    icon: "restaurant",
    currency: "MAD",
  },
  {
    id: "tx-2",
    date: "Hier, 08:30",
    label: "Recharge Caisse",
    amount: 200.0,
    balanceAfter: 229.5,
    type: "credit",
    icon: "add_card",
    currency: "MAD",
  },
  {
    id: "tx-3",
    date: "02 Nov, 13:05",
    label: "Menu Self",
    amount: -45.0,
    balanceAfter: 29.5,
    type: "debit",
    icon: "restaurant",
    currency: "MAD",
  },
];
