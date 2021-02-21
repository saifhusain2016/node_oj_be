const express = require("express");
const router = express.Router();

const authController = require("../Controller/authController");
const authValidator = require("../Validator/auth");

router.get("/login", authController.getLogin);

router.post("/login", authValidator.loginValidation, authController.postLogin);

router.post(
  "/signup",
  authValidator.signupValidation,
  authController.postSignup
);

router.get("/session", authController.getSession);

module.exports = router;
