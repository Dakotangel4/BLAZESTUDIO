import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import path from "node:path";
import { existsSync } from "node:fs";
import router from "./routes";
import sitemapRouter from "./routes/sitemap";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors({ credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);
app.use(sitemapRouter);

/* ============================================================
   Production static frontend
   ============================================================
   In production the same Express process serves the Vite-built
   blaze-studio frontend. Vite has already content-hashed every
   bundled JS/CSS/asset (e.g. /assets/hero-bg-a3f92b1c.webm), so
   we can cache them aggressively for one full year. The HTML
   shell stays uncached so new asset hashes are picked up on
   the very next visit after a deploy.

   Express 5's express.static automatically supports HTTP Range
   requests (Accept-Ranges: bytes), which lets the hero video
   start playing before it's fully downloaded.
   ============================================================ */
if (process.env["NODE_ENV"] === "production") {
  // Default path assumes the standard monorepo layout; can be overridden
  // for non-standard deployments via STATIC_DIR.
  const staticDir = process.env["STATIC_DIR"]
    ? path.resolve(process.env["STATIC_DIR"])
    : path.resolve(__dirname, "..", "..", "blaze-studio", "dist", "public");

  if (!existsSync(staticDir)) {
    logger.warn(
      { staticDir },
      "Frontend dist directory not found — static serving disabled",
    );
  } else {
    logger.info({ staticDir }, "Serving frontend from static directory");

    // Hashed assets — 1 year, immutable. The `immutable` directive tells
    // browsers the file will never change at this URL, so they skip the
    // revalidation request entirely.
    app.use(
      "/assets",
      express.static(path.join(staticDir, "assets"), {
        maxAge: "1y",
        immutable: true,
        etag: true,
        lastModified: true,
        setHeaders: (res) => {
          res.setHeader(
            "Cache-Control",
            "public, max-age=31536000, immutable",
          );
        },
      }),
    );

    // Other root-level static files (favicon, logo, robots.txt, etc.).
    // Not content-hashed by Vite, so use a moderate cache window with
    // revalidation rather than `immutable`.
    app.use(
      express.static(staticDir, {
        index: false,
        maxAge: "1h",
        etag: true,
      }),
    );

    // SPA fallback — every unmatched non-API path returns index.html.
    // Marked `no-cache` so the browser always revalidates and discovers
    // the new hashed asset URLs immediately after a deploy.
    app.use((_req: Request, res: Response) => {
      res.setHeader("Cache-Control", "no-cache");
      res.sendFile(path.join(staticDir, "index.html"));
    });
  }
}

export default app;
