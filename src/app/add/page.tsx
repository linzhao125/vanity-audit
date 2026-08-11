import Link from "next/link";
import { ProductForm } from "@/components/ProductForm";
import { createProduct } from "@/app/actions";

export default function AddProductPage() {
  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">
      <Link href="/" className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white">
        ← Back
      </Link>
      <h1 className="mt-2 text-xl font-semibold">Add product</h1>
      <p className="mt-1 text-sm text-black/60 dark:text-white/60">
        Add it to the stash so it shows up in the audit.
      </p>

      <div className="mt-6">
        <ProductForm action={createProduct} submitLabel="Add product" />
      </div>
    </div>
  );
}
