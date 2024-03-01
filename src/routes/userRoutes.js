const express = require("express");
const router = express.Router();
const loginUser = require("../controller/userController");
const logoutUser = require("../controller/userController");
const refreshAccessToken = require("../controller/userController");

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

module.exports = router;
