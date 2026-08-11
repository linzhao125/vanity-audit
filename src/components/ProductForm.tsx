import type { Product } from "@/generated/prisma/client";

function toDateInputValue(date: Date | null | undefined): string {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

const CATEGORY_SUGGESTIONS = [
  "Foundation",
  "Concealer",
  "Powder",
  "Blush",
  "Bronzer",
  "Highlighter",
  "Eyeshadow",
  "Eyeliner",
  "Mascara",
  "Brow",
  "Lipstick",
  "Lip gloss",
  "Lip liner",
  "Setting spray",
  "Primer",
  "Skincare",
];

export function ProductForm({
  action,
  product,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  product?: Product;
  submitLabel: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <label className="col-span-2 flex flex-col gap-1 text-sm sm:col-span-1">
          Name
          <input
            type="text"
            name="name"
            required
            defaultValue={product?.name}
            className="rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
            placeholder="Fenty Pro Filt'r Foundation"
          />
        </label>

        <label className="col-span-2 flex flex-col gap-1 text-sm sm:col-span-1">
          Brand
          <input
            type="text"
            name="brand"
            required
            defaultValue={product?.brand}
            className="rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
            placeholder="Fenty Beauty"
          />
        </label>

        <label className="col-span-2 flex flex-col gap-1 text-sm sm:col-span-1">
          Category
          <input
            type="text"
            name="category"
            required
            list="category-suggestions"
            defaultValue={product?.category}
            className="rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
            placeholder="Foundation"
          />
          <datalist id="category-suggestions">
            {CATEGORY_SUGGESTIONS.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </label>

        <label className="col-span-2 flex flex-col gap-1 text-sm sm:col-span-1">
          Price (USD)
          <input
            type="number"
            name="price"
            step="0.01"
            min="0"
            defaultValue={product?.price ?? ""}
            className="rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
            placeholder="38.00"
          />
        </label>

        <label className="col-span-2 flex flex-col gap-1 text-sm sm:col-span-1">
          Purchase date
          <input
            type="date"
            name="purchaseDate"
            defaultValue={toDateInputValue(product?.purchaseDate)}
            className="rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
          />
        </label>

        <label className="col-span-2 flex flex-col gap-1 text-sm sm:col-span-1">
          Opened date
          <input
            type="date"
            name="openedDate"
            defaultValue={toDateInputValue(product?.openedDate)}
            className="rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
          />
          <span className="text-xs text-black/50 dark:text-white/50">
            Leave blank if it&apos;s still unopened.
          </span>
        </label>

        <label className="col-span-2 flex flex-col gap-1 text-sm sm:col-span-1">
          Shelf life after opening (months)
          <input
            type="number"
            name="shelfLifeMonths"
            min="1"
            max="60"
            defaultValue={product?.shelfLifeMonths ?? 12}
            className="rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
          />
          <span className="text-xs text-black/50 dark:text-white/50">
            Check the little jar icon (PAO symbol) on the packaging — often 6, 12, or 24 months.
          </span>
        </label>

        <label className="col-span-2 flex flex-col gap-1 text-sm">
          Photo
          {product?.photoUrl && (
            <span className="text-xs text-black/50 dark:text-white/50">
              Uploading a new photo replaces the current one.
            </span>
          )}
          <input
            type="file"
            name="photo"
            accept="image/*"
            className="rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-black/10 file:px-3 file:py-1 file:text-xs dark:border-white/20 dark:file:bg-white/15"
          />
        </label>
      </div>

      <button
        type="submit"
        className="mt-2 self-start rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
      >
        {submitLabel}
      </button>
    </form>
  );
}
