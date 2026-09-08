import { Router } from "express";
import { PostController } from "./controller";
import { mustBeAuthenticated } from "../../middlewares/mustBeAuthenticated";

const router = Router();

router.get("/", PostController.getAllPosts);
router.get("/:postId", PostController.getPostById);
router.post("/", mustBeAuthenticated, PostController.createPost);
router.patch(
  "/:recognitionType/:postId",
  mustBeAuthenticated,
  PostController.addOrRemoveLike,
);

export default router;
