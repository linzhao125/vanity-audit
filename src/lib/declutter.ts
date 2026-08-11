import type { Product } from "@/generated/prisma/client";

export type DeclutterStatus = {
  key: "expired" | "expiring" | "unused" | "unopened" | "active";
  label: string;
  tone: "red" | "amber" | "blue" | "green";
};

const EXPIRING_SOON_DAYS = 30;
const UNUSED_DAYS = 90;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function getExpiryDate(product: Pick<Product, "openedDate" | "shelfLifeMonths">): Date | null {
  if (!product.openedDate) return null;
  const expiry = new Date(product.openedDate);
  expiry.setUTCMonth(expiry.getUTCMonth() + product.shelfLifeMonths);
  return expiry;
}

export function getProductStatus(
  product: Pick<Product, "openedDate" | "shelfLifeMonths" | "lastUsedAt">,
  now: Date = new Date()
): DeclutterStatus {
  const expiry = getExpiryDate(product);

  if (expiry && expiry.getTime() < now.getTime()) {
    return { key: "expired", label: "Expired", tone: "red" };
  }

  if (expiry) {
    const daysToExpiry = (expiry.getTime() - now.getTime()) / MS_PER_DAY;
    if (daysToExpiry <= EXPIRING_SOON_DAYS) {
      return { key: "expiring", label: "Expiring soon", tone: "amber" };
    }
  }

  if (!product.openedDate) {
    return { key: "unopened", label: "Unopened", tone: "blue" };
  }

  const lastUsed = product.lastUsedAt ?? product.openedDate;
  const daysSinceUse = (now.getTime() - new Date(lastUsed).getTime()) / MS_PER_DAY;
  if (daysSinceUse >= UNUSED_DAYS) {
    return { key: "unused", label: "Unused 90+ days", tone: "amber" };
  }

  return { key: "active", label: "In rotation", tone: "green" };
}
