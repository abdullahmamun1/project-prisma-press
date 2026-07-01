import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { postService } from "./post.service";
import { sendResponse } from "../../utils/sendResponse";

const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    const payload = req.body;
    const result = await postService.createPostInDB(payload, id as string);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Post created successfully",
      data: result,
    });
  },
);
const getAllPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await postService.getAllPostsFromDB(query);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All posts retrieved successfully",
      data: result,
    });
  },
);
const getPostStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getPostStatsFromDB();
    console.log(result);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post stats retrieved successfully",
      data: result,
    });
  },
);
const getMyPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const result = await postService.getMyPostsFromDB(authorId as string);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "My posts retrieved successfully",
      data: result,
    });
  },
);
const getPostById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    if (!postId) {
      throw new Error("Post Id Required");
    }
    const post = await postService.getPostByIdFromDB(postId as string);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post retrieved successfully",
      data: post,
    });
  },
);
const updatePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";
    const { postId } = req.params;
    if (!postId) {
      throw new Error("Post Id Required");
    }
    const payload = req.body;
    const result = await postService.updatePostInDB(
      postId as string,
      payload,
      authorId as string,
      isAdmin,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post updated successfully",
      data: result,
    });
  },
);
const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";
    const { postId } = req.params;
    if (!postId) {
      throw new Error("Post Id Required");
    }
    await postService.deletePostInDB(
      postId as string,
      authorId as string,
      isAdmin,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post deleted successfully",
      data: null,
    });
  },
);

export const postController = {
  createPost,
  getAllPosts,
  getPostStats,
  getMyPosts,
  getPostById,
  updatePost,
  deletePost,
};
