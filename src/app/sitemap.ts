import { MetadataRoute } from "next";
import { safeGetProducts, safeGetAIFeatures, safeGetArticles } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://galaxyai-five.vercel.app";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/ai`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/ai/demos`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/ai/features`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/devices`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/compare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/learn`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/offers`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
  ];

  try {
    const [products, features, articles] = await Promise.all([
      safeGetProducts(),
      safeGetAIFeatures(),
      safeGetArticles(),
    ]);

    const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${baseUrl}/devices/${p.slug}`,
      lastModified: new Date(p.updatedAt || new Date()),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const featureRoutes: MetadataRoute.Sitemap = features.map((f) => ({
      url: `${baseUrl}/ai/features/${f.slug}`,
      lastModified: new Date(f.updatedAt || new Date()),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
      url: `${baseUrl}/learn/${a.slug}`,
      lastModified: new Date(a.updatedAt || new Date()),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    return [...staticRoutes, ...productRoutes, ...featureRoutes, ...articleRoutes];
  } catch {
    return staticRoutes;
  }
}
