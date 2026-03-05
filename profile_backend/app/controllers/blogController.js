const BlogModel = require("../models/blogModel");
const statusCode = require("../utils/statusCode");
const deleteFile = require("../utils/deleteImage");
const { cloudinary } = require("../utils/cloudImage");
const path = require("path");

class blogController {
  async createPost(req, res) {
    try {
      const { blog_title, blog_content, blog_image: bodyImage } = req.body;
      const image = req.file ? req.file.path : bodyImage;

      if (!blog_title || !blog_content) {
        return res.status(statusCode.BAD_REQUEST).json({
          success: false,
          message: "blog_title and blog_content are required.",
        });
      }

      const author =
        req.body.author || (req.user ? req.user._id || req.user.id : null);

      if (!author) {
        return res.status(statusCode.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized: Author information is missing.",
        });
      }

      if (!image) {
        return res.status(statusCode.BAD_REQUEST).json({
          success: false,
          message: "Cover image is required.",
        });
      }

      const newPost = new BlogModel({
        blog_title: blog_title,
        blog_content: blog_content,
        blog_image: image,
        blog_author: author,
      });

      await newPost.save();

      await newPost.populate("blog_author", "name email profile_image");

      return res.status(statusCode.SUCCESS).json({
        success: true,
        message: "Post created successfully",
        data: newPost,
      });
    } catch (error) {
      console.error(error);
      return res.status(statusCode.SERVER_ERROR || 500).json({
        success: false,
        message: "Failed to create post",
      });
    }
  }

  async getAllPosts(req, res) {
    try {
      const posts = await BlogModel.find()
        .populate("blog_author", "name email profile_image")
        .sort({ createdAt: -1 });

      return res.status(statusCode.SUCCESS || 200).json({
        success: true,
        message: "Posts fetched successfully",
        data: posts,
      });
    } catch (error) {
      console.error(error);
      return res.status(statusCode.SERVER_ERROR || 500).json({
        success: false,
        message: "Failed to fetch posts",
      });
    }
  }

  async getSinglePost(req, res) {
    try {
      const { id } = req.params;
      const post = await BlogModel.findById(id).populate(
        "blog_author",
        "name email profile_image about",
      );

      if (!post) {
        return res.status(statusCode.NOT_FOUND || 404).json({
          success: false,
          message: "Post not found",
        });
      }

      return res.status(statusCode.SUCCESS || 200).json({
        success: true,
        message: "Post fetched successfully",
        data: post,
      });
    } catch (error) {
      console.error(error);
      return res.status(statusCode.SERVER_ERROR || 500).json({
        success: false,
        message: "Failed to fetch post",
      });
    }
  }

  async updatePost(req, res) {
    try {
      const { id } = req.params;
      const { blog_title, blog_content, blog_image: bodyImage } = req.body;

      const post = await BlogModel.findById(id);

      if (!post) {
        return res.status(statusCode.NOT_FOUND || 404).json({
          success: false,
          message: "Post not found",
        });
      }

      const userId =
        (req.user ? req.user._id || req.user.id : null) || req.body.author;
      if (userId && post.blog_author.toString() !== userId.toString()) {
        return res.status(statusCode.UNAUTHORIZED || 403).json({
          success: false,
          message: "Unauthorized: You are not the owner of this post.",
        });
      }

      const image = req.file ? req.file.path : bodyImage;

      if (req.file && post.blog_image) {
        if (!post.blog_image.startsWith("http")) {
          const oldImagePath = path.join(__dirname, "../../", post.blog_image);
          deleteFile(oldImagePath);
        } else {
          const publicId = post.blog_image
            .split("/")
            .slice(-2)
            .join("/")
            .split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        }
      }

      if (blog_title) post.blog_title = blog_title;
      if (blog_content) post.blog_content = blog_content;
      if (image) post.blog_image = image;

      await post.save();

      return res.status(statusCode.SUCCESS || 200).json({
        success: true,
        message: "Post updated successfully",
        data: post,
      });
    } catch (error) {
      console.error(error);
      return res.status(statusCode.SERVER_ERROR || 500).json({
        success: false,
        message: "Failed to update post",
      });
    }
  }

  async deletePost(req, res) {
    try {
      const { id } = req.params;
      const post = await BlogModel.findById(id);

      if (!post) {
        return res.status(statusCode.NOT_FOUND || 404).json({
          success: false,
          message: "Post not found",
        });
      }

      const userId =
        (req.user ? req.user._id || req.user.id : null) || req.body.author;
      if (userId && post.blog_author.toString() !== userId.toString()) {
        return res.status(statusCode.UNAUTHORIZED || 403).json({
          success: false,
          message: "Unauthorized: You are not the owner of this post.",
        });
      }

      if (post.blog_image) {
        if (!post.blog_image.startsWith("http")) {
          const imagePath = path.join(__dirname, "../../", post.blog_image);
          deleteFile(imagePath);
        } else {
          const publicId = post.blog_image
            .split("/")
            .slice(-2)
            .join("/")
            .split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        }
      }

      await BlogModel.findByIdAndDelete(id);

      return res.status(statusCode.SUCCESS || 200).json({
        success: true,
        message: "Post deleted successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(statusCode.SERVER_ERROR || 500).json({
        success: false,
        message: "Failed to delete post",
      });
    }
  }
}

module.exports = new blogController();
