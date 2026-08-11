import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/generated/prisma/client";
import { getProductStatus } from "@/lib/declutter";
import { costPerUse } from "@/lib/stats";
import { StatusBadge } from "@/components/StatusBadge";
import { DeleteButton } from "@/components/DeleteButton";
import { markUsed, deleteProduct } from "@/app/actions";

const DATE_FORMAT = { year: "numeric", month: "short", day: "numeric" } as const;

// Date-only fields are stored at UTC midnight, so format them in UTC to avoid
// showing the previous day for users west of GMT.
function formatDateOnly(date: Date | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString(undefined, { ...DATE_FORMAT, timeZone: "UTC" });
}

function formatTimestamp(date: Date | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString(undefined, DATE_FORMAT);
}

export function ProductCard({ product }: { product: Product }) {
  const status = getProductStatus(product);
  const perUse = costPerUse(product);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-black/10 dark:border-white/15">
      <div className="relative aspect-square w-full bg-black/5 dark:bg-white/5">
        {product.photoUrl ? (
          <Image
            src={product.photoUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-black/20 dark:text-white/20">
            {product.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="absolute top-2 left-2">
          <StatusBadge status={status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div>
          <p className="text-sm font-semibold leading-tight">{product.name}</p>
          <p className="text-xs text-black/60 dark:text-white/60">
            {product.brand} · {product.category}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-xs text-black/60 dark:text-white/60">
          <dt>Opened</dt>
          <dd>{formatDateOnly(product.openedDate)}</dd>
          <dt>Last used</dt>
          <dd>{formatTimestamp(product.lastUsedAt)}</dd>
          <dt>Uses</dt>
          <dd>{product.useCount}</dd>
          {product.price != null && (
            <>
              <dt>Price</dt>
              <dd>${product.price.toFixed(2)}</dd>
            </>
          )}
          {perUse != null && (
            <>
              <dt>Per use</dt>
              <dd className="font-medium text-black/80 dark:text-white/80">
                ${perUse.toFixed(2)}
              </dd>
            </>
          )}
        </dl>

        <div className="mt-auto flex flex-col gap-2 pt-2">
          <form action={markUsed}>
            <input type="hidden" name="id" value={product.id} />
            <button
              type="submit"
              className="w-full rounded-full bg-black/5 px-3 py-1.5 text-xs font-medium whitespace-nowrap hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15"
            >
              Used today
            </button>
          </form>
          <div className="flex items-center justify-end gap-3">
            <Link
              href={`/product/${product.id}`}
              className="text-xs font-medium text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
            >
              Edit
            </Link>
            <DeleteButton id={product.id} deleteAction={deleteProduct} />
          </div>
        </div>
      </div>
    </div>
  );
}
