require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express')




const jwtverify = async (req, res, next) => {
  try {
    const token = req.cookies?.accesstoken;
    console.log("route ",token)
  //   console.log(token)
  //  console.log( cookies.accesstoken)

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "ABHINAV_");
    console.log("ACCESS_TOKEN_SECRET = ", process.env.ACCESS_TOKEN_SECRET);

    req.userId = decoded.userId;
    console.log("Decoded:", decoded);

    next(); // move to the next middleware or route
  } catch (error) {
    console.log("Token verification error:", error.message);
    return res.status(403).json({ message: "Invalid token", error: error.message });
  }
};

module.exports = jwtverify;
