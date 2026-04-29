import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const testimonialsTable = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  clientName: text("client_name").notNull(),
  jobTitle: text("job_title").notNull().default(""),
  companyName: text("company_name").notNull(),
  companyDomain: text("company_domain").notNull().default(""),
  companyLogoUrl: text("company_logo_url"),
  profileImage: text("profile_image"),
  quote: text("quote").notNull(),
  rating: integer("rating").notNull().default(5),
  industry: text("industry").notNull().default(""),
  resultLabel: text("result_label").notNull().default(""),
  published: boolean("published").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Testimonial = typeof testimonialsTable.$inferSelect;
