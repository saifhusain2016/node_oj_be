const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.getLogin = (req, res, next) => {
  res.status(200).json({
    loginStatus: "Login request called",
  });
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findByEmail(email);
    console.log(user);
    const isPasswordSame = await bcrypt.compare(password, user.password);
    console.log(isPasswordSame);

    const statusCode = isPasswordSame ? 200 : 401;
    const message = isPasswordSame ? "Login Successful" : "Invalid Credentials";
    let token = null;

    if (isPasswordSame) {
      token = jwt.sign({ email: email, userId: password }, "secretText", {
        expiresIn: "1h",
      });
    }

    res.status(statusCode).json({ message: message, token: token });
  } catch (err) {
    console.log("err: " + err);
    next(err);
  }
};

exports.postSignup = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  try {
    const hash = bcrypt.hashSync(password, 10);
    const newUser = await User.createUser(name, email, hash);
    const statusCode = newUser.created ? 200 : 409;
    const message = newUser.message || "some error occured";
    res.status(statusCode).json({ message: message });
  } catch (err) {
    next(err);
  }
};

exports.getSession = async (req, res, next) => {
  const header = req.get("Authorization");
  console.log("header: ", header);
  if (!header) {
    const error = new Error("Not Authenticated");
    error.status = 503;
    return next(error);
  }

  const token = header.split(" ")[1];
  console.log("token : ", token);
  let decodedToken = false;

  try {
    decodedToken = await jwt.verify(token, "secretText");
  } catch (err) {
    err.status = 503;
    return next(err);
  }

  console.log("decoded token: ", decodedToken);

  if (!decodedToken) {
    const error = new Error("Session Expired");
    return next(error);
  }

  res.status(200).json({ message: "Session is Valid" });
};
