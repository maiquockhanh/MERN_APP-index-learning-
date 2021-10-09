const router = require("express").Router();
const {
  createUser,
  signIn,
  verifyEmail,
  forgotPassword,
} = require("../controllers/user");
const { validatorUser, validate } = require("../middleware/validator");

router.post("/create", validatorUser, validate, createUser);
router.post("/signin", signIn);
router.post("/verified-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

module.exports = router;
