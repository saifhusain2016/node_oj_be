const getDb = require("../util/database").getDb;

class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  static addNewUser(name, email, password) {
    const db = getDb();
    return db
      .collection("users")
      .find({ email: email })
      .next()
      .then((user) => {
        if (user) {
          console.log("user already exist");
          return {
            created: false,
            message: "user already exist",
          };
        } else {
          return db
            .collection("users")
            .insertOne({
              name: name,
              email: email,
              password: password,
            })
            .then((newUser) => {
              if (newUser) {
                console.log("new user added successfully");
                return {
                  created: true,
                  message: "user created successfully",
                };
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
  }

  static verifyUser(email) {
    const db = getDb();
    return db
      .collection("users")
      .find({ email: email })
      .next()
      .then((user) => {
        return user;
      })
      .catch((err) => {
        console.log("error");
      });
  }
}

module.exports = User;
