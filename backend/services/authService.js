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

const loginOrRegisterGoogleUser = async ({ email, name, googleId }) => {
  // Check if user exists
  let user = await User.findOne({ email });

  if (user) {
    // If user exists but doesn't have googleId (was created via email/pass), link it
    if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }
  } else {
    // Register new user
    user = await User.create({
      name,
      email,
      googleId,
    });
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

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("There is no user with that email");
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;
  const html = `
    <h1>Password Reset Request</h1>
    <p>You requested a password reset. Please click the link below to reset your password:</p>
    <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
    <p>This link will expire in 10 minutes.</p>
  `;

  try {
    const sendEmail = require("../utils/sendEmail");
    await sendEmail({
      email: user.email,
      subject: "Password Reset Token",
      message,
      html,
    });

    return { message: "Email sent" };
  } catch (err) {
    console.error(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    throw new Error("Email could not be sent");
  }
};

const resetPassword = async (resetToken, newPassword) => {
  const crypto = require("crypto");

  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Invalid token");
  }

  // Set new password
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  // Generate new tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  updateUserProfile,
  loginOrRegisterGoogleUser,
  forgotPassword,
  resetPassword,
};
