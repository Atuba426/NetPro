import {Router} from "express";
import { activeCheck } from "../controllers/posts.controller.js";
import {createPost} from "../controllers/posts.controller.js";
import {getAllPost} from "../controllers/posts.controller.js";
import {deletePost} from "../controllers/posts.controller.js";
import {CommentOnPost} from "../controllers/posts.controller.js";
import {getAllComments} from "../controllers/posts.controller.js";
import {deleteOneComment} from "../controllers/posts.controller.js";
import {incrementLikes} from "../controllers/posts.controller.js";
import multer from 'multer'
const router = Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Folder to store files
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname); // Unique file name
    }
});
const upload=multer({storage:storage});


router.route("/").get(activeCheck);
router.route("/post").post(upload.single('media'),createPost);
router.route("/get_all_posts").get(getAllPost);
router.route("/delete_post").delete(deletePost);
router.route("/comment_on_post").post(CommentOnPost);
router.route("/get_all_comments").get(getAllComments);
router.route("/delete_comment").delete(deleteOneComment);
router.route("/increment_like").post(incrementLikes);

export default router;