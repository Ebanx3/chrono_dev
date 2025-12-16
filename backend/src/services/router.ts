import { Router } from "express";
import UserRouter from "../entities/user/routes";
import PostRouter from "../entities/post/routes";
import ProjectRouter from "../entities/project/routes"

const router = Router();

router.use('/user', UserRouter)
router.use('/post', PostRouter)
router.use('/project', ProjectRouter)

export default router;