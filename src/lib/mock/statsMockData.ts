export interface HomeStat {
  value: string;
  key:
    | "yearsInMarket"
    | "brandsAvailable"
    | "shipmentsCompleted"
    | "averageRating";
}

export const MOCK_STATS: HomeStat[] = [
  { value: "20+", key: "yearsInMarket" },
  { value: "30", key: "brandsAvailable" },
  { value: "100", key: "shipmentsCompleted" },
  { value: "4,9 / 5", key: "averageRating" },
];
