const bcrypt = require("bcrypt");
const User = require("../models/users");
const jwt = require("jsonwebtoken");

async function register(req, res, next) {
  const { password, email, subscription } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user !== null) {
      return res.status(409).send({ message: "User already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await User.create({ password: passwordHash, email, subscription });
    res.status(201).send({ message: "Registration successful" });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const { password, email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user === null) {
      console.log("Email");
      return res
        .status(401)
        .send({ message: "Email or password is incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      console.log("Password");
      return res
        .status(401)
        .send({ message: "Email or password is incorrect" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60,
    });


    await User.findByIdAndUpdate(user._id, { token });

    res.send({ token });
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

module.exports = { register, login, logout };
