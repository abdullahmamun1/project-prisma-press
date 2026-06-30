import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { commentService } from "./comment.service";
import { sendResponse } from "../../utils/sendResponse";

const createComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const authorId = req.user?.id;
    const comment = await commentService.createComment(
      payload,
      authorId as string,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Comment created successfully",
      data: comment,
    });
  },
);
const getCommentByAuthorId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { authorId } = req.params;
    const comments = await commentService.getCommentByAuthorId(
      authorId as string,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comments retrieved successfully by author ID",
      data: comments,
    });
  },
);
const getCommentByCommentId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;
    const comment = await commentService.getCommentByCommentId(
      commentId as string,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comment retrieved successfully",
      data: comment,
    });
  },
);
const updateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const { commentId } = req.params;
    const authorId = req.user?.id;
    const comment = await commentService.updateComment(
      payload,
      commentId as string,
      authorId as string,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comment updated successfully",
      data: comment,
    });
  },
);
const deleteComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const { commentId } = req.params;
    await commentService.deleteComment(commentId as string, authorId as string);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comment deleted successfully",
      data: null,
    });
  },
);
const moderateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId;
    console.log(commentId);
    const payload = req.body;
    const result = await commentService.moderateComment(
      commentId as string,
      payload,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comment status updated successfully",
      data: result,
    });
  },
);

export const commentController = {
  createComment,
  getCommentByAuthorId,
  getCommentByCommentId,
  updateComment,
  deleteComment,
  moderateComment,
};
