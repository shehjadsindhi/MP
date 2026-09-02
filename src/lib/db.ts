import { prisma } from "./prisma";
import {
  FALLBACK_PRODUCTS,
  FALLBACK_AI_FEATURES,
  FALLBACK_ARTICLES,
  FALLBACK_OFFERS,
} from "./fallbackData";

export async function safeGetProducts(options?: {
  category?: string;
  search?: string;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}) {
  try {
    const where: any = {};
    if (options?.category && options.category !== "All") {
      where.category = options.category;
    }
    if (options?.featured) {
      where.isFeatured = true;
    }
    if (options?.search) {
      where.OR = [
        { name: { contains: options.search } },
        { description: { contains: options.search } },
        { category: { contains: options.search } },
      ];
    }
    if (options?.minPrice != null || options?.maxPrice != null) {
      where.price = {};
      if (options.minPrice != null) where.price.gte = options.minPrice;
      if (options.maxPrice != null) where.price.lte = options.maxPrice;
    }

    let orderBy: any = { isFeatured: "desc" };
    if (options?.sort === "price-asc") orderBy = { price: "asc" };
    if (options?.sort === "price-desc") orderBy = { price: "desc" };
    if (options?.sort === "rating") orderBy = { rating: "desc" };
    if (options?.sort === "discount") orderBy = { discount: "desc" };

    const products = await prisma.product.findMany({ where, orderBy });
    if (products && products.length > 0) {
      return products;
    }
  } catch (error) {
    console.warn("Prisma products fetch failed, using fallback data:", error);
  }

  // Fallback filtering logic
  let filtered = [...FALLBACK_PRODUCTS];
  if (options?.category && options.category !== "All") {
    filtered = filtered.filter((p) => p.category.toLowerCase() === options.category?.toLowerCase());
  }
  if (options?.featured) {
    filtered = filtered.filter((p) => p.isFeatured);
  }
  if (options?.search) {
    const q = options.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }
  if (options?.minPrice != null) {
    filtered = filtered.filter((p) => p.price >= options.minPrice!);
  }
  if (options?.maxPrice != null) {
    filtered = filtered.filter((p) => p.price <= options.maxPrice!);
  }

  if (options?.sort === "price-asc") filtered.sort((a, b) => a.price - b.price);
  if (options?.sort === "price-desc") filtered.sort((a, b) => b.price - a.price);
  if (options?.sort === "rating") filtered.sort((a, b) => b.rating - a.rating);
  if (options?.sort === "discount") filtered.sort((a, b) => b.discount - a.discount);

  return filtered;
}

export async function safeGetProductByIdOrSlug(idOrSlug: string) {
  try {
    const product = await prisma.product.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    });
    if (product) return product;
  } catch (error) {
    console.warn(`Prisma product lookup failed for ${idOrSlug}, using fallback:`, error);
  }

  return (
    FALLBACK_PRODUCTS.find((p) => p.id === idOrSlug || p.slug === idOrSlug) ||
    FALLBACK_PRODUCTS[0]
  );
}

export async function safeGetAIFeatures(category?: string) {
  try {
    const where: any = {};
    if (category && category !== "All") {
      where.category = category;
    }
    const features = await prisma.aIFeature.findMany({
      where,
      orderBy: { createdAt: "asc" },
    });
    if (features && features.length > 0) return features;
  } catch (error) {
    console.warn("Prisma AI features fetch failed, using fallback data:", error);
  }

  let filtered = [...FALLBACK_AI_FEATURES];
  if (category && category !== "All") {
    filtered = filtered.filter((f) => f.category.toLowerCase() === category.toLowerCase());
  }
  return filtered;
}

export async function safeGetAIFeatureByIdOrSlug(idOrSlug: string) {
  try {
    const feature = await prisma.aIFeature.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    });
    if (feature) return feature;
  } catch (error) {
    console.warn(`Prisma AI feature lookup failed for ${idOrSlug}, using fallback:`, error);
  }

  return (
    FALLBACK_AI_FEATURES.find((f) => f.id === idOrSlug || f.slug === idOrSlug) ||
    FALLBACK_AI_FEATURES[0]
  );
}

export async function safeGetArticles(category?: string) {
  try {
    const where: any = {};
    if (category && category !== "All") {
      where.category = category;
    }
    const articles = await prisma.article.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    if (articles && articles.length > 0) return articles;
  } catch (error) {
    console.warn("Prisma articles fetch failed, using fallback data:", error);
  }

  let filtered = [...FALLBACK_ARTICLES];
  if (category && category !== "All") {
    filtered = filtered.filter((a) => a.category.toLowerCase() === category.toLowerCase());
  }
  return filtered;
}

export async function safeGetArticleBySlug(slug: string) {
  try {
    const article = await prisma.article.findUnique({
      where: { slug },
    });
    if (article) return article;
  } catch (error) {
    console.warn(`Prisma article lookup failed for ${slug}, using fallback:`, error);
  }

  return (
    FALLBACK_ARTICLES.find((a) => a.slug === slug || a.id === slug) ||
    FALLBACK_ARTICLES[0]
  );
}

export async function safeGetOffers() {
  try {
    const offers = await prisma.offer.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    if (offers && offers.length > 0) return offers;
  } catch (error) {
    console.warn("Prisma offers fetch failed, using fallback data:", error);
  }

  return FALLBACK_OFFERS;
}
