import { StatusCodes } from "http-status-codes";
import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

class CommentController {
    // [POST] /api/v1/comments
    async createComment(req, res) {
        try {
            const { postId, content, parentComment } = req.body;

            const post = await Post.findById(postId);
            if (!post) {
                return res.status(StatusCodes.NOT_FOUND).json({ success: false, error: "Post not found" });
            }

            const user = await User.findOne({ _id: req.user.userId });
            if (!user) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    error: "User not found",
                });
            }

            const userId = user._id;

            const newComment = await Comment.create({
                postId,
                userId,
                content,
                parentComment: parentComment || null
            });

            return res.status(StatusCodes.CREATED).json({
                success: true,
                message: "Comment added successfully",
                result: newComment
            });
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, error: error.message });
        }
    }

    // [GET] /api/v1/comments/:postId
    async getCommentsByPost(req, res) {
        try {
            const { postId } = req.params;
            const comments = await Comment.find({ postId })
                .populate("userId", "username fullName profilePicture")
                .populate("likes", "username fullName")
                .sort({ createdAt: -1 });

            return res.status(StatusCodes.OK).json({
                success: true,
                result: comments
            });
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, error: error.message });
        }
    }

    // [PUT] /api/v1/comments/:id
    async updateComment(req, res) {
        try {
            const { id } = req.params;
            const { content } = req.body;

            const comment = await Comment.findById(id);
            if (!comment) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    error: "Comment not found",
                });
            }

            comment.content = content;
            await comment.save();

            return res.status(StatusCodes.OK).json({
                success: true,
                message: "Comment updated successfully",
                result: comment,
            });
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: error.message,
            });
        }
    }

    // [DELETE] /api/v1/comments/:id
    async deleteComment(req, res) {
        try {
            const { id } = req.params;

            const comment = await Comment.findById(id);
            if (!comment) {
                return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Comment not found" });
            }

            await Comment.findByIdAndDelete(id);
            return res.status(StatusCodes.OK).json({ success: true, message: "Comment deleted successfully" });
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, error: error.message });
        }
    }

    // [POST] /api/v1/comments/like
    async likeComment(req, res) {
        try {
            const { commentId } = req.body;

            const user = await User.findOne({ _id: req.user.userId });
            if (!user) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    error: "User not found",
                });
            }

            const comment = await Comment.findById(commentId);
            if (!comment) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    error: "Comment not found",
                });
            }

            const index = comment.likes.indexOf(user._id);
            if (index === -1) {
                comment.likes.push(user._id);
            } else {
                comment.likes.splice(index, 1);
            }

            await comment.save();

            return res.status(StatusCodes.OK).json({
                success: true,
                message: index === -1 ? "Comment liked" : "Comment unliked",
                result: comment.likes,
            });
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: error.message,
            });
        }
    }
}

export default new CommentController();
