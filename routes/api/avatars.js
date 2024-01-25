const express = require("express");
const authMiddleware = require("../../middlewares/users");
const AvatarController = require("../../controllers/avatars");

const router = express.Router();

router.get("/avatar", authMiddleware, AvatarController.uploadAvatar);

module.exports = router;
