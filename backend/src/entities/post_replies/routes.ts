import { Router } from "express";
import { ReplyPostController } from "./controller";
import { authenticate } from "../../middlewares/authenticate";

const router = Router()

router.post('/:postId', authenticate, ReplyPostController.createPostReply)
router.get('/', ReplyPostController.getAllPostsRely)

export default router