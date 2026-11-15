import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  jsonb
} from "drizzle-orm/pg-core";

import { users } from "./users.js";

export const prescriptions = pgTable("prescriptions", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  fileName: varchar("file_name", { length: 255 }).notNull(),

  fileUrl: text("file_url").notNull(),

  extractedText: text("extracted_text"),

  investigations: jsonb("investigations"),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  publicId: varchar("public_id", { length: 255 }),
});