const express = require("express");
const router = express.Router();

let authentication = require("../middleware/authMiddleWare")
let authorization = require("../middleware/authorization")
const {
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
} = require("../controllers/userController");

router.post("/signup", signupUser);
router.post("/login",loginUser)
router.get("/profile", authentication,getUserProfile);
router.get("/getAllUsers",authentication,authorization("admin"), getAllProfiles);
router.put("/user/:id",authentication, updateUser);
router.delete("/deleteUser",authentication,deleteUser)
router.delete("/user/:id",authentication,authorization("admin"),deleteUser);
router.put("/user/block/:userId",authentication,authorization("admin"),blockUnblockUser)
router.put("/changePassword",authentication,changePassword)

module.exports = router;
