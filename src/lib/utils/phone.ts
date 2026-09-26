import { parsePhoneNumberFromString } from "libphonenumber-js";

/**
 * "5492342560131" -> "+54 9 2342 56 0131", para mostrar un teléfono ya
 * guardado (WhatsApp del local, contacto de un posteo de Usados, etc.) — a
 * diferencia de `formatPhoneAsYouType` de abajo, acá sí conviene resolver
 * bien el prefijo de país/área real vía libphonenumber-js (asumiendo
 * Argentina cuando no viene con código de país) en vez de agrupar a ciegas.
 * Si no es un teléfono válido, se devuelve tal cual vino.
 */
export function formatPhone(value: string | null | undefined): string {
  if (!value) return "";
  const phone = parsePhoneNumberFromString(value, "AR");
  return phone?.isValid() ? phone.formatInternational() : value;
}

/**
 * Formateo liviano "as you type" para el teléfono del form de Usados —
 * mientras se está tipeando no conviene resolver el prefijo real (el número
 * todavía está incompleto), sólo agrupa los dígitos de a 4 para que no
 * quede todo pegado (ej. "5492342560131" -> "5492 3425 6013 1") mientras se
 * tipea. Conserva el "+" inicial si el usuario lo puso. Al mostrarse ya
 * guardado (posteo publicado) se usa `formatPhone` de arriba, que sí resuelve
 * el prefijo real.
 */
export function formatPhoneAsYouType(rawValue: string): string {
  const hasPlus = rawValue.trimStart().startsWith("+");
  const digits = rawValue.replace(/\D/g, "").slice(0, 15);
  if (!digits) return hasPlus ? "+" : "";

  const groups: string[] = [];
  for (let i = 0; i < digits.length; i += 4) groups.push(digits.slice(i, i + 4));
  return (hasPlus ? "+" : "") + groups.join(" ");
}

/**
 * Reformatea el valor y devuelve también dónde debería quedar el cursor,
 * contando cuántos dígitos había antes de él en el valor viejo y ubicándolo
 * después de esa misma cantidad de dígitos en el valor ya formateado — así
 * no salta siempre al final cuando se corrige algo en el medio.
 */
export function formatPhoneInput(
  value: string,
  cursorPosition: number,
): { formatted: string; cursor: number } {
  const digitsBeforeCursor = value.slice(0, cursorPosition).replace(/\D/g, "").length;
  const formatted = formatPhoneAsYouType(value);

  let digitsSeen = 0;
  let cursor = formatted.length;
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) digitsSeen++;
    if (digitsSeen >= digitsBeforeCursor) {
      cursor = i + 1;
      break;
    }
  }
  if (digitsBeforeCursor === 0) cursor = formatted.startsWith("+") ? 1 : 0;

  return { formatted, cursor };
}
