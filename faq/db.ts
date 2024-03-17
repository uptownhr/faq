import { PrismaClient } from "./generated/client";

export const db = new PrismaClient({
  datasources: {
    db: {
      url: process.env.FAQ_DB_URL || "",
    },
  },
});
