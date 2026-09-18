import { env } from "@/config/env";

export function imageUrl(path: string): string {
  return `${env.apiOrigin}${path}`;
}
