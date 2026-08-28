import {
  DailyMenuRow,
  CutOffServiceItem,
  MaterialRequirementRow,
} from "../types/planification";

export const MOCK_DAILY_MENUS: DailyMenuRow[] = [
  {
    id: "menu-normal",
    diet: "Normal",
    starter: "Salade Niçoise",
    mainCourse: "Poulet Rôti",
    sideDish: "Pommes Grenailles",
    dessert: "Éclair Café",
    isHighlighted: true,
  },
  {
    id: "menu-diabetic",
    diet: "Diabétique",
    starter: "Salade Verte Vinaigrette Allégée",
    mainCourse: "Poulet Rôti s/peau",
    sideDish: "Haricots Verts",
    dessert: "Fruit de Saison",
  },
  {
    id: "menu-saltfree",
    diet: "Sans Sel",
    starter: "Tomates Basilic s/sel",
    mainCourse: "Poisson Vapeur",
    sideDish: "Riz Blanc s/sel",
    dessert: "Compote Pomme",
  },
  {
    id: "menu-pureed",
    diet: "Mixé",
    starter: "Velouté de Légumes",
    mainCourse: "Purée de Viande",
    sideDish: "Purée de Pommes de Terre",
    dessert: "Crème Vanille",
  },
];

export const MOCK_CUTOFF_SERVICES: CutOffServiceItem[] = [
  {
    id: "cutoff-1",
    title: "Petit-déjeuner",
    time: "07:00",
    statusLabel: "Clôturé",
    statusType: "closed",
    icon: "check_circle",
  },
  {
    id: "cutoff-2",
    title: "Déjeuner",
    time: "12:00",
    statusLabel: "Actif - T-15m",
    statusType: "active",
    icon: "schedule",
  },
  {
    id: "cutoff-3",
    title: "Collation",
    time: "15:30",
    statusLabel: "Ouvert",
    statusType: "open",
    icon: "pending",
  },
  {
    id: "cutoff-4",
    title: "Garde Urgence",
    time: "24/7",
    statusLabel: "Action Requise",
    statusType: "urgent",
    icon: "warning",
  },
];

export const MOCK_MATERIAL_REQUIREMENTS: MaterialRequirementRow[] = [
  {
    id: "mat-1",
    ingredient: "Poulet Entier",
    plannedNeedKg: 45.5,
    actualStockKg: 30.0,
    incomingOrderKg: 20.0,
    availableStockKg: 4.5,
  },
  {
    id: "mat-2",
    ingredient: "Pommes de Terre",
    plannedNeedKg: 80.0,
    actualStockKg: 15.0,
    incomingOrderKg: 50.0,
    availableStockKg: -15.0,
    isCriticalDeficit: true,
  },
  {
    id: "mat-3",
    ingredient: "Salade Mélange",
    plannedNeedKg: 12.0,
    actualStockKg: 15.0,
    incomingOrderKg: 0.0,
    availableStockKg: 3.0,
  },
  {
    id: "mat-4",
    ingredient: "Haricots Verts (Surg)",
    plannedNeedKg: 25.0,
    actualStockKg: 25.0,
    incomingOrderKg: 0.0,
    availableStockKg: 0.0,
  },
];
