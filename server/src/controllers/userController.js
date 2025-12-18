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

    let { name, email, phone, password,authProvider} = userData;
    // Auth Provider
    if (!isValid(authProvider)) {
      return res.status(400).json({ msg: "AuthProvider is required" });
    }
    if(!["google","phone","manual"].includes(authProvider)){
      return res.status(400).json({msg: "Invalid AuthProvider"})
    }
    if(authProvider === "manual"){
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
const loginUser = async (req,res)=>{
  try {
    let userData = req.body;;
    if(Object.keys(userData).length === 0){
      return res.status(400).json({msg: "Bad Request !! No Data Provided"});
    }
    let {email,password} = userData;
    // Email Validation
    if (!isValid(email)) {
      return res.status(400).json({ msg: "Email is required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ msg: "Invalid Email" });
    }
    let user = await userModel.findOne({email});
    if(!user){
      return res.status(404).json({msg: "User Not Found"})
    }
    // Password Validation
    if (!isValid(password)) {
      return res.status(400).json({ msg: "Phone Number is required" });
    }
    if (!isValidPassword(password)) {
      return res.status(400).json({ msg: "Invalid Password" });
    }

    let matchedPassword =  bcrypt.compare(password,user.password);

    if(!matchedPassword){
      return res.status(400).json({msg: "Invalid Password"})
    }

    let token = jwt.sign({userId : user._id},"SkilServe",{expiresIn: "24h"})

    return res.status(200).json({msg: "Login Successfull",token})
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({msg: "Internal Server Error"})
  }
}

// OTP Login
const otpLogin = async (req,res)=>{
  try {
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({msg: "Internal Server Error"})
  }
}

// Google Login
const googleLogin = async (req,res)=>{
  try {
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({msg: "Internal Server Error"})
  }
}

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    let id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid Id" });
    }
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ msg: "User Not Found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Get All Profile (Admin,Provider)
const getAllProfiles = async (req, res) => {
  try {
    let Users = await userModel.find();
    if (Object.keys(Users).length === 0) {
      return res.status(404).json("No User Found");
    }
    return res.status(200).json({ Users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Update User

const updateUser = async (req, res) => {
  try {
    let id = req.params.id;
    userData = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid Id" });
    }

    if (Object.keys(userData).length === 0) {
      return res.status(400).json({ msg: "Bad Request ! No Data Provided." });
    }

    let { name, email, phone, password, role } = userData;
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
    // Password Validation
    if (password !== undefined) {
      if (!isValidPassword(password)) {
        return res.status(400).json({ msg: "Invalid Password" });
      }
      // Password encryption
      let hashedPassword = await bcrypt.hash(password, saltRounds);
      userData.password = hashedPassword;
    }
    // Role Validation
    if (role !== undefined) {
      if (!isValid(role)) {
        return res.status(400).json({ msg: "Role is required" });
      }
      const roles = ["user", "provider", "admin"];
      if (!roles.includes(role)) {
        return res.status(400).json({
          msg: "Invalid role. Allowed roles are user, provider, admin",
        });
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
    let id = req.params.id;
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
const changePassword = async (req,res)=>{
  try {
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({msg: "Internal Server Error"})
  }
}

// Block Unblock User (Admin);
const blockUnblockUser = async (req,res)=>{
  try {
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({msg: "Internal Server Error"})
  }
}
module.exports = {
  signupUser,
  loginUser,
  otpLogin,
  googleLogin,
  getUserProfile,
  getAllProfiles,
  updateUser,
  deleteUser,
  changePassword
};
