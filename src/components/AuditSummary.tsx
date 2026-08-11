import Link from "next/link";
import type { StashStats } from "@/lib/stats";

function money(value: number): string {
  return `$${value.toFixed(2)}`;
}

function pluralize(noun: string, count: number): string {
  if (count === 1) return noun;
  return /(s|sh|ch|x|z)$/i.test(noun) ? `${noun}es` : `${noun}s`;
}

function joinPhrases(phrases: string[]): string {
  if (phrases.length <= 1) return phrases.join("");
  if (phrases.length === 2) return `${phrases[0]} and ${phrases[1]}`;
  return `${phrases.slice(0, -1).join(", ")}, and ${phrases[phrases.length - 1]}`;
}

function Tile({
  label,
  value,
  sub,
  href,
  tone = "neutral",
}: {
  label: string;
  value: string;
  sub: string;
  href?: string;
  tone?: "neutral" | "red" | "amber";
}) {
  const valueTone =
    tone === "red"
      ? "text-red-600 dark:text-red-400"
      : tone === "amber"
        ? "text-amber-600 dark:text-amber-400"
        : "";

  const body = (
    <>
      <p className="text-xs font-medium text-black/50 dark:text-white/50">{label}</p>
      <p className={`mt-1 text-2xl font-semibold tabular-nums ${valueTone}`}>{value}</p>
      <p className="mt-0.5 text-xs text-black/50 dark:text-white/50">{sub}</p>
    </>
  );

  const className =
    "rounded-xl border border-black/10 p-4 dark:border-white/15" +
    (href ? " transition hover:border-black/30 dark:hover:border-white/35" : "");

  return href ? (
    <Link href={href} className={className}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}

export function AuditSummary({ stats }: { stats: StashStats }) {
  const missingPrices = stats.total - stats.pricedCount;

  return (
    <section className="mt-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tile
          label="Dead money"
          value={money(stats.deadMoney)}
          sub={`${stats.deadCount} expired ${stats.deadCount === 1 ? "product" : "products"}`}
          href="/?status=expired"
          tone={stats.deadMoney > 0 ? "red" : "neutral"}
        />
        <Tile
          label="At risk"
          value={money(stats.atRiskMoney)}
          sub={`${stats.atRiskCount} expiring within 30 days`}
          href="/?status=expiring"
          tone={stats.atRiskMoney > 0 ? "amber" : "neutral"}
        />
        <Tile
          label="Never used"
          value={money(stats.neverUsedMoney)}
          sub={`${stats.neverUsedCount} bought, never logged`}
          tone={stats.neverUsedMoney > 0 ? "amber" : "neutral"}
        />
        <Tile
          label="Stash value"
          value={money(stats.stashValue)}
          sub={
            missingPrices > 0
              ? `${stats.pricedCount} priced · ${missingPrices} missing`
              : `${stats.total} products`
          }
        />
      </div>

      {stats.overstocked.length > 0 && (
        <p className="mt-3 text-xs text-black/60 dark:text-white/60">
          You own{" "}
          <strong className="font-semibold text-black/80 dark:text-white/80">
            {joinPhrases(
              stats.overstocked.map(
                (entry) => `${entry.count} ${pluralize(entry.category.toLowerCase(), entry.count)}`
              )
            )}
          </strong>
          . Worth knowing before the next haul.
        </p>
      )}
    </section>
  );
}
