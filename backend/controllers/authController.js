const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET || "college_portal_secret_key", {
    expiresIn: "2h",
  });

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists, please login" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = createToken({
      id: newUser.id.toString(),
      email: newUser.email,
      name: newUser.name,
    });

    return res.status(201).json({
      message: "Registration successful",
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ message: "User already exists, please login" });
    }
    return res.status(500).json({ message: "Could not register user" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = createToken({
      id: user.id.toString(),
      email: user.email,
      name: user.name,
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ message: "Could not login user" });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
