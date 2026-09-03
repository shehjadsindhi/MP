import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

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
  try {
    await requireAdmin();
    const { id } = params;
    const body = await req.json();

    const updated = await prisma.article.update({
      where: { id },
      data: {
        ...(body.title ? { title: body.title } : {}),
        ...(body.category ? { category: body.category } : {}),
        ...(body.author ? { author: body.author } : {}),
        ...(body.readTime ? { readTime: body.readTime } : {}),
        ...(body.excerpt !== undefined ? { excerpt: body.excerpt } : {}),
        ...(body.content !== undefined ? { content: body.content } : {}),
        ...(body.image !== undefined ? { image: body.image } : {}),
        ...(body.isFeatured !== undefined ? { isFeatured: Boolean(body.isFeatured) } : {}),
        ...(body.tagsJson ? { tagsJson: typeof body.tagsJson === "string" ? body.tagsJson : JSON.stringify(body.tagsJson) } : {}),
      },
    });

    return NextResponse.json({ success: true, article: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update article" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const { id } = params;

    await prisma.article.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Article deleted successfully." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete article" }, { status: 500 });
  }
}
