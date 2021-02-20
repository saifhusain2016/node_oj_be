const express = require("express");
const bodyParser = require("body-parser");
const mongoConnect = require("./util/database").mongoConnect;

const app = express();
const port = 8000;
const authRoutes = require("./Routes/authRoutes");

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/auth", authRoutes);

mongoConnect(() => {
  app.listen(port, () => {
    console.log("server connected !  Running on port ", port);
  });
});

/*
MongoClient.connect(mongo_uri, (err, db) => {
  if (err) {
    throw err;
  } else {
    console.log("connected to database");
    app.listen(port, () => {
      console.log("Server is running on port ", port);
    });
    //var dbo = db.db("auth");
    //var newUser = { email: "saif@gmail.com", password: "1234" };
    //dbo.collection("users").insertOne(newUser);
  }
});
*/
