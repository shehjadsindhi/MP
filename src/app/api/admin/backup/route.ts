import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { createDatabaseBackup, listBackups, deleteBackup, restoreBackup } from "@/lib/backup";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    if (action === "list") {
      const backups = await listBackups();
      return NextResponse.json({ backups });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch backups" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { action, filename } = body;

    if (action === "create") {
      const result = await createDatabaseBackup();
      return NextResponse.json(result);
    }

    if (action === "restore" && filename) {
      const result = await restoreBackup(filename);
      return NextResponse.json(result);
    }

    if (action === "delete" && filename) {
      const result = await deleteBackup(filename);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Backup operation failed" }, { status: 500 });
  }
}
