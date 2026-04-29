import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contactRouter from "./contact";
import adminRouter from "./admin";
import blogsRouter from "./blogs";
import publicBlogsRouter from "./public-blogs";
import testimonialsRouter from "./testimonials";

const router: IRouter = Router();

router.use(healthRouter);
router.use(contactRouter);
router.use(adminRouter);
router.use(blogsRouter);
router.use(publicBlogsRouter);
router.use(testimonialsRouter);

export default router;
