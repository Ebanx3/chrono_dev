import { Router } from "express";
import { ReplyPostController } from "./controller";

const router = Router()

router.post('/', ReplyPostController.createPostReply)
router.get('/', ReplyPostController.getAllPostsRely)

export default router