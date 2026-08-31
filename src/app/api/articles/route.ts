import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

import { safeGetArticles, safeGetArticleBySlug } from "@/lib/db";

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
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { title, slug, category, author, readTime, excerpt, content, image, tagsJson, isFeatured } = body;
    const articleSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const article = await prisma.article.create({
      data: {
        title,
        slug: articleSlug,
        category: category || "AI Guides",
        author: author || "Galaxy AI Lab",
        readTime: readTime || "5 min read",
        excerpt: excerpt || "",
        content: content || "",
        image: image || "/images/nova_ultra.jpg",
        tagsJson: typeof tagsJson === "string" ? tagsJson : JSON.stringify(tagsJson || []),
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : false,
      },
    });

    return NextResponse.json({ success: true, article });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create article" }, { status: 500 });
  }
}
