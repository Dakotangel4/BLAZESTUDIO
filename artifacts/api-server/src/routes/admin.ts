import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import {
  AdminLoginBody,
  AdminUpdateLeadBody,
  type AdminSession,
  type AdminLead,
  type AdminLeadList,
  type AdminDeleteResult,
} from "@workspace/api-zod";
import { db, contactSubmissionsTable } from "@workspace/db";
import { logger } from "../lib/logger";
import {
  buildSessionToken,
  checkPassword,
  clearSessionCookie,
  isPasswordConfigured,
  readSession,
  requireAdmin,
  setSessionCookie,
} from "../lib/admin-auth";

const router: IRouter = Router();

const SLOW_LOGIN_DELAY_MS = 400;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toAdminLead(
  row: typeof contactSubmissionsTable.$inferSelect,
): AdminLead {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    website: row.website ?? null,
    service: row.service,
    message: row.message,
    source: row.source,
    status: row.status,
    createdAt: row.createdAt,
  };
}

router.post("/admin/login", async (req, res) => {
  if (!isPasswordConfigured()) {
    logger.warn("Admin login attempted but ADMIN_PASSWORD is not configured");
    res.status(503).json({
      error:
        "Admin login is not configured on the server. Set ADMIN_PASSWORD and restart.",
    });
    return;
  }

  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    const issues = parsed.error.issues.map(
      (i: z.ZodIssue) => `${i.path.join(".") || "(root)"}: ${i.message}`,
    );
    res.status(400).json({ error: "Invalid login", details: issues });
    return;
  }

  // Constant-ish latency to slow brute-force attempts
  await delay(SLOW_LOGIN_DELAY_MS);

  if (!checkPassword(parsed.data.password)) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  const token = buildSessionToken();
  setSessionCookie(res, token);
  const payload: AdminSession = { authenticated: true };
  res.status(200).json(payload);
});

router.post("/admin/logout", (_req, res) => {
  clearSessionCookie(res);
  const payload: AdminSession = { authenticated: false };
  res.status(200).json(payload);
});

router.get("/admin/session", (req, res) => {
  const payload: AdminSession = { authenticated: readSession(req) };
  res.status(200).json(payload);
});

router.get("/admin/leads", requireAdmin, async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(contactSubmissionsTable)
      .orderBy(desc(contactSubmissionsTable.createdAt));
    const payload: AdminLeadList = { leads: rows.map(toAdminLead) };
    res.status(200).json(payload);
  } catch (err) {
    logger.error({ err }, "Failed to list admin leads");
    res.status(500).json({ error: "Failed to load leads" });
  }
});

router.patch("/admin/leads/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const parsed = AdminUpdateLeadBody.safeParse(req.body);
  if (!parsed.success) {
    const issues = parsed.error.issues.map(
      (i: z.ZodIssue) => `${i.path.join(".") || "(root)"}: ${i.message}`,
    );
    res.status(400).json({ error: "Invalid update", details: issues });
    return;
  }

  if (!parsed.data.status) {
    res.status(400).json({ error: "No fields to update" });
    return;
  }

  try {
    const [row] = await db
      .update(contactSubmissionsTable)
      .set({ status: parsed.data.status })
      .where(eq(contactSubmissionsTable.id, id))
      .returning();

    if (!row) {
      res.status(404).json({ error: "Lead not found" });
      return;
    }
    res.status(200).json(toAdminLead(row));
  } catch (err) {
    logger.error({ err, id }, "Failed to update lead");
    res.status(500).json({ error: "Failed to update lead" });
  }
});

router.delete("/admin/leads/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  try {
    const [row] = await db
      .delete(contactSubmissionsTable)
      .where(eq(contactSubmissionsTable.id, id))
      .returning({ id: contactSubmissionsTable.id });
    if (!row) {
      res.status(404).json({ error: "Lead not found" });
      return;
    }
    const payload: AdminDeleteResult = { id: row.id, deleted: true };
    res.status(200).json(payload);
  } catch (err) {
    logger.error({ err, id }, "Failed to delete lead");
    res.status(500).json({ error: "Failed to delete lead" });
  }
});

export default router;
