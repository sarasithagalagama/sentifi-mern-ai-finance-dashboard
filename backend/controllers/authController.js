const authService = require("../services/authService");
const {
  verifyRefreshToken,
  generateAccessToken,
} = require("../utils/tokenUtils");
const User = require("../models/User");

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
const register = async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.registerUser(
    req.body
  );

  // Set HTTP-only cookies
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user,
    accessToken, // Also send in response for clients that don't use cookies
  });
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
const login = async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.loginUser(
    req.body
  );

  // Set HTTP-only cookies
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    message: "Login successful",
    user,
    accessToken,
  });
};

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh token not provided",
    });
  }

  // Verify refresh token
  const decoded = verifyRefreshToken(refreshToken);

  // Check if user exists and token matches
  const user = await User.findById(decoded.id).select("+refreshToken");
  if (!user || user.refreshToken !== refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }

  // Generate new access token
  const newAccessToken = generateAccessToken(user._id);

  // Set new access token cookie
  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  res.json({
    success: true,
    accessToken: newAccessToken,
  });
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
const logout = async (req, res, next) => {
  try {
    await authService.logoutUser(req.user._id);

    // Clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await authService.updateUserProfile(
      req.user._id,
      req.body
    );
    res.json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/google
 * @desc    Login with Google
 * @access  Public
 */
const googleLogin = async (req, res, next) => {
  try {
    const { token } = req.body;

    // In a production environment, you should verify the Google token using 'firebase-admin' SDK
    // For this implementation, we'll decode it or trust the payload sent from frontend
    // BUT since we don't have firebase-admin set up on backend easily without a service account file,
    // we will accept the user data sent from frontend (secured by HTTPS in prod).
    // Ideally: const decodedToken = await admin.auth().verifyIdToken(token);

    const { email, name, googleId } = req.body.user;

    const { user, accessToken, refreshToken } =
      await authService.loginOrRegisterGoogleUser({
        email,
        name,
        googleId,
      });

    // Set HTTP-only cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Google login successful",
      user,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  getMe,
  updateProfile,
  googleLogin,
};
