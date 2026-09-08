import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { adminMutationRateLimit } from "@/lib/rateLimit";
import { z } from "zod";

const articleUpdateSchema = z.object({
  title: z.string().min(1).optional(),
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

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const article = await prisma.article.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ article });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const rateLimitResult = adminMutationRateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();
    const result = articleUpdateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const data = result.data;

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.author !== undefined) updateData.author = data.author;
    if (data.readTime !== undefined) updateData.readTime = data.readTime;
    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.isFeatured !== undefined) updateData.isFeatured = Boolean(data.isFeatured);
    if (data.tagsJson !== undefined) updateData.tagsJson = typeof data.tagsJson === "string" ? data.tagsJson : JSON.stringify(data.tagsJson);

    const updated = await prisma.article.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, article: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const rateLimitResult = adminMutationRateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = params;
    await prisma.article.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Article deleted successfully." });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
  }
}
