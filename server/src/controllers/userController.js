const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const {
  isValid,
  isValidName,
  isValidPhone,
  isValidEmail,
  isValidPassword,
} = require("../utils/validator");

// Signunp User
const signupUser = async (req, res) => {
  try {
    let userData = req.body;

    if (!userData || Object.keys(userData).length === 0) {
      return res.status(400).json({ msg: "Bad Request!! No Data Provided" });
    }

    let { name, email, phone, password, authProvider } = userData;
    // Auth Provider
    if (!isValid(authProvider)) {
      return res.status(400).json({ msg: "AuthProvider is required" });
    }

    if (!["google", "phone", "manual"].includes(authProvider)) {
      return res.status(400).json({ msg: "Invalid AuthProvider" });
    }

    if (authProvider !== "manual") {
      return res.status(400).json({
        msg: "Use Respective login API for google or OTP Authentication",
      });
    }
    if (authProvider === "manual") {
      // Name Validation
      if (!isValid(name)) {
        return res.status(400).json({ msg: "name is required" });
      }
      if (!isValidName(name)) {
        return res.status(400).json({ msg: "Invalid Name" });
      }
      // Email Validation
      if (!isValid(email)) {
        return res.status(400).json({ msg: "email is required" });
      }
      if (!isValidEmail(email)) {
        return res.status(400).json({ msg: "Invalid Email" });
      }
      let duplicateEmail = await userModel.findOne({ email });
      if (duplicateEmail) {
        return res.status(400).json({ msg: "Email Already Exist" });
      }
      // Phone Validation
      if (!isValid(phone)) {
        return res.status(400).json({ msg: "Phone Number is required" });
      }
      if (!isValidPhone(phone)) {
        return res.status(400).json({ msg: "Invalid Phone Number" });
      }
      let duplicatePhone = await userModel.findOne({ phone });
      if (duplicatePhone) {
        return res.status(400).json({ msg: "Phone Number Already Exist" });
      }
      // Password Validation
      if (!isValid(password)) {
        return res.status(400).json({ msg: "Phone Number is required" });
      }
      if (!isValidPassword(password)) {
        return res.status(400).json({ msg: "Invalid Password" });
      }
      let hashedPassword = await bcrypt.hash(password, saltRounds);
      userData.password = hashedPassword;
    }

    // Create User
    const createdUser = await userModel.create(userData);
    return res
      .status(201)
      .json({ msg: "User Registered SuccessFully", user: createdUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    let userData = req.body;
    if (Object.keys(userData).length === 0) {
      return res.status(400).json({ msg: "Bad Request !! No Data Provided" });
    }
    let { email, password, authProvider } = userData;
    if (!authProvider) {
      return res.status(400).json({ msg: "AuthProvider is required" });
    }
    if (authProvider !== "manual") {
      return res.status(400).json({
        msg: "Use Respective login API for google or OTP Authentication",
      });
    }

    // Email Validation
    if (!isValid(email)) {
      return res.status(400).json({ msg: "Email is required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ msg: "Invalid Email" });
    }

    // Password Validation
    if (!isValid(password)) {
      return res.status(400).json({ msg: "Password Number is required" });
    }
    let user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ msg: "User Not Found" });
    }
    if (user.authProvider !== "manual") {
      return res
        .status(400)
        .json({ msg: `This Email is Registered using ${authProvider} login` });
    }

    let matchedPassword = await bcrypt.compare(password, user.password);

    if (!matchedPassword) {
      return res.status(401).json({ msg: "Incorrect Password" });
    }

    let token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24hr" }
    );

    return res.status(200).json({ msg: "Login Successfull", token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// OTP Login
const otpLogin = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Google Login
const googleLogin = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    let id = req.userId;
    if (!id) {
      return res.status(400).json({ msg: "User Id is required" });
    }

    const user = await userModel.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User Not Found" });
    }
    return res
      .status(200)
      .json({ msg: "User Profile Fetched SuccessFully", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Get All Profile (Admin,Provider)
const getAllProfiles = async (req, res) => {
  try {
    if (req.userRole !== "admin") {
      return res.status(403).json({ msg: "Access Denied!! Admin Only" });
    }
    let users = await userModel
      .find()
      .select("-password")
      .sort({ createdAt: -1 });
    if (!users || users.length === 0) {
      return res.status(404).json({ msg: "No Users Found" });
    }
    return res
      .status(200)
      .json({
        msg: "Users Fetched SuccessFully",
        totalUsers: users.length,
        data: users,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Update User

const updateUser = async (req, res) => {
  try {
    let id = req.userId;
    userData = req.body;
    if (Object.keys(userData).length === 0) {
      return res.status(400).json({ msg: "Bad Request ! No Data Provided." });
    }

    let { name, email, phone, authProvider } = userData;
    if (authProvider === "manual") {
      // Name Validation
      if (name !== undefined) {
        if (!isValid(phone)) {
          return res.status(400).json({ msg: "Phone Number is required" });
        }
        if (!isValidPhone(phone)) {
          return res.status(400).json({ msg: "Invalid Phone Number" });
        }
      }
      // Email Validation
      if (email !== undefined) {
        if (!isValid(email)) {
          return res.status(400).json({ msg: "email is required" });
        }
        if (!isValidEmail(email)) {
          return res.status(400).json({ msg: "Invalid Email" });
        }
        let duplicateEmail = await userModel.findOne({ email });
        if (duplicateEmail) {
          return res.status(400).json({ msg: "Email Already Exist" });
        }
      }
      // Phone Validation
      if (phone !== undefined) {
        if (!isValid(phone)) {
          return res.status(400).json({ msg: "Contact Number is Required" });
        }

        if (!isValidContact(phone)) {
          return res.status(400).json({ msg: "Invalid Contact Number" });
        }

        let duplicatePhone = await userModel.findOne({ phone });
        if (duplicatePhone) {
          return res.status(400).json({ msg: "Contact Number Already Exists" });
        }
      }
    }
    // Update
    let updatedUser = await userModel.findByIdAndUpdate(id, userData, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ msg: "User Not Found" });
    }
    return res
      .status(200)
      .json({ msg: "User Updated SuccessFully", updatedUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    let id = req.params.id || req.userId;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid Id" });
    }

    let deletedUser = await userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ msg: "User Not Found" });
    }

    return res.status(200).json({ msg: "User Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    let userId = req.userId;
    let {oldPassword,newPassword} = req.body;
    if(!isValid(oldPassword)){
      return res.status(400).json({msg: "Old Password is Required"});
    }
    if(!isValid(newPassword)){
      return res.status(400).json({msg: "New Password is Required"});
    }
    if(!isValidPassword(newPassword)){
      return res.status(400).json({msg: "Invalid New Password"});
    }
    let user = await userModel.findById(userId).select("+password");
    if(!user){
      return res.status(404).json({msg: "User Not Found"});
    }
    if(user.authProvider !== "manual"){
      return res.status(400).json({msg: "Password Change is allowed only for manual login users."})
    }
    let passwordMatch = await bcrypt.compare(oldPassword,user.password);
    if(!passwordMatch){
      return res.status(401).json({msg: "Old Password is Incorrect"});
    }
    let hashedNewPassword = await bcrypt.hash(newPassword,10);
    user.password = hashedNewPassword;
    await user.save();
    return res.status(200).json({msg: "Password Changed SuccessFully"})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Block Unblock User (Admin);
const blockUnblockUser = async (req, res) => {
  try {
    let userId = req.params.userId;
    let { isBlocked } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: "Invalid Id" });
    }

    if(typeof(isBlocked) !== "boolean"){
      return res.status(400).json({msg: "isBlocked must be a Boolean Value"});
    }
    let user = await userModel.findById(userId);
    if(!user){
      return res.status(404).json({msg: "User Not Found"});
    }
    if(user.role === "admin"){
      return res.status(403).json({msg: "Admin Cannot be Blocked"})
    }
    user.isBlocked = isBlocked;
    await user.save();
    return res.status(200).json({msg: `User ${isBlocked ? "Blocked" : "Unblocked"} SuccessFully`})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
module.exports = {
  signupUser,
  loginUser,
  otpLogin,
  googleLogin,
  getUserProfile,
  getAllProfiles,
  updateUser,
  deleteUser,
  changePassword,
  blockUnblockUser
};
