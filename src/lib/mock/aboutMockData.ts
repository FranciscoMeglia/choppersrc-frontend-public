export interface AboutValue {
  number: string;
  titleKey: "v1Title" | "v2Title" | "v3Title";
  descriptionKey: "v1Description" | "v2Description" | "v3Description";
}

export const ABOUT_VALUES: AboutValue[] = [
  { number: "01", titleKey: "v1Title", descriptionKey: "v1Description" },
  { number: "02", titleKey: "v2Title", descriptionKey: "v2Description" },
  { number: "03", titleKey: "v3Title", descriptionKey: "v3Description" },
];
