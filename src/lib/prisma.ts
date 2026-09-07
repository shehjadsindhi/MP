import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

// Configure DATABASE_URL dynamically for local and Vercel serverless environments
function configureDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL;

  // If using PostgreSQL / Supabase or any remote database, preserve as-is
  if (envUrl && !envUrl.startsWith("file:")) {
    return envUrl;
  }

  // In Vercel serverless functions (AWS Lambda), filesystem is read-only except /tmp
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpDbPath = "/tmp/dev.db";
    try {
      if (!fs.existsSync(tmpDbPath)) {
        const candidatePaths = [
          path.join(process.cwd(), "prisma", "dev.db"),
          path.join(process.cwd(), "dev.db"),
          "/var/task/prisma/dev.db",
          "/var/task/dev.db",
        ];
        for (const candidate of candidatePaths) {
          if (fs.existsSync(candidate)) {
            fs.copyFileSync(candidate, tmpDbPath);
            break;
          }
        }
      }
      if (fs.existsSync(tmpDbPath)) {
        return `file:${tmpDbPath}`;
      }
    } catch (err) {
      console.warn("Could not copy SQLite database to /tmp on Vercel:", err);
    }
  }

  if (!envUrl) {
    return "file:./prisma/dev.db";
  }

  return envUrl;
}

process.env.DATABASE_URL = configureDatabaseUrl();

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  } catch (err) {
    console.warn("Failed to instantiate PrismaClient:", err);
    return new PrismaClient();
  }
}

export const prisma: PrismaClient = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
