import { Router } from "express";
import { ReplyPostController } from "./controller";
import { authenticate } from "../../middlewares/authenticate";
import { mustBeAuthenticated } from "../../middlewares/mustBeAuthenticated";

const router = Router()

router.post('/:postId', mustBeAuthenticated, ReplyPostController.createPostReply)
router.get('/:postId', ReplyPostController.getAllPostReplies)

export default router