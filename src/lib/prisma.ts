import { PrismaClient } from "@prisma/client";
import { env, validateRuntimeEnv } from "./env";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  // Only validate when actually creating the client at runtime
  if (!globalForPrisma.prisma) {
    validateRuntimeEnv(); // ✅ runs at runtime
  }

  return new PrismaClient({
    log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
