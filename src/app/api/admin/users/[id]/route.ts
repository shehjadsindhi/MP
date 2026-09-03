import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const { id } = params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        city: true,
        postalCode: true,
        country: true,
        savedPersona: true,
        createdAt: true,
        orders: {
          include: { items: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unauthorized" }, { status: 403 });
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

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(body.role ? { role: body.role } : {}),
        ...(body.name ? { name: body.name } : {}),
        ...(body.email ? { email: body.email } : {}),
        ...(body.phone !== undefined ? { phone: body.phone } : {}),
        ...(body.address !== undefined ? { address: body.address } : {}),
        ...(body.city !== undefined ? { city: body.city } : {}),
        ...(body.postalCode !== undefined ? { postalCode: body.postalCode } : {}),
        ...(body.country !== undefined ? { country: body.country } : {}),
        ...(body.savedPersona !== undefined ? { savedPersona: body.savedPersona } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        city: true,
        postalCode: true,
        country: true,
        savedPersona: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin();
    const { id } = params;

    // Prevent admin from deleting their own active account
    if (admin.id === id) {
      return NextResponse.json({ error: "Cannot delete your own active administrator account." }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "User account deleted successfully." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete user" }, { status: 500 });
  }
}
