const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokenUtils");

/**
 * Register a new user
 */
const registerUser = async (userData) => {
  const { name, email, password } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
  });

  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Save refresh token to user document
  user.refreshToken = refreshToken;
  await user.save();

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      defaultCurrency: user.defaultCurrency,
      customQuestions: user.customQuestions,
    },
    accessToken,
    refreshToken,
  };
};

/**
 * Login user
 */
const loginUser = async (credentials) => {
  const { email, password } = credentials;

  // Find user and include password field
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Save refresh token
  user.refreshToken = refreshToken;
  await user.save();

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      defaultCurrency: user.defaultCurrency,
      customQuestions: user.customQuestions,
    },
    accessToken,
    refreshToken,
  };
};

/**
 * Logout user
 */
const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

const updateUserProfile = async (userId, updateData) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (updateData.name) user.name = updateData.name;
  if (updateData.email) user.email = updateData.email; // Note: In real app, email change usually requires verification
  if (updateData.defaultCurrency)
    user.defaultCurrency = updateData.defaultCurrency;
  if (updateData.customQuestions)
    user.customQuestions = updateData.customQuestions;

  // Handle Password Update if separate or allowed here
  if (updateData.newPassword && updateData.currentPassword) {
    const isMatch = await user.comparePassword(updateData.currentPassword);
    if (!isMatch) throw new Error("Incorrect current password");
    user.password = updateData.newPassword;
  }

  await user.save();

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    defaultCurrency: user.defaultCurrency,
    customQuestions: user.customQuestions,
  };
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  updateUserProfile,
};
