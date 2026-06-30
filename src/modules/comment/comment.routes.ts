import { Router } from "express";
import { commentController } from "./comment.controller";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middleware/auth";

const router = Router();

router.post("/", auth(Role.USER, Role.ADMIN), commentController.createComment);
router.get("/author/:authorId", commentController.getCommentByAuthorId);
router.get("/:commentId", commentController.getCommentByCommentId);
router.patch(
  "/:commentId",
  auth(Role.USER, Role.ADMIN),
  commentController.updateComment,
);
router.delete(
  "/:commentId",
  auth(Role.USER, Role.ADMIN),
  commentController.deleteComment,
);
router.patch(
  "/:commentId/moderate",
  auth(Role.ADMIN),
  commentController.moderateComment,
);

export const commentRoutes = router;
