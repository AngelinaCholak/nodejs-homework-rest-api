const express = require("express");
const AuthController = require("../../controllers/users");
const authMiddleware = require("../../middlewares/users");

const AvatarController = require("../../controllers/avatars");
const uploadMiddleware = require("../../middlewares/upload");

const validate = require("../../middlewares/validate.js");
const schema = require("../../middlewares/schema/contact.js");

const router = express.Router();

router.post("/register", validate(schema.userSchema),AuthController.register);

router.post("/login", validate(schema.userSchema), AuthController.login);

router.get("/logout", authMiddleware, AuthController.logout);

router.get("/current", authMiddleware, AuthController.getCurrent);

router.get("/avatar", authMiddleware, AvatarController.getAvatar);

router.patch(
  "/avatar",
  authMiddleware,
  uploadMiddleware.single("avatar"),
  AvatarController.uploadAvatar
);
router.get("/verify/:token", AuthController.verify);


module.exports = router;
