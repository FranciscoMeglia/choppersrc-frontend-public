/**
 * `JSON.stringify` no escapa `<`/`>`/`&` — si el objeto trae texto libre
 * cargado por un usuario (ej. `UsedListing.title`/`description`, ver
 * lib/seo/jsonLd.ts) y ese texto contiene algo como `</script><script>...`,
 * el navegador cierra el `<script>` de JSON-LD ahí mismo y ejecuta lo que
 * venga después como un script nuevo — XSS persistente sin pasar por el
 * admin. Se escapan a secuencias `\uXXXX`: el JSON sigue siendo válido y
 * Google/cualquier parser JSON-LD lo interpreta exactamente igual, pero en
 * el HTML fuente no aparece un `<`/`>` literal que el parser de HTML pueda
 * usar para cerrar el tag antes de tiempo. Los separadores de línea/párrafo
 * Unicode también se escapan porque son válidos dentro de un string JSON
 * pero rompen un `<script>` no-JSON-LD si el mismo helper se reusara ahí.
 */
const LINE_SEPARATOR = String.fromCharCode(0x2028);
const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029);

function safeJsonLdString(value: object): string {
  return JSON.stringify(value)
    .split("<").join("\\u003c")
    .split(">").join("\\u003e")
    .split("&").join("\\u0026")
    .split(LINE_SEPARATOR).join("\\u2028")
    .split(PARAGRAPH_SEPARATOR).join("\\u2029");
}

/** Server component: imprime un bloque JSON-LD. `data` puede ser un solo
 * objeto o una lista (ej. Organization + WebSite juntos en la home) — cada
 * uno se separa en su propio <script>, que es lo que Google recomienda en
 * vez de un array dentro de un único script. */
export function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLdString(item) }}
        />
      ))}
    </>
  );
}
