const express = require("express");
const personalRouter = express.Router();
const { asyncHandler } = require("../utils/asyncHandler");

// const groupChatController = require('../controller/groupChatController');
const personalController = require("../controller/personalController");

// router.use('/group', groupChatController)
personalRouter.use("/personal", asyncHandler(personalController));

module.exports = personalRouter;
