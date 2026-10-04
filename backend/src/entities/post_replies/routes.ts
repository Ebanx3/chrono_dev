import { Router } from "express";
import { ReplyPostController } from "./controller";
import { mustBeAuthenticated } from "../../middlewares/mustBeAuthenticated";
import { PostReplySchemas } from "./zod";
import { validateBody } from "../../middlewares/validateBody";

const router = Router();

router.post(
  "/:postId",
  mustBeAuthenticated,
  validateBody(PostReplySchemas.createPostReplySchema),
  ReplyPostController.createPostReply,
);
router.get("/:postId", ReplyPostController.getAllPostReplies);

export default router;
