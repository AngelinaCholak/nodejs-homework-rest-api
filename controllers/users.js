const bcrypt = require("bcrypt");
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const HttpError = require("../error/error.js");
const gravatar = require("gravatar");
const crypto = require("node:crypto");

const sendEmail = require("../helpers/sendEmail");

async function register(req, res, next) {
  const { password, email, subscription } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user !== null) {
      throw HttpError(409, "Email in use");
    }

    const avatarURL = gravatar.url(email, {
      s: "250",
      d: "identicon",
      r: "pg",
    });

    const passwordHash = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomUUID();
    console.log("Generated verifyToken:", verificationToken);

      await sendEmail({
        to: email,
        from: "Smaluhandelina@gmail.com",
        subject: "Welcome to BookShelf",
        html: `To confirm your registration please click on the 
        <a href="http://localhost:3000/api/users/verify/${verificationToken}">link</a>`,
        text: `To confirm your registration please open the link http://localhost:3000/api/users/verify/${verificationToken}`,
      });

    const newUser = await User.create({
      password: passwordHash,
      email,
      verificationToken,
      subscription,
      avatarURL,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60,
    });

    await User.findByIdAndUpdate(newUser._id, { token });

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL, 
      },
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const { password, email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user === null) {
      throw HttpError(401, "Email or password is wrong");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw HttpError(401, "Email or password is wrong");
    }
       if (user.verify === false) {
         return res
           .status(401)
           .send({ message: "Your account is not verified" });
       }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60,
    });

    await User.findByIdAndUpdate(user._id, { token });

    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

async function getCurrent(req, res, next) {
  try {
    const { email, subscription } = req.user;
    res.json({ email, subscription });
  } catch (error) {
    next(error);
  }
}
async function verify(req, res, next) {
  const { token } = req.params;

  try {
    const user = await User.findOne({ verificationToken: token });

    if (user === null) {
      return res.status(404).send({ message: "Not found" });
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.send({ message: "Email confirm successfully" });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, logout, getCurrent, verify };
