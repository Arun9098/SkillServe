// const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const authentication = async (req, res, next) => {
  try {
    let token = req.headers["Authorization"];
    if (!token) {
      return res.status(400).json({ msg: "Authorization Token is Required" });
    }

    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    let decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decodedToken) {
      return res.status(401).json({ msg: "Invalid or Expired Token" });
    }
    let user = await userModel.findById(decodedToken.userId);
    req.userId = decodedToken.userId;
    req.userRole = user.role;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = authentication;
