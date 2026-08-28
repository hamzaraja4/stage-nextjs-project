import { ColdRoomItem, SampleMeal } from "../types/haccp";

export const MOCK_COLD_ROOMS: ColdRoomItem[] = [
  {
    id: "cf1",
    name: "Chambre Positive",
    code: "CF1",
    icon: "kitchen",
    currentTemp: "+3,1",
    targetRange: "Cible: +2°C à +4°C",
    isConforming: true,
    gradientFrom: "from-[#A9CFFF]",
  },
  {
    id: "cf2",
    name: "Chambre Négative",
    code: "CF2",
    icon: "ac_unit",
    currentTemp: "-18,7",
    targetRange: "Cible: -18°C à -22°C",
    isConforming: true,
    gradientFrom: "from-[#002F4B]",
  },
];

export const MOCK_SAMPLE_MEALS: SampleMeal[] = [
  {
    id: "sample-1",
    preparation: "Bœuf Bourguignon Mixé",
    lot: "A45-12",
    dateTime: "24/10 11:30",
    weight: "120g",
    expiryDateTime: "29/10 11:30",
    status: "active",
    statusLabel: "Actif (J+5)",
  },
  {
    id: "sample-2",
    preparation: "Purée de Carottes",
    lot: "A45-13",
    dateTime: "24/10 11:45",
    weight: "150g",
    expiryDateTime: "29/10 11:45",
    status: "active",
    statusLabel: "Actif (J+5)",
  },
  {
    id: "sample-3",
    preparation: "Potage Poireaux Pommes de Terre",
    lot: "A38-02",
    dateTime: "19/10 10:15",
    weight: "200g",
    expiryDateTime: "24/10 10:15",
    status: "destroyed",
    statusLabel: "Détruit",
  },
];
