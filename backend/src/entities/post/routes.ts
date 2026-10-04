import { Router } from "express";
import { PostController } from "./controller";
import { mustBeAuthenticated } from "../../middlewares/mustBeAuthenticated";
import { validateBody } from "../../middlewares/validateBody";
import { PostSchemas } from "./zod";

const router = Router();

router.get("/", PostController.getAllPosts);
router.get("/byUserId/:userId", PostController.getPostsByUserId);
router.get("/:postId", PostController.getPostById);
router.post(
  "/",
  mustBeAuthenticated,
  validateBody(PostSchemas.createPostSchema),
  PostController.createPost,
);
router.patch(
  "/:recognitionType/:postId",
  mustBeAuthenticated,
  PostController.addOrRemoveRecognition,
);

export default router;
