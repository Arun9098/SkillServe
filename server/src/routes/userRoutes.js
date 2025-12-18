const express = require("express");
const router = express.Router();

// let auth = require("../middleware/authMiddleWare")
const {
  signupUser,
  loginUser,
  otpLogin,
  googleLogin,
  getUserProfile,
  getAllProfiles,
  updateUser,
  deleteUser,
  changePassword
} = require("../controllers/userController");

router.post("/signup", signupUser);
router.post("/login",loginUser)
router.get("/user/:id", getUserProfile);
router.get("/getAllUsers", getAllProfiles);
router.put("/user/:id", updateUser);
router.delete("/user/:id",deleteUser);

module.exports = router;
