const express = require("express");
const authMiddleware = require("../../middlewares/users");
const AvatarController = require("../../controllers/avatars");

const uploadMiddleware = require("../../middlewares/upload");

const router = express.Router();

router.get("/avatar",authMiddleware, AvatarController.getAvatar);
router.patch(
  "/avatar",
  uploadMiddleware.single("avatar"),
  authMiddleware,
  AvatarController.uploadAvatar
);

module.exports = router;
