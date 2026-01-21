import { Router } from "express";
import { ReplyPostController } from "./controller";
import { authenticate } from "../../middlewares/authenticate";

const router = Router()

router.post('/:postId', authenticate, ReplyPostController.createPostReply)
router.get('/:postId', ReplyPostController.getAllPostsRelies)

export default router