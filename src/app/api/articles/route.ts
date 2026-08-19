import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const slug = searchParams.get("slug");

    if (slug) {
      const article = await prisma.article.findUnique({ where: { slug } });
      if (!article) return NextResponse.json({ error: "Article not found" }, { status: 404 });
      return NextResponse.json({ article });
    }

    const where: any = {};
    if (category && category !== "All") {
      where.category = category;
    }

    const articles = await prisma.article.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ articles });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
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
