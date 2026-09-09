import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { aiApiRateLimit } from "@/lib/rateLimit";
import { z } from "zod";

const shoppingSchema = z.object({
  message: z.string().min(1, "Message is required"),
  context: z.array(z.any()).optional(),
});

export async function POST(req: NextRequest) {
  const rateLimitResult = aiApiRateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const body = await req.json();
    const result = shoppingSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const message = result.data.message.trim();
    const lowerMessage = message.toLowerCase();

    let products;
    let responseMessage = "";

    if (lowerMessage.includes("camera") || lowerMessage.includes("photo") || lowerMessage.includes("photography")) {
      products = await prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: "camera" } },
            { name: { contains: "Ultra" } },
            { description: { contains: "camera" } },
            { description: { contains: "photography" } },
          ],
        },
        take: 4,
      });
      responseMessage = "Based on your interest in photography, here are the best Galaxy devices for camera performance:";
    } else if (lowerMessage.includes("gaming") || lowerMessage.includes("game")) {
      products = await prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: "S25" } },
            { name: { contains: "Fold" } },
            { description: { contains: "gaming" } },
          ],
        },
        take: 4,
      });
      responseMessage = "For gaming, these Galaxy devices offer the best performance and cooling:";
    } else if (lowerMessage.includes("student") || lowerMessage.includes("study") || lowerMessage.includes("college")) {
      products = await prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: "Tab" } },
            { name: { contains: "A series" } },
            { description: { contains: "student" } },
          ],
        },
        take: 4,
      });
      responseMessage = "Great choices for students! Here are the best Galaxy devices for learning:";
    } else if (lowerMessage.includes("fold") || lowerMessage.includes("foldable")) {
      products = await prisma.product.findMany({
        where: { name: { contains: "Fold" } },
        take: 4,
      });
      responseMessage = "Galaxy Z Fold series offers the ultimate foldable experience:";
    } else if (lowerMessage.includes("watch") || lowerMessage.includes("wearable")) {
      products = await prisma.product.findMany({
        where: { category: "Watches" },
        take: 4,
      });
      responseMessage = "Here are the latest Galaxy Watches and wearables:";
    } else if (lowerMessage.includes("audio") || lowerMessage.includes("headphone") || lowerMessage.includes("earbuds")) {
      products = await prisma.product.findMany({
        where: { category: "Audio" },
        take: 4,
      });
      responseMessage = "Premium Galaxy audio devices:";
    } else if (lowerMessage.includes("budget") || lowerMessage.includes("cheap") || lowerMessage.includes("affordable")) {
      products = await prisma.product.findMany({
        where: { price: { lt: 500 } },
        orderBy: { price: "asc" },
        take: 4,
      });
      responseMessage = "Best budget-friendly Galaxy devices:";
    } else {
      products = await prisma.product.findMany({
        where: { isFeatured: true },
        take: 4,
      });
      responseMessage = "Here are our featured Galaxy devices that might interest you:";
    }

    const formattedProducts = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      originalPrice: p.originalPrice,
      image: p.image,
      category: p.category,
      rating: p.rating,
      reviewCount: p.reviewCount,
      description: p.description,
      inStock: p.stock > 0,
    }));

    const sessionUser = await getSessionUser().catch(() => null);

    try {
      await prisma.aIInteraction.create({
        data: {
          userId: sessionUser?.id || null,
          demoType: "shopping-assistant",
          inputData: message,
          outputData: JSON.stringify({ message: responseMessage, products: formattedProducts }),
        },
      });
    } catch (dbErr) {
      console.warn("Failed to log AI interaction:", dbErr);
    }

    return NextResponse.json({
      message: responseMessage,
      products: formattedProducts,
      totalMatches: formattedProducts.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Shopping assistant error" }, { status: 500 });
  }
}
