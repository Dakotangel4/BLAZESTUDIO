import { Router, type IRouter } from "express";
import { z } from "zod";
import {
  CreateContactSubmissionBody,
  type ContactSubmissionResult,
} from "@workspace/api-zod";
import { db, contactSubmissionsTable } from "@workspace/db";
import { logger } from "../lib/logger";

const router: IRouter = Router();

router.post("/contact-submissions", async (req, res) => {
  const parsed = CreateContactSubmissionBody.safeParse(req.body);

  if (!parsed.success) {
    const issues = parsed.error.issues.map(
      (i: z.ZodIssue) => `${i.path.join(".") || "(root)"}: ${i.message}`,
    );
    res.status(400).json({
      error: "Invalid submission",
      details: issues,
    });
    return;
  }

  const data = parsed.data;

  try {
    const [row] = await db
      .insert(contactSubmissionsTable)
      .values({
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email.trim().toLowerCase(),
        website: data.website?.trim() || null,
        service: data.service.trim(),
        message: data.message.trim(),
        source: data.source?.trim() || "contact_form",
      })
      .returning({
        id: contactSubmissionsTable.id,
        createdAt: contactSubmissionsTable.createdAt,
      });

    const payload: ContactSubmissionResult = {
      id: row.id,
      receivedAt: row.createdAt,
    };

    res.status(201).json(payload);
  } catch (err) {
    logger.error({ err }, "Failed to store contact submission");
    res.status(500).json({
      error: "Failed to save submission. Please try again or use WhatsApp.",
    });
  }
});

export default router;
