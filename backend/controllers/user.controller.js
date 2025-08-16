import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import Profile from "../models/profile.model.js";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import ConnectionRequest from "../models/connection.model.js";

const convertUserDataTOPDF = (userData) => {
  const doc = new PDFDocument();
  const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
  const stream = fs.createWriteStream("uploads/" + outputPath);
  doc.pipe(stream);
  doc.image(`uploads/${userData.userId.profilePicture}`, {
    align: "center",
    width: 100,
  });
  doc.fontSize(14).text(`Name:${userData.userId.name}`);
  doc.fontSize(14).text(`Username:${userData.userId.username}`);
  doc.fontSize(14).text(`Email:${userData.userId.email}`);
  doc.fontSize(14).text(`Bio:${userData.bio}`);
  doc.fontSize(14).text(`Current Position:${userData.currentPost}`);

  doc.fontSize(14).text("Past Work:");
  userData.pastWork.forEach((work, index) => {
    doc.fontSize(14).text(`Company Name:${work.company}`);
    doc.fontSize(14).text(`Position:${work.position}`);
    doc.fontSize(14).text(`Years:${work.years}`);
  });
  doc.fontSize(14).text("Education:");
  userData.education.forEach((work, index) => {
    doc.fontSize(14).text(`School:${work.school}`);
    doc.fontSize(14).text(`Degree:${work.degree}`);
    doc.fontSize(14).text(`Study Year:${work.typeOfStudy}`);
  });

  doc.end();
  return outputPath;
};

//Register
export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;
    if (!name || !email || !password || !username)
      return res.status(400).json({ message: "All feilds are required!!" });

    const user = await User.findOne({
      email,
    });
    if (user) return res.status(400).json({ message: "User already Exists!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });
    await newUser.save();

    const newProfile = new Profile({ userId: newUser._id });
    await newProfile.save();
    return res.json({ message: "User Created Succesfully!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fiels are reaquired!" });

    const user = await User.findOne({
      email,
    });
    if (!user) return res.status(404).json({ message: "User does not exist!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

    const token = crypto.randomBytes(32).toString("hex");
    await User.updateOne({ _id: user._id }, { token });
    res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
//update profile picture

export const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return req.status(400).json({ message: "User not found!" });
    }
    user.profilePicture = req.file.filename;
    await user.save();
    return res.json({ message: "Profile Picture Updated!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//updating username & email

export const updateUserProfile = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body;
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    const { username, email } = newUserData;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      if (existingUser || String(existingUser._id) !== String(user._id)) {
        return res.status(400).json({ message: "User Already exists" });
      }
    }
    Object.assign(user, newUserData);
    await user.save();
    return res.json({ message: "User Updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// Accesing profile
export const getUserAndProfile = async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email username profilePicture"
    );
    return res.json({profile:userProfile});
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
//Updating profile
export const updateProfileData = async (req, res) => {
  try {
    const { token, ...newProfileData } = req.body;
    const userProfile = await User.findOne({ token: token });
    if (!userProfile) {
      return res.status(404).json({ message: "User not found!" });
    }
    const profile_to_update = await Profile.findOne({
      userId: userProfile._id,
    });
    if (!profile_to_update) {
      // Create new profile if it doesn't exist
      profile_to_update = new Profile({
        userId: userProfile._id,
        ...newProfileData,
      });
    } else {
      Object.assign(profile_to_update, newProfileData);
    }

    await profile_to_update.save();

    return res.json({ message: "Profile Updated!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
//get All profiles
export const getAllUserProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate(
      "userId",
      "name username email profilePicture"
    );
    return res.json({ profiles });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
//Download User profile as resume
export const downloadProfile = async (req, res) => {
  try {
    const user_id = req.query.id;
    const userProfile = await Profile.findOne({ userId: user_id }).populate(
      "userId",
      "name username email profilePicture"
    );

    let outputPath = await convertUserDataTOPDF(userProfile);
    return res.json({ message: outputPath });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
//connection request
export const sendConnectionRequest = async (req, res) => {
  const { token, connectionId } = req.body;
  console.log("Received body:", req.body);
  try {
    console.log("Token:", token);
    console.log("ConnectionId:", connectionId);
    const user = await User.findOne({ token });
    if (!user) {
     return res.status(404).json({ message: "User not found!" });
    }
    const connectionUser = await User.findOne({ _id: connectionId });
    if (!connectionUser) {
      return res.status(404).json({ message: "Connection User not found!" });
    }
    const existingRequest = await ConnectionRequest.findOne({
      userId: user._id,
      connectionId: connectionUser._id,
    });
    if (existingRequest) {
      return res.status(400).json({ message: "Request Already sent!" });
    }
    const request = new ConnectionRequest({
      userId: user._id,
      connectionId: connectionUser._id,
    });
    await request.save();
    return res.json({ message: "Request Sent" });
  } catch (error) {
   return  res.status(500).json({ message: error.message });
  }
};
//My All connection
export const  getConnectionRequest = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const connections = await ConnectionRequest.find({
      userId: user._id,
    }).populate("connectionId", "name username email profilePicture");
    return res.json({ connections });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//who send me connection request
export const getAllMyConnectionRequest = async (req, res) => {
  const { token } = req.query;
  try {
    const user = await User.findOne({ token });
    if (!user) {
    return  res.status(400).json({ message: "User not Found!" });
    }
    const connections = await  ConnectionRequest.find({
      connectionId: user._id,
    }).populate("userId", "name username email profilePicture");
    return res.json({ connections });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Accept connection Request
export const acceptConnectionRequest = async (req, res) => {
  const { token, requestId, action_type } = req.body;
  try {
    const user =await  User.findOne({ token });
    if (!user) {
      res.status(400).json({ message: "User not Found!" });
    }
    const connection = await ConnectionRequest.findOne({ _id: requestId });
    if (!connection) {
      res.status(404).json({ message: "connection not found!" });
    }
    if (action_type === "accept") {
      connection.status_accepted = true;
    }else{
      connection.status_accepted =false;
    }
    await connection.save();
    return res.json({message:"Request Accepted!"})
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//seach functionality
export const getUserAndUserprofileBasedOnUsername= async(req,res)=>{
const {username}=req.query;
try{
  const user =await  User.findOne({username});
  if (!user) {
    res.status(400).json({ message: "User not Found!" });
  }
  const userProfile= await Profile.findOne({userId:user._id})
  .populate('userId','name username email profilePicture');
  return res.json({"profile":userProfile})
}catch(error){
  res.status(500).json({ message: error.message });
}
}
//delete education
export const deleteEducation = async (req, res) => {
  try {
    const { education_id, token } = req.body;

    // Find the user by token
    const user = await User.findOne({ token }).select("_id");
    if (!user) {
      return res.status(400).json({ message: "User not Found!" });
    }

    // Find the user's profile
    const profile = await Profile.findOne({ userId: user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found!" });
    }

    // Filter out the education entry
    const initialLength = profile.education.length;
    profile.education = profile.education.filter(
      (edu) => edu._id.toString() !== education_id
    );

    // If no change, it means education_id not found
    if (profile.education.length === initialLength) {
      return res.status(404).json({ message: "Education not found!" });
    }

    // Save updated profile
    await profile.save();

    return res.json({ message: "Education deleted!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
//delete past Work
 export const deletePastWork= async(req,res)=>{
  try{
    const{work_id,token}=req.body;
    const user = await User.findOne({ token }).select("_id");
    if (!user) {
      return res.status(400).json({ message: "User not Found!" });
    }
    const profile = await Profile.findOne({ userId: user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found!" });
    }
    const initialLength = profile.pastWork.length;
    profile.pastWork = profile.pastWork.filter(
      (work) => work._id.toString() !== work_id
    );
    if (profile.pastWork.length === initialLength) {
      return res.status(404).json({ message: "past Work not found!" });
    }
    await profile.save();

    return res.json({ message: "Education deleted!" });
  }catch(error){
   return res.status(500).json({ message: "Server error", error: error.message });

  }
}



