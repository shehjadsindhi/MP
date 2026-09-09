import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

const BACKUP_DIR = process.env.BACKUP_DIR || path.join(process.cwd(), "backups");

async function ensureBackupDir() {
  try {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
  } catch (e) {
    console.warn("Failed to create backup directory:", e);
  }
}

export async function createDatabaseBackup() {
  await ensureBackupDir();

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `backup-${timestamp}.sql`;
  const filepath = path.join(BACKUP_DIR, filename);

  try {
    const tables = [
      "User", "Product", "Order", "OrderItem", "CartItem", "WishlistItem",
      "AIFeature", "Article", "AIInteraction", "NewsletterSubscriber", "Review", "Offer"
    ];

    let sql = `-- Galaxy AI Hub Database Backup\n-- Generated: ${new Date().toISOString()}\n\n`;

    for (const table of tables) {
      const records = await (prisma as any)[table.toLowerCase()].findMany();
      if (records.length === 0) continue;

      sql += `\n-- Table: ${table}\n`;
      sql += `DELETE FROM ${table} WHERE 1=1;\n\n`;

      for (const record of records) {
        const columns = Object.keys(record).join(", ");
        const values = Object.values(record).map((v) => {
          if (v === null) return "NULL";
          if (typeof v === "string") return `'${v.replace(/'/g, "\\'")}'`;
          if (v instanceof Date) return `'${v.toISOString()}'`;
          return v;
        }).join(", ");

        sql += `INSERT INTO ${table} (${columns}) VALUES (${values});\n`;
      }
    }

    await fs.writeFile(filepath, sql, "utf-8");

    const stats = await fs.stat(filepath);
    return {
      success: true,
      filename,
      path: filepath,
      size: stats.size,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Backup failed",
    };
  }
}

export async function listBackups() {
  try {
    await ensureBackupDir();
    const files = await fs.readdir(BACKUP_DIR);
    const backups = await Promise.all(
      files
        .filter((f) => f.startsWith("backup-") && f.endsWith(".sql"))
        .map(async (filename) => {
          const filepath = path.join(BACKUP_DIR, filename);
          const stats = await fs.stat(filepath);
          return {
            filename,
            path: filepath,
            size: stats.size,
            createdAt: stats.mtime,
          };
        })
    );

    return backups.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    return [];
  }
}

export async function deleteBackup(filename: string) {
  try {
    const filepath = path.join(BACKUP_DIR, filename);
    await fs.unlink(filepath);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete backup" };
  }
}

export async function restoreBackup(filename: string) {
  try {
    const filepath = path.join(BACKUP_DIR, filename);
    const sql = await fs.readFile(filepath, "utf-8");

    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s && !s.startsWith("--"));

    for (const statement of statements) {
      if (statement.startsWith("INSERT INTO")) {
        await prisma.$executeRawUnsafe(statement + ";");
      }
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to restore backup" };
  }
}
