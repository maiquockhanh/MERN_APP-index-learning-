const User = require("../models/user");
const VerificationToken = require("../models/verificationToken");

const { sendError, createRandomBytes } = require("../utils/helper");
const jwt = require("jsonwebtoken");
const { generateOTP, transport } = require("../utils/mail");
const { isValidObjectId } = require("mongoose");

const ResetToken = require("../models/resetToken");

const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.find({ email });
  if (user == []) return sendError(res, "Email has already existed");

  const newUser = new User({ name, email, password });
  await newUser.save();

  const OTP = generateOTP();
  const newVerificationToken = new VerificationToken({
    owner: newUser._id,
    token: OTP,
  });
  await newVerificationToken.save();

  transport().sendMail({
    from: "verification@email.com",
    to: newUser.email,
    subject: "Verify your email",
    html: `<h1>${OTP}</h1>`,
  });

  res.send(newUser);
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email.trim() || !password.trim())
    return sendError(res, "Please input username and password");

  const user = await User.findOne({ email });
  if (!user) return sendError(res, "User not found!");

  const isMatched = await user.comparePassword(password);
  if (!isMatched) return sendError(res, "Wrong password!");

  const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({
    success: true,
    user: {
      name: user.name,
      email: user.email,
      id: user._id,
      token: token,
    },
  });
};

const verifyEmail = async (req, res) => {
  const { userID, OTP } = req.body;

  if (!userID || !OTP.trim()) return sendError("Invalid request");
  if (!isValidObjectId(userID)) return sendError("Invalid user ID");

  const user = await User.findById(userID);

  if (!user) return sendError(res, "User not found!");
  if (user.verified) return sendError(res, "User is already verified!");

  const token = await VerificationToken.findOne({ owner: user._id });
  if (!token) return sendError(res, "User not found!");

  const isMatched = await token.compareToken(OTP);
  if (!isMatched) return sendError(res, "Wrong token!");

  user.verified = true;

  await VerificationToken.findByIdAndDelete(token._id);
  await user.save();

  transport().sendMail({
    from: "verification@email.com",
    to: user.email,
    subject: "Your email has been verified",
    html: `Your email has been verified`,
  });

  res.json({
    success: true,
    message: "Email has been verified",
  });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return sendError(res, "Invalid request");

  const user = await User.findOne({ email });

  if (!user) return sendError(res, "User not found!");

  const token = await ResetToken.findOne({ owner: user._id });
  if (token) return sendError(res, "Token has already been sent");

  const newToken = await createRandomBytes();
  const resetToken = new ResetToken({ owner: user._id, token: newToken });
  await resetToken.save();

  transport().sendMail({
    from: "verification@email.com",
    to: user.email,
    subject: "Reset password",
    html: `<a href="http://localhost:4000/api/user/resetpass/?token=${newToken}&id=${user._id}">Click here to reset password</a>`,
  });

  res.json({
    success: true,
    link: `http://localhost:4000/api/user/resetpass/?token=${newToken}&id=${user._id}`,
  });
};

const resetPassword = async (req, res) => {};

module.exports = { createUser, signIn, verifyEmail, forgotPassword };
