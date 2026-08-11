"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { saveUploadedPhoto } from "@/lib/uploads";

function str(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function optionalDate(formData: FormData, key: string): Date | null {
  const value = str(formData, key);
  return value ? new Date(value) : null;
}

function optionalFloat(formData: FormData, key: string): number | null {
  const value = str(formData, key);
  if (!value) return null;
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export async function createProduct(formData: FormData) {
  const name = str(formData, "name");
  const brand = str(formData, "brand");
  const category = str(formData, "category");

  if (!name || !brand || !category) {
    throw new Error("Name, brand, and category are required");
  }

  const photoFile = formData.get("photo");
  const photoUrl = await saveUploadedPhoto(photoFile instanceof File ? photoFile : null);

  const shelfLifeMonths = optionalFloat(formData, "shelfLifeMonths") ?? 12;

  await prisma.product.create({
    data: {
      name,
      brand,
      category,
      photoUrl,
      price: optionalFloat(formData, "price"),
      purchaseDate: optionalDate(formData, "purchaseDate"),
      openedDate: optionalDate(formData, "openedDate"),
      shelfLifeMonths: Math.round(shelfLifeMonths),
    },
  });

  revalidatePath("/");
  redirect("/");
}

export async function updateProduct(id: string, formData: FormData) {
  const name = str(formData, "name");
  const brand = str(formData, "brand");
  const category = str(formData, "category");

  if (!name || !brand || !category) {
    throw new Error("Name, brand, and category are required");
  }

  const photoFile = formData.get("photo");
  const newPhotoUrl = await saveUploadedPhoto(photoFile instanceof File ? photoFile : null);

  const shelfLifeMonths = optionalFloat(formData, "shelfLifeMonths") ?? 12;

  await prisma.product.update({
    where: { id },
    data: {
      name,
      brand,
      category,
      ...(newPhotoUrl ? { photoUrl: newPhotoUrl } : {}),
      price: optionalFloat(formData, "price"),
      purchaseDate: optionalDate(formData, "purchaseDate"),
      openedDate: optionalDate(formData, "openedDate"),
      shelfLifeMonths: Math.round(shelfLifeMonths),
    },
  });

  revalidatePath("/");
  redirect("/");
}

export async function deleteProduct(formData: FormData) {
  const id = str(formData, "id");
  if (!id) return;

  await prisma.product.delete({ where: { id } });
  revalidatePath("/");
  redirect("/");
}

export async function markUsed(formData: FormData) {
  const id = str(formData, "id");
  if (!id) return;

  await prisma.product.update({
    where: { id },
    data: {
      lastUsedAt: new Date(),
      useCount: { increment: 1 },
    },
  });

  revalidatePath("/");
}
