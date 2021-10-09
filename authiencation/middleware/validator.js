const { check, validationResult } = require("express-validator");

const validatorUser = [
  check("name")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Name is missing!")
    .isLength({ min: 3, max: 20 })
    .withMessage("Length of name must be 3 to 20"),
  check("email").normalizeEmail().isEmail().withMessage("Email is invalid!"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is missing!")
    .isLength({ min: 8, max: 20 })
    .withMessage("Length of password must be 8 to 20"),
];

const validate = (req, res, next) => {
  const err = validationResult(req).array();
  if (!err.length) return next();
  res.status(400).json({ success: false, error: err[0].msg });
};

module.exports = { validatorUser, validate };
