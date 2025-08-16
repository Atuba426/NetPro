import Post from "../models/posts.model.js";
import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import Comment from "../models/comment.model.js";

export const activeCheck = async (req, res) => {
  return res.status(200).json({ mesage: "RUNNING" });
};
//create post
export const createPost = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return req.status(400).json({ message: "User not found!" });
    }
    const post = new Post({
      userId: user._id,
      body: req.body.body,
      media: req.file != undefined ? req.file.filename : "",
      fileType: req.file != undefined ? req.file.mimetype.split("/")[1] : "",
    });
    await post.save();
    return res.status(200).json({ message: "Post Created!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//get all post
export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find().populate(
      "userId",
      "name username email profilePicture"
    );
    return res.json({ posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//delete post
export const deletePost = async (req, res) => {
  try {
    const { token, post_id } = req.body;
    const user = await User.findOne({ token: token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }
    if (post.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized access!" });
    }
    await Post.deleteOne({ _id: post_id });
    return res.json({ message: "Post Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// do comments on post
export const CommentOnPost = async (req, res) => {
  try {
    const { token, post_id, body } = req.body;
    const user = await User.findOne({ token: token }).select("_id");
    if (!user) {
      return res.status(401).json({ message: "User not found!" });
    }
    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const newComment = new Comment({
      userId: user._id,
      postId: post_id,
      body: body,
    });

    await newComment.save();

    return res.json({ message: "Comment added successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//get All comments
export const getAllComments = async (req, res) => {
  const { post_id } = req.query;
  try {
    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comments= await Comment
    .find({postId:post_id})
    .populate("userId", "username name profilePicture");
    return res.json(comments.reverse())
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Delete  Specific comments
export const deleteOneComment = async (req, res) => {
  const { token, comment_id } = req.body;
  try {
    const user = await User.findOne({ token: token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    const comment = await Comment.findOne({ _id: comment_id });
    console.log("Comment:", comment); // should not be null
    if (!comment) {
      return res.status(404).json({ message: "Comment not found!" });
    }
    if (comment.userId.toString() !== user._id.toString()) {
      return res.status(404).json({ message: "Unauthorized Acess" });
    }
    await Comment.deleteOne({ _id: comment_id });
    return res.json({ message: "Comment deleted!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Increment Likes
export const incrementLikes = async (req, res) => {
  const {post_id}=req.body;
  try {
    const post= await Post.findOne({_id:post_id});
    if(!post){
      return res.status(404).json({message:"Post Not found!"});
    }
    post.likes=post.likes + 1;
    await post.save();
    return res.json({message:"Likes Incremented!"});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
