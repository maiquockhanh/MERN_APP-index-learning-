const router = require("express").Router();
const {
  createUser,
  signIn,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/user");
const { isTokenValid } = require("../middleware/user");
const { validatorUser, validate } = require("../middleware/validator");

router.post("/create", validatorUser, validate, createUser);
router.post("/signin", signIn);
router.post("/verified-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", isTokenValid, resetPassword);
router.get("/verified-token", isTokenValid, (req, res) => {
  res.json({ success: true });
});

module.exports = router;
