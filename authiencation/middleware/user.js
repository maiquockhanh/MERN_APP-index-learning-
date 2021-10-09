const { isValidObjectId } = require("mongoose");
const ResetToken = require("../models/resetToken");
const User = require("../models/user");
const { sendError } = require("../utils/helper");

exports.isTokenValid = async (req, res, next) => {
  const { token, id } = req.query;
  if (!token || !id) return sendError(res, "Invalid request !");

  if (!isValidObjectId(id)) return sendError(res, "Invalid user !");

  const user = await User.findById(id);
  if (!user) return sendError(res, "User not found");

  const resetToken = await ResetToken.findOne({ owner: user._id });
  if (!resetToken) return sendError(res, "Token not found");

  const isMatched = await resetToken.compareToken(token);
  if (!isMatched) return sendError(res, "Token is not matched");

  req.user = user;
  next();
};
