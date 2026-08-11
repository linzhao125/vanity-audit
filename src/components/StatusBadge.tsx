import type { DeclutterStatus } from "@/lib/declutter";

const TONE_CLASSES: Record<DeclutterStatus["tone"], string> = {
  red: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  amber: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  green: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
};

export function StatusBadge({ status }: { status: DeclutterStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${TONE_CLASSES[status.tone]}`}
    >
      {status.label}
    </span>
  );
}
