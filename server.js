const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); //reducing errors
const bodyParser = require("body-parser"); // helps parse our data into the json
const bcrypt = require("bcrypt"); //will hash our password/hide our password
const jwt = require("jsonwebtoken");
const User = require("./models/userSchema");

const SECRETKEY = "secretkey";

//connect to express app
const app = express();

//connect to mongodb
const dbURI =
  "mongodb+srv://devleena2003:sipradas@cluster0.nnegyma.mongodb.net/UsersDB?retryWrites=true&w=majority";

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(3001, () => {
      console.log("Server connected to port 3001 and MongoDb");
    });
  })
  .catch((error) => {
    console.log("Unable to connect to Server and/or MongoDB", error);
  });

//middleware
app.use(bodyParser.json());
app.use(cors());

//Routes

//user registration
app.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const hashedPassowrd = await bcrypt.hash(password, 10);
    const newUser = new User({ email, username, password: hashedPassowrd });
    await newUser.save();
    res.status(201).json({ message: "User created sucessfully" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

//get registered users

app.get("/register", async (req, res) => {
  try {
    const users = await User.find();
    res.status(201).json(users);
  } catch (err) {
    res.status(500).json({ err: err });
  }
});

//Get login

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Not Found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid" });
    }
    const token = jwt.sign({ userId: user._id }, SECRETKEY, {
      expiresIn: "1hr",
    });
    res.json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ error: "invalid" });
  }
});
