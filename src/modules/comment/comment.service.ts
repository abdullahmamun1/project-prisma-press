import { prisma } from "../../lib/prisma";
import {
  ICreateCommentPayload,
  IModerateCommentPayload,
  IUpdateCommentPayload,
} from "./comment.interface";

const createComment = async (
  payload: ICreateCommentPayload,
  authorId: string,
) => {
  await prisma.post.findUnique({
    where: {
      id: payload.postId,
    },
  });
  const result = await prisma.comment.create({
    data: {
      ...payload,
      authorId,
    },
  });
  return result;
};

const getCommentByAuthorId = async (authorId: string) => {
  const comments = await prisma.comment.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
  return comments;
};

const getCommentByCommentId = async (commentId: string) => {
  const comment = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          views: true,
        },
      },
    },
  });
  return comment;
};

const updateComment = async (
  payload: IUpdateCommentPayload,
  commentId: string,
  authorId: string,
) => {
  const comment = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
    },
  });
  if (authorId !== comment.authorId) {
    throw new Error("This is not your comment!");
  }

  const updatedComment = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: payload,
  });
  return updatedComment;
};

const deleteComment = async (commentId: string, authorId: string) => {
  const comment = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
    },
  });
  if (authorId !== comment.authorId) {
    throw new Error("This is not your comment!");
  }
  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });
  return null;
};

const moderateComment = async (
  commentId: string,
  payload: IModerateCommentPayload,
) => {
  const comment = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
    },
  });
  if (comment.status === payload.status) {
    throw new Error("You cannot change status to the same!");
  }
  const updatedComment = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: payload,
  });
  return updatedComment;
};

export const commentService = {
  createComment,
  getCommentByAuthorId,
  getCommentByCommentId,
  updateComment,
  deleteComment,
  moderateComment,
};
