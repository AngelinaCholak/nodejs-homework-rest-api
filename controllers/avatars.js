const fs = require("node:fs/promises");
const HttpError = require("../error/error.js");
const path = require("node:path");
const Jimp = require("jimp");

const User = require("../models/users");
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

async function getAvatar(req, res, next) {
  try {
    const user = await User.findById(req.user.id);

    if (user === null || user.avatar === null) {
      throw HttpError(401, "Not authorized");
    }

    const avatarURL = path.join("/avatars", user.avatar);
    res.json({ avatarURL });
  } catch (error) {
    next(error);
  }
}

const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw HttpError(400, "Bad Request");
    }
    const { _id } = req.user;
    const { path: tempUpload, originalname } = req.file;

    const avatar = await Jimp.read(tempUpload);

    await avatar.autocrop().cover(250, 250).writeAsync(tempUpload);

    const resultUpload = path.join(avatarsDir, originalname);
    await fs.rename(tempUpload, resultUpload);

    const avatarURL = path.join("avatars", originalname);

    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json(avatarURL);
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadAvatar, getAvatar };
