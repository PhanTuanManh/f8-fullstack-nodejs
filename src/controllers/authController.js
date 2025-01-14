import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Đăng ký người dùng
export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "Email already exists" });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    return res.status(201).send({
      message: "User registered successfully",
      data: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
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

    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      jwtSecretKey,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { userId: user._id, email: user.email },
      jwtSecretKey,
      { expiresIn: "7d" }
    );

    await User.findByIdAndUpdate(user._id, { refreshToken });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).send({
      message: "Login successful",
      data: { accessToken },
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

    jwt.verify(refreshToken, jwtSecretKey, async (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Invalid refresh token" });
      }

      const user = await User.findById(decoded.userId);
      if (!user || user.refreshToken !== refreshToken) {
        return res.status(403).send({ message: "Refresh token mismatch" });
      }

      const newAccessToken = jwt.sign(
        { userId: decoded.userId, email: decoded.email },
        jwtSecretKey,
        { expiresIn: "1h" }
      );

      return res.status(200).send({
        message: "Token refreshed successfully",
        data: { accessToken: newAccessToken },
      });
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error refreshing token",
      error: error.message,
    });
  }
};
