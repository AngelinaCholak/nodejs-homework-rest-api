const fs = require("node:fs/promises");
const HttpError = require("../error/error.js");
const path = require("node:path");

const User = require("../models/users");

async function getAvatar(req, res, next) {
  try {
    const user = await User.findById(req.user.id);

    if (user === null) {
      throw HttpError(401, "Not authorized");
    }

    if (user.avatar === null) {
      throw HttpError(401, "Not authorized");
    }

    res.sendFile(path.join(__dirname, "..", "public/avatars", user.avatar));
  } catch (error) {
    next(error);
  }
}

async function uploadAvatar(req, res, next) {
  try {
    await fs.rename(
      req.file.path,
      path.join(__dirname, "..", "public/avatars", req.file.filename)
    );

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: req.file.filename },
      { new: true }
    );

    if (user === null) {
      throw HttpError(401, "Not authorized");
    }

    res.send(user);
  } catch (error) {
    next(error);
  }
}

module.exports = { uploadAvatar, getAvatar };
