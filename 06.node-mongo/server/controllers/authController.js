const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../services/emailService");

require("dotenv").config();

const register = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({
        message: "Username, password and email are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔥 VERIFY TOKEN
    const verifyToken = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const newUser = new UserModel({
      username,
      password: hashedPassword,
      email,
      verifyToken,
      isVerified: false,
    });

    await newUser.save();

    // 🔥 VERIFY LINK
    const verifyLink = `http://localhost:8080/api/auth/verify/${verifyToken}`;

    try {
      await sendEmail(
        email,
        "Confirm your account ✅",
        `<h2>Salam ${username}</h2>
         <p>Zəhmət olmasa hesabınızı təsdiqləyin:</p>
         <a href="${verifyLink}">Confirm Account</a>`
      );
    } catch (err) {
      console.log("Email error:", err.message);
    }

    res.status(201).json({
      message: "User registered. Please verify your email 📩",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({
        message: "Email/Username and password are required",
      });
    }

    // 🔥 OPTIMIZED QUERY (1 dəfə DB)
    const user = await UserModel.findOne({
      $or: [
        { email: emailOrUsername },
        { username: emailOrUsername },
      ],
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email/username or password",
      });
    }

    // 🔥 EMAIL VERIFY CHECK (ƏN VACİB)
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first ❌",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email/username or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: `User logged in successfully`,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: token,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const verifyAccount = async (req, res) => {
  try {
    const { token } = req.params;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    user.isVerified = true;
    user.verifyToken = null;

    await user.save();

    res.send("Account verified successfully ✅");

  } catch (error) {
    res.status(400).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = {
  register,
  login,
  verifyAccount,
};
