// Lightweight cn utility — no external deps needed
export function cn(...classes: (string | undefined | null | false | 0)[]) {
  return classes.filter(Boolean).join(" ");
}
