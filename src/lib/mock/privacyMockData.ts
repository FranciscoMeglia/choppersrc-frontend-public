export interface PrivacySectionShape {
  key: string;
  paragraphCount: number;
  table?: { rowCount: number };
}

export const PRIVACY_SECTION_SHAPES: PrivacySectionShape[] = [
  { key: "s1", paragraphCount: 1 },
  { key: "s2", paragraphCount: 2 },
  { key: "s3", paragraphCount: 1 },
  { key: "s4", paragraphCount: 2 },
  { key: "s5", paragraphCount: 2, table: { rowCount: 4 } },
  { key: "s6", paragraphCount: 1 },
  { key: "s7", paragraphCount: 1 },
  { key: "s8", paragraphCount: 1 },
  { key: "s9", paragraphCount: 1 },
  { key: "s10", paragraphCount: 1 },
];
