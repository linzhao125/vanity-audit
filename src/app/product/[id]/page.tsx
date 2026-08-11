import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/ProductForm";
import { updateProduct } from "@/app/actions";

export default async function EditProductPage(props: PageProps<"/product/[id]">) {
  const { id } = await props.params;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    notFound();
  }

  const updateProductWithId = updateProduct.bind(null, product.id);

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">
      <Link href="/" className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white">
        ← Back
      </Link>
      <h1 className="mt-2 text-xl font-semibold">Edit {product.name}</h1>

      <div className="mt-6">
        <ProductForm action={updateProductWithId} product={product} submitLabel="Save changes" />
      </div>
    </div>
  );
}
