import 'dotenv/config';
import type { PrismaConfig } from "prisma";
import { env } from "prisma/config";

export default {
  schema: "prisma/postgresql/schema.prisma",
  // migrations: {
    // path: "prisma/postgresql/migrations",
    // seed: 'tsx prisma/seed.ts',
  // },
  datasource: { 
    url: env("DATABASE_URL") 
  }
} satisfies PrismaConfig;

