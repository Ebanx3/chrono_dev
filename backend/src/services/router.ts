import { Router } from "express";
import UserRouter from "../entities/user/routes";
import PostRouter from "../entities/post/routes";
import ProjectRouter from "../entities/project/routes"
import PostRepliesRouter from "../entities/post_replies/routes";

const router = Router();

router.use('/user', UserRouter)
router.use('/post', PostRouter)
router.use('/project', ProjectRouter)
router.use('/post-replies', PostRepliesRouter)

export default router;