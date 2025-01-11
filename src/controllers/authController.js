import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    const emailToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    const verificationLink = `http://localhost:3000/verify-email?token=${emailToken}`;

    await transporter.sendMail({
      from: `"Test phat" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Email Verification",
      html: `
          <h1>Welcome to Test phat</h1>
          <p>Click the link below to verify your email:</p>
          <a href="${verificationLink}">Verify Email</a>
        `,
    });

    return res.status(201).send({
      message: "User registered successfully. Please verify your email.",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error registering user",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const jwtSecretKey = process.env.JWT_SECRET;

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      jwtSecretKey,
      {
        expiresIn: "1h",
      }
    );

    const refreshToken = jwt.sign(
      { userId: user._id, email: user.email },
      jwtSecretKey,
      {
        expiresIn: "7d",
      }
    );

    await User.findByIdAndUpdate(user._id, {
      refreshToken: refreshToken,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).send({
      message: "Login successful",
      data: token,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error logging in",
      error: error.message,
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const jwtSecretKey = process.env.JWT_SECRET;

    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).send({ message: "Refresh token not provided" });
    }

    jwt.verify(refreshToken, jwtSecretKey, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Invalid refresh token" });
      }

      const newAccessToken = jwt.sign(
        { userId: decoded.userId, email: decoded.email },
        jwtSecretKey,
        {
          expiresIn: "1h",
        }
      );

      return res.status(200).send({
        message: "Refresh token valid",
        data: newAccessToken,
      });
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error refreshing token",
      error: error.message,
    });
  }
};
