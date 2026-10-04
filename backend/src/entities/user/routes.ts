import { Router } from "express";
import { AuthController } from "./auth.controller";
import { UserController } from "./controller";
import { mustBeAuthenticated } from "../../middlewares/mustBeAuthenticated";
import { AuthSchemas } from "./zod";
import { validateBody } from "../../middlewares/validateBody";

const router = Router();

//Auth routes
router.post(
  "/register",
  validateBody(AuthSchemas.registerSchema),
  AuthController.register,
);
router.post(
  "/login",
  validateBody(AuthSchemas.loginSchema),
  AuthController.login,
);
router.post("/logout", AuthController.logout);
router.get("/verify_email", AuthController.verifyEmail);

//User routes
router.get(
  "/cloudinary_signature",
  mustBeAuthenticated,
  UserController.getCloudinarySignature,
);
router.post("/:userId/follow", mustBeAuthenticated, UserController.followUser);
router.get("/:userId", UserController.getUserById);
router.get("/", UserController.getAllUsers);
router.patch(
  "/",
  mustBeAuthenticated,
  validateBody(AuthSchemas.updateUserSchema),
  UserController.updateUser,
);

export default router;
