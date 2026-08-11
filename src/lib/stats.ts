import type { Product } from "@/generated/prisma/client";
import { getProductStatus } from "@/lib/declutter";

export type StashStats = {
  total: number;
  pricedCount: number;
  stashValue: number;
  deadMoney: number;
  deadCount: number;
  atRiskMoney: number;
  atRiskCount: number;
  neverUsedMoney: number;
  neverUsedCount: number;
  unusedCount: number;
  overstocked: { category: string; count: number }[];
};

export function getStashStats(products: Product[], now: Date = new Date()): StashStats {
  const stats: StashStats = {
    total: products.length,
    pricedCount: 0,
    stashValue: 0,
    deadMoney: 0,
    deadCount: 0,
    atRiskMoney: 0,
    atRiskCount: 0,
    neverUsedMoney: 0,
    neverUsedCount: 0,
    unusedCount: 0,
    overstocked: [],
  };

  const byCategory = new Map<string, number>();

  for (const product of products) {
    const price = product.price ?? 0;
    if (product.price != null) {
      stats.pricedCount += 1;
      stats.stashValue += price;
    }

    byCategory.set(product.category, (byCategory.get(product.category) ?? 0) + 1);

    switch (getProductStatus(product, now).key) {
      case "expired":
        stats.deadCount += 1;
        stats.deadMoney += price;
        break;
      case "expiring":
        stats.atRiskCount += 1;
        stats.atRiskMoney += price;
        break;
      case "unused":
        stats.unusedCount += 1;
        break;
    }

    // Bought and never actually used — the clearest "stop buying this" signal.
    if (product.useCount === 0) {
      stats.neverUsedCount += 1;
      stats.neverUsedMoney += price;
    }
  }

  stats.overstocked = [...byCategory.entries()]
    .filter(([, count]) => count >= 3)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  return stats;
}

export function costPerUse(product: Pick<Product, "price" | "useCount">): number | null {
  if (product.price == null || product.useCount === 0) return null;
  return product.price / product.useCount;
}
