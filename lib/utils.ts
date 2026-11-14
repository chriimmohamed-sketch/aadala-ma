/** Minimal `cn` helper (no clsx/tailwind-merge dependency). */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
