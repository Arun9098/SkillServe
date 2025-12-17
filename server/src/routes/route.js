const express = require("express");
const router = express.Router();

// User Routes
const {signupUser,getUserProfile,getAllProfiles,updateUser, deleteUser} = require("../controllers/userController");

router.post("/signup",signupUser);
router.get("/user/:id",getUserProfile);
router.get("/getAllUsers",getAllProfiles);
router.put("/user/:id",updateUser);
router.delete("/user/:id",deleteUser);

module.exports = router