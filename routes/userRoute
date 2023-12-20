const express = require("express");
const router = express.Router();

// authentication middleware
const authmiddleware = require("../middleware/authMiddleWare");

const { register, login, checkUser } = require("../controller/userController");

// user register
router.post("/register", register);

// user login route
router.post("/login", login);

// user check authorization and authentication
router.get("/check", authmiddleware, checkUser);

module.exports = router;
