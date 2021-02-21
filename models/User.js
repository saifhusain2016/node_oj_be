const getDb = require("../util/database").getDb;

class User {
  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  static async createUser(name, email, password) {
    const db = getDb();

    const isAlreadyExist = await db
      .collection("users")
      .find({ email: email })
      .next();

    if (isAlreadyExist) {
      return {
        created: false,
        message: "user already exist",
      };
    }

    try {
      await db.collection("users").insertOne({
        name: name,
        email: email,
        password: password,
      });
      return {
        created: true,
        message: "user created successfully",
      };
    } catch (err) {
      next(err);
    }
  }

  static async findByEmail(email) {
    const db = getDb();
    try {
      return await db.collection("users").find({ email: email }).next();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = User;
