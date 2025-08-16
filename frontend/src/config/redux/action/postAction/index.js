import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllPost = createAsyncThunk(
  "post/getAllPosts",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/get_all_posts");

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const createPost = createAsyncThunk(
  "post/createPost",
  async (userData, thunkAPI) => {
    const { file, body } = userData;
    try {
      const formData = new FormData();
      formData.append("token", localStorage.getItem("token"));
      formData.append("body", body);
      formData.append("media", file);
      const response = await clientServer.post("/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status == 200) {
        return thunkAPI.fulfillWithValue("Post Uploaded");
      } else {
        return thunkAPI.rejectWithValue("Post not Uploaded");
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (post_id, thunkAPI) => {
    try {
      const response = await clientServer.delete("/delete_post", {
        data: {
          token: localStorage.getItem("token"),
          post_id: post_id.post_id,
        },
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue("Something went Wrong");
    }
  }
);
export const incrementPostLikes = createAsyncThunk(
  "post/incrementLikes",
  async (post, thunkAPI) => {
    try {
      const response = await clientServer.post("/increment_like", {
        post_id: post.post_id,
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const getAllComments = createAsyncThunk(
  "post/getAllComments",
  async (postData, thunkAPI) => {
    try {
      const response = await clientServer.get("/get_all_comments", {
        params: {
          post_id: postData.post_id,
        },
      });

      return thunkAPI.fulfillWithValue({
        comments: response.data,
        post_id: postData.post_id,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue("Something went wrong!!");
    }
  }
);
export const postComment = createAsyncThunk(
  "post/postComment",
  async (commentData, thunkAPI) => {
    try {
      console.log({
        post_id: commentData.post_id,
        comment: commentData.body,
      });
      const response = await clientServer.post("/comment_on_post", {
        token: localStorage.getItem("token"),
        post_id: commentData.post_id,
        body: commentData.body,
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue("Something went wrong!!");
    }
  }
);
export const deleteOneComment = createAsyncThunk(
  "post/deleteOneComment",
  async (comment_id, thunkAPI) => {
    try {
     
      const response = await clientServer.delete("/delete_comment", {
       data: {
          token: localStorage.getItem("token"),
          comment_id: comment_id.comment_id,
        },
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue("Something went Wrong");
    }
  }
);
