import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const blogCategoriesTable = pgTable("blog_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type BlogCategory = typeof blogCategoriesTable.$inferSelect;
