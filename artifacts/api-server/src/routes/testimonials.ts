import { Router, type IRouter } from "express";
import { asc, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import {
  AdminCreateTestimonialBody,
  AdminUpdateTestimonialBody,
  AdminReorderTestimonialsBody,
  type AdminTestimonial,
  type AdminTestimonialList,
  type AdminDeleteResult,
  type PublicTestimonial,
  type PublicTestimonialList,
} from "@workspace/api-zod";
import { db, testimonialsTable } from "@workspace/db";
import { logger } from "../lib/logger";
import { requireAdmin } from "../lib/admin-auth";

const router: IRouter = Router();

router.use("/admin/testimonials", requireAdmin);

function describeIssues(error: z.ZodError): string[] {
  return error.issues.map(
    (i: z.ZodIssue) => `${i.path.join(".") || "(root)"}: ${i.message}`,
  );
}

function normalizeDomain(input: string | undefined | null): string {
  if (!input) return "";
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "")
    .slice(0, 200);
}

function toAdmin(row: typeof testimonialsTable.$inferSelect): AdminTestimonial {
  return {
    id: row.id,
    clientName: row.clientName,
    jobTitle: row.jobTitle,
    companyName: row.companyName,
    companyDomain: row.companyDomain,
    companyLogoUrl: row.companyLogoUrl ?? null,
    profileImage: row.profileImage ?? null,
    quote: row.quote,
    rating: row.rating,
    industry: row.industry,
    resultLabel: row.resultLabel,
    published: row.published,
    displayOrder: row.displayOrder,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function toPublic(row: typeof testimonialsTable.$inferSelect): PublicTestimonial {
  return {
    id: row.id,
    clientName: row.clientName,
    jobTitle: row.jobTitle,
    companyName: row.companyName,
    companyDomain: row.companyDomain,
    companyLogoUrl: row.companyLogoUrl ?? null,
    profileImage: row.profileImage ?? null,
    quote: row.quote,
    rating: row.rating,
    industry: row.industry,
    resultLabel: row.resultLabel,
  };
}

// --- Public ---

router.get("/testimonials", async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(testimonialsTable)
      .where(eq(testimonialsTable.published, true))
      .orderBy(asc(testimonialsTable.displayOrder), asc(testimonialsTable.id));
    const payload: PublicTestimonialList = {
      testimonials: rows.map(toPublic),
    };
    res.status(200).json(payload);
  } catch (err) {
    logger.error({ err }, "Failed to list public testimonials");
    res.status(500).json({ error: "Failed to load testimonials" });
  }
});

// --- Admin ---

router.get("/admin/testimonials", async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(testimonialsTable)
      .orderBy(asc(testimonialsTable.displayOrder), asc(testimonialsTable.id));
    const payload: AdminTestimonialList = {
      testimonials: rows.map(toAdmin),
    };
    res.status(200).json(payload);
  } catch (err) {
    logger.error({ err }, "Failed to list testimonials");
    res.status(500).json({ error: "Failed to load testimonials" });
  }
});

router.get("/admin/testimonials/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const rows = await db
    .select()
    .from(testimonialsTable)
    .where(eq(testimonialsTable.id, id))
    .limit(1);
  if (rows.length === 0) {
    res.status(404).json({ error: "Testimonial not found" });
    return;
  }
  res.status(200).json(toAdmin(rows[0]));
});

router.post("/admin/testimonials", async (req, res) => {
  const parsed = AdminCreateTestimonialBody.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Invalid testimonial", details: describeIssues(parsed.error) });
    return;
  }
  const data = parsed.data;

  try {
    let displayOrder = data.displayOrder;
    if (displayOrder === undefined) {
      const [{ max }] = await db
        .select({ max: sql<number>`COALESCE(MAX(${testimonialsTable.displayOrder}), 0)::int` })
        .from(testimonialsTable);
      displayOrder = (max ?? 0) + 10;
    }

    const [row] = await db
      .insert(testimonialsTable)
      .values({
        clientName: data.clientName.trim(),
        jobTitle: data.jobTitle?.trim() ?? "",
        companyName: data.companyName.trim(),
        companyDomain: normalizeDomain(data.companyDomain),
        companyLogoUrl: data.companyLogoUrl?.trim() || null,
        profileImage: data.profileImage?.trim() || null,
        quote: data.quote.trim(),
        rating: data.rating ?? 5,
        industry: data.industry?.trim() ?? "",
        resultLabel: data.resultLabel?.trim() ?? "",
        published: data.published ?? true,
        displayOrder,
      })
      .returning();
    res.status(201).json(toAdmin(row));
  } catch (err) {
    logger.error({ err }, "Failed to create testimonial");
    res.status(500).json({ error: "Failed to create testimonial" });
  }
});

router.patch("/admin/testimonials/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = AdminUpdateTestimonialBody.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Invalid update", details: describeIssues(parsed.error) });
    return;
  }
  const data = parsed.data;
  const updates: Record<string, unknown> = { updatedAt: new Date() };

  if (data.clientName !== undefined) updates.clientName = data.clientName.trim();
  if (data.jobTitle !== undefined) updates.jobTitle = data.jobTitle.trim();
  if (data.companyName !== undefined) updates.companyName = data.companyName.trim();
  if (data.companyDomain !== undefined)
    updates.companyDomain = normalizeDomain(data.companyDomain);
  if (data.companyLogoUrl !== undefined)
    updates.companyLogoUrl = data.companyLogoUrl?.trim() || null;
  if (data.profileImage !== undefined)
    updates.profileImage = data.profileImage?.trim() || null;
  if (data.quote !== undefined) updates.quote = data.quote.trim();
  if (data.rating !== undefined) updates.rating = data.rating;
  if (data.industry !== undefined) updates.industry = data.industry.trim();
  if (data.resultLabel !== undefined) updates.resultLabel = data.resultLabel.trim();
  if (data.published !== undefined) updates.published = data.published;
  if (data.displayOrder !== undefined) updates.displayOrder = data.displayOrder;

  try {
    const [row] = await db
      .update(testimonialsTable)
      .set(updates)
      .where(eq(testimonialsTable.id, id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "Testimonial not found" });
      return;
    }
    res.status(200).json(toAdmin(row));
  } catch (err) {
    logger.error({ err, id }, "Failed to update testimonial");
    res.status(500).json({ error: "Failed to update testimonial" });
  }
});

router.delete("/admin/testimonials/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  try {
    const [row] = await db
      .delete(testimonialsTable)
      .where(eq(testimonialsTable.id, id))
      .returning({ id: testimonialsTable.id });
    if (!row) {
      res.status(404).json({ error: "Testimonial not found" });
      return;
    }
    const payload: AdminDeleteResult = { id: row.id, deleted: true };
    res.status(200).json(payload);
  } catch (err) {
    logger.error({ err, id }, "Failed to delete testimonial");
    res.status(500).json({ error: "Failed to delete testimonial" });
  }
});

router.post("/admin/testimonials/reorder", async (req, res) => {
  const parsed = AdminReorderTestimonialsBody.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Invalid reorder", details: describeIssues(parsed.error) });
    return;
  }
  const { ids } = parsed.data;

  try {
    // Verify all IDs exist
    const existing = await db
      .select({ id: testimonialsTable.id })
      .from(testimonialsTable)
      .where(inArray(testimonialsTable.id, ids));
    if (existing.length !== ids.length) {
      res.status(400).json({ error: "Some testimonials not found" });
      return;
    }

    // Apply new ordering (10, 20, 30, ...)
    const now = new Date();
    await Promise.all(
      ids.map((id, index) =>
        db
          .update(testimonialsTable)
          .set({ displayOrder: (index + 1) * 10, updatedAt: now })
          .where(eq(testimonialsTable.id, id)),
      ),
    );

    const rows = await db
      .select()
      .from(testimonialsTable)
      .orderBy(asc(testimonialsTable.displayOrder), asc(testimonialsTable.id));
    const payload: AdminTestimonialList = { testimonials: rows.map(toAdmin) };
    res.status(200).json(payload);
  } catch (err) {
    logger.error({ err }, "Failed to reorder testimonials");
    res.status(500).json({ error: "Failed to reorder testimonials" });
  }
});

export default router;
