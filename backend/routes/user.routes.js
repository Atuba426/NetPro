import { Router } from "express";
import{register} from '../controllers/user.controller.js';
import {login} from '../controllers/user.controller.js';
import { uploadProfilePicture } from "../controllers/user.controller.js";
import {getUserAndProfile} from "../controllers/user.controller.js";
import{updateProfileData} from "../controllers/user.controller.js";
import {getAllUserProfile} from "../controllers/user.controller.js";
import {downloadProfile}from "../controllers/user.controller.js";
import {sendConnectionRequest} from '../controllers/user.controller.js';
import {getAllMyConnectionRequest} from '../controllers/user.controller.js';
import {acceptConnectionRequest} from '../controllers/user.controller.js';
import {getUserAndUserprofileBasedOnUsername} from "../controllers/user.controller.js"
import {getConnectionRequest} from "../controllers/user.controller.js"
import {updateUserProfile} from "../controllers/user.controller.js";
import {deleteEducation} from "../controllers/user.controller.js";
import {deletePastWork} from "../controllers/user.controller.js";
import multer from 'multer'
const router=Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Folder to store files
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname); // Unique file name
    }
});
const upload=multer({storage:storage})
router.route("/update_profile_picture")
.post(upload.single('profile_picture'),uploadProfilePicture)




router.route('/register').post(register);
router.route('/login').post(login);
router.route('/user_update').post(updateUserProfile);
router.route('/get_user_and_profile').get(getUserAndProfile);
router.route('/update_profile_data').post(updateProfileData);
router.route('/user/get_all_users').get(getAllUserProfile);
router.route('/user/download_resume').get(downloadProfile);
router.route('/user/send_connection_request').post(sendConnectionRequest);
router.route('/user/get_all_my_connections').get(getAllMyConnectionRequest);
router.route('/user/get_connection_requests').post(getConnectionRequest);
router.route('/user/accept_connections').post(acceptConnectionRequest);
router.route('/getUser_And_Userprofile_BasedOn_Username').get(getUserAndUserprofileBasedOnUsername);
router.route('/delete_education').delete(deleteEducation);
router.route('/delete_pastWork').delete(deletePastWork);

export default router;
