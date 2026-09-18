import { useTranslations } from "next-intl";

interface LegalSection {
  title: string;
  paragraphs: string[];
  table?: { headers: string[]; rows: string[][] };
}

export function LegalContent({
  sections,
  lastUpdated,
}: {
  sections: LegalSection[];
  lastUpdated: string;
}) {
  const t = useTranslations("LegalContent");

  return (
    <article className="max-w-3xl">
      <p className="text-sm text-ink/50">
        {t("lastUpdatedLabel", { date: lastUpdated })}
      </p>

      <div className="mt-8 flex flex-col gap-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-heading text-xl font-bold tracking-tight uppercase">
              {section.title}
            </h2>
            <div className="mt-3 flex flex-col gap-3 text-ink/70">
              {section.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {section.table && (
              <div className="mt-4 overflow-x-auto rounded border border-ink/10">
                <table className="w-full text-left text-sm">
                  <thead className="bg-ink/5 text-xs tracking-wide text-ink/50 uppercase">
                    <tr>
                      {section.table.headers.map((header) => (
                        <th key={header} className="p-3 font-medium">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/10">
                    {section.table.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="p-3 align-top text-ink/70">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}
      </div>
    </article>
  );
}
