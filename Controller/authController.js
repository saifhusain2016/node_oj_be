const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.getLogin = (req, res, next) => {
  res.status(200).json({
    loginStatus: "Login request called",
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.verifyUser(email).then((user) => {
    if (user !== null) {
      bcrypt.compare(password, user.password).then((hash) => {
        if (hash) {
          res.status(200).json({
            message: "login successful",
          });
        } else {
          res.status(401).json({
            message: "Invalid Password",
          });
        }
      });
    } else {
      res.status(401).json({
        message: "Invalid User Email",
      });
    }
  });
};

exports.postSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const hash = bcrypt.hashSync(password, 10);

  User.addNewUser(name, email, hash).then((newUser) => {
    console.log("newUser: ", newUser);
    if (newUser.created) {
      res.status(200).json({
        message: newUser.message,
        newUser: newUser,
      });
    } else {
      res.status(403).json({
        message: newUser.message
          ? newUser.message
          : "Some Error Occured. User not created",
      });
    }
  });
};
