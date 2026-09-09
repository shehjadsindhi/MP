import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://galaxyaihub.com";

  const products = await prisma.product.findMany({ select: { slug: true, updatedAt: true } });
  const articles = await prisma.article.findMany({ select: { slug: true, updatedAt: true } });
  const aiFeatures = await prisma.aIFeature.findMany({ select: { slug: true, updatedAt: true } });

  const staticPages = [
    { url: baseUrl, priority: 1.0, changefreq: "daily" as const },
    { url: `${baseUrl}/devices`, priority: 0.9, changefreq: "daily" as const },
    { url: `${baseUrl}/ai`, priority: 0.9, changefreq: "weekly" as const },
    { url: `${baseUrl}/ai/demos`, priority: 0.8, changefreq: "weekly" as const },
    { url: `${baseUrl}/learn`, priority: 0.8, changefreq: "weekly" as const },
    { url: `${baseUrl}/offers`, priority: 0.7, changefreq: "weekly" as const },
    { url: `${baseUrl}/compare`, priority: 0.7, changefreq: "weekly" as const },
    { url: `${baseUrl}/search`, priority: 0.6, changefreq: "monthly" as const },
    { url: `${baseUrl}/cart`, priority: 0.5, changefreq: "weekly" as const },
    { url: `${baseUrl}/wishlist`, priority: 0.5, changefreq: "weekly" as const },
    { url: `${baseUrl}/checkout`, priority: 0.5, changefreq: "weekly" as const },
    { url: `${baseUrl}/login`, priority: 0.3, changefreq: "monthly" as const },
    { url: `${baseUrl}/register`, priority: 0.3, changefreq: "monthly" as const },
  ];

  const productUrls = products.map((p) => ({
    url: `${baseUrl}/devices/${p.slug}`,
    lastModified: p.updatedAt,
    priority: 0.8,
    changefreq: "weekly" as const,
  }));

  const articleUrls = articles.map((a) => ({
    url: `${baseUrl}/learn/${a.slug}`,
    lastModified: a.updatedAt,
    priority: 0.7,
    changefreq: "weekly" as const,
  }));

  const featureUrls = aiFeatures.map((f) => ({
    url: `${baseUrl}/ai/features/${f.slug}`,
    lastModified: f.updatedAt,
    priority: 0.7,
    changefreq: "weekly" as const,
  }));

  return [...staticPages, ...productUrls, ...articleUrls, ...featureUrls];
}
