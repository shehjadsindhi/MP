import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { authRateLimit, adminMutationRateLimit } from "@/lib/rateLimit";
import { z } from "zod";

const reviewUpdateSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  title: z.string().optional().nullable(),
  comment: z.string().optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const rateLimitResult = authRateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const result = reviewUpdateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const review = await prisma.review.findFirst({
      where: { id },
      include: { product: true },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (review.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "You can only edit your own reviews" }, { status: 403 });
    }

    const updateData: any = {};
    if (result.data.rating !== undefined) updateData.rating = result.data.rating;
    if (result.data.title !== undefined) updateData.title = result.data.title;
    if (result.data.comment !== undefined) updateData.comment = result.data.comment;

    const updated = await prisma.review.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (result.data.rating !== undefined && review.productId) {
      const allReviews = await prisma.review.findMany({
        where: { productId: review.productId },
        select: { rating: true },
      });
      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

      await prisma.product.update({
        where: { id: review.productId },
        data: {
          rating: Math.round(avgRating * 10) / 10,
          reviewCount: allReviews.length,
        },
      });
    }

    return NextResponse.json({ success: true, review: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const rateLimitResult = authRateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const review = await prisma.review.findFirst({
      where: { id },
      include: { product: true },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (review.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "You can only delete your own reviews" }, { status: 403 });
    }

    const productId = review.productId;

    await prisma.review.delete({ where: { id } });

    if (productId) {
      const allReviews = await prisma.review.findMany({
        where: { productId },
        select: { rating: true },
      });

      if (allReviews.length === 0) {
        await prisma.product.update({
          where: { id: productId },
          data: { rating: 4.8, reviewCount: 120 },
        });
      } else {
        const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
        await prisma.product.update({
          where: { id: productId },
          data: {
            rating: Math.round(avgRating * 10) / 10,
            reviewCount: allReviews.length,
          },
        });
      }
    }

    return NextResponse.json({ success: true, message: "Review deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
