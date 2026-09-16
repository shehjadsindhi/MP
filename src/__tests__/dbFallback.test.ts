import {
  safeGetProducts,
  safeGetProductByIdOrSlug,
  safeGetAIFeatures,
  safeGetAIFeatureByIdOrSlug,
  safeGetArticles,
  safeGetArticleBySlug,
  safeGetOffers,
} from "@/lib/db";

describe("Database Access & High-Availability Fallbacks", () => {
  describe("safeGetProducts", () => {
    it("should return products list", async () => {
      const products = await safeGetProducts();
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBeGreaterThan(0);
      expect(products[0]).toHaveProperty("name");
      expect(products[0]).toHaveProperty("price");
      expect(products[0]).toHaveProperty("category");
    });

    it("should filter products by category", async () => {
      const smartphones = await safeGetProducts({ category: "Smartphones" });
      expect(Array.isArray(smartphones)).toBe(true);
      expect(smartphones.length).toBeGreaterThan(0);
      smartphones.forEach((p) => {
        expect(p.category.toLowerCase()).toBe("smartphones");
      });
    });

    it("should filter products by search query", async () => {
      const results = await safeGetProducts({ search: "Ultra" });
      expect(Array.isArray(results)).toBe(true);
      results.forEach((p) => {
        const text = `${p.name} ${p.description} ${p.category}`.toLowerCase();
        expect(text).toContain("ultra");
      });
    });

    it("should filter products by price range", async () => {
      const minPrice = 300;
      const maxPrice = 1200;
      const results = await safeGetProducts({ minPrice, maxPrice });
      expect(Array.isArray(results)).toBe(true);
      results.forEach((p) => {
        expect(p.price).toBeGreaterThanOrEqual(minPrice);
        expect(p.price).toBeLessThanOrEqual(maxPrice);
      });
    });

    it("should sort products by price ascending", async () => {
      const results = await safeGetProducts({ sort: "price-asc" });
      for (let i = 1; i < results.length; i++) {
        expect(results[i].price).toBeGreaterThanOrEqual(results[i - 1].price);
      }
    });

    it("should sort products by price descending", async () => {
      const results = await safeGetProducts({ sort: "price-desc" });
      for (let i = 1; i < results.length; i++) {
        expect(results[i].price).toBeLessThanOrEqual(results[i - 1].price);
      }
    });
  });

  describe("safeGetProductByIdOrSlug", () => {
    it("should retrieve product by valid slug or id", async () => {
      const all = await safeGetProducts();
      const first = all[0];
      const found = await safeGetProductByIdOrSlug(first.slug);
      expect(found).not.toBeNull();
      expect(found?.slug).toBe(first.slug);
    });

    it("should return null for empty or non-existent slug", async () => {
      expect(await safeGetProductByIdOrSlug("")).toBeNull();
      expect(await safeGetProductByIdOrSlug("completely-non-existent-device-slug")).toBeNull();
    });
  });

  describe("safeGetAIFeatures", () => {
    it("should return list of AI features", async () => {
      const features = await safeGetAIFeatures();
      expect(Array.isArray(features)).toBe(true);
      expect(features.length).toBeGreaterThan(0);
      expect(features[0]).toHaveProperty("slug");
      expect(features[0]).toHaveProperty("name");
      expect(features[0]).toHaveProperty("demoTab");
    });

    it("should find feature by slug", async () => {
      const all = await safeGetAIFeatures();
      const first = all[0];
      const found = await safeGetAIFeatureByIdOrSlug(first.slug);
      expect(found).not.toBeNull();
      expect(found?.slug).toBe(first.slug);
    });
  });

  describe("safeGetArticles and safeGetOffers", () => {
    it("should return articles with titles and excerpts", async () => {
      const articles = await safeGetArticles();
      expect(Array.isArray(articles)).toBe(true);
      expect(articles.length).toBeGreaterThan(0);
      expect(articles[0]).toHaveProperty("title");
      expect(articles[0]).toHaveProperty("slug");
    });

    it("should return active promotional offers", async () => {
      const offers = await safeGetOffers();
      expect(Array.isArray(offers)).toBe(true);
      expect(offers.length).toBeGreaterThan(0);
      expect(offers[0]).toHaveProperty("code");
    });
  });
});
