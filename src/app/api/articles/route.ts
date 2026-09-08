import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { adminMutationRateLimit } from "@/lib/rateLimit";
import { z } from "zod";

import { safeGetArticles, safeGetArticleBySlug } from "@/lib/db";

const articleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  category: z.string().optional(),
  author: z.string().optional(),
  readTime: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  image: z.string().optional(),
  tagsJson: z.unknown().optional(),
  isFeatured: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const slug = searchParams.get("slug");

    if (slug) {
      const article = await safeGetArticleBySlug(slug);
      return NextResponse.json({ article });
    }

    const articles = await safeGetArticles(category);

    return NextResponse.json({ articles });
  } catch (error) {
    const articles = await safeGetArticles();
    return NextResponse.json({ articles });
  }
}

export async function POST(req: NextRequest) {
  const rateLimitResult = adminMutationRateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const result = articleSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const data = result.data;
    const articleSlug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const article = await prisma.article.create({
      data: {
        title: data.title,
        slug: articleSlug,
        category: data.category || "AI Guides",
        author: data.author || "Galaxy AI Lab",
        readTime: data.readTime || "5 min read",
        excerpt: data.excerpt || "",
        content: data.content || "",
        image: data.image || "/images/nova_ultra.jpg",
        tagsJson: typeof data.tagsJson === "string" ? data.tagsJson : JSON.stringify(data.tagsJson || []),
        isFeatured: data.isFeatured !== undefined ? Boolean(data.isFeatured) : false,
      },
    });

    return NextResponse.json({ success: true, article });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}
