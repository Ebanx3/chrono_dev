import { Router } from "express";
import UserRouter from "../entities/user/routes";
import PostRouter from "../entities/post/routes";

const router = Router();

router.use('/user', UserRouter)
router.use('/post', PostRouter)

export default router;