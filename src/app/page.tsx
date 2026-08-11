import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getProductStatus, type DeclutterStatus } from "@/lib/declutter";
import { ProductCard } from "@/components/ProductCard";

const FILTERS: { key: DeclutterStatus["key"] | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "expired", label: "Expired" },
  { key: "expiring", label: "Expiring soon" },
  { key: "unused", label: "Unused 90+ days" },
  { key: "unopened", label: "Unopened" },
  { key: "active", label: "In rotation" },
];

export default async function Home(props: PageProps<"/">) {
  const searchParams = await props.searchParams;
  const activeFilter =
    typeof searchParams.status === "string" ? searchParams.status : "all";

  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
  });

  const withStatus = products.map((product) => ({
    product,
    status: getProductStatus(product),
  }));

  const counts = withStatus.reduce<Record<string, number>>((acc, { status }) => {
    acc[status.key] = (acc[status.key] ?? 0) + 1;
    return acc;
  }, {});

  const visible =
    activeFilter === "all"
      ? withStatus
      : withStatus.filter(({ status }) => status.key === activeFilter);

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Vanity Audit</h1>
          <p className="text-sm text-black/60 dark:text-white/60">
            {products.length} product{products.length === 1 ? "" : "s"} tracked
          </p>
        </div>
        <Link
          href="/add"
          className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
        >
          + Add product
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const isActive = filter.key === activeFilter;
          const count = filter.key === "all" ? products.length : counts[filter.key] ?? 0;
          return (
            <Link
              key={filter.key}
              href={filter.key === "all" ? "/" : `/?status=${filter.key}`}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                isActive
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-black/5 text-black/70 hover:bg-black/10 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/15"
              }`}
            >
              {filter.label} ({count})
            </Link>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-2 text-center text-black/50 dark:text-white/50">
          <p className="text-sm">
            {products.length === 0
              ? "Nothing here yet — add your first product to start the audit."
              : "Nothing matches this filter."}
          </p>
          {products.length === 0 && (
            <Link href="/add" className="text-sm font-medium underline">
              Add a product
            </Link>
          )}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map(({ product }) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
