import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import User from './models/usermodel.js'
import mongoose from 'mongoose'
import jwt from "jsonwebtoken";

const PORT = process.env.PORT
const app = express()
app.use(express.json())
const mongoDBURL = process.env.MONGODBURL;
const jwt_secret_key = process.env.JWT_SECRET_KEY;



app.get('/',(req, res)=>{
    return res.status(200).send("the backend is working")
})

app.post("/login", async (req, res, next) => {
  let { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch(error) {
    return res.status(500).send({message:error.message})

  }
  if (!existingUser || existingUser.password != password) {
    const error = Error("Wrong details please check at once");
    return next(error);
  }
  let token;
  try {
    //Creating jwt token
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
      },
      jwt_secret_key,
      { expiresIn: "1h" }
    );
  } catch (err) {
      return res.status(500).send({ message: err.message });
  }

  res.status(200).json({
    success: true,
    data: {
      userId: existingUser.id,
      email: existingUser.email,
      token: token,
    },
  });
});

// Handling post request
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const newUser = User({
    username,
    email,
    password,
  });

  try {
    await newUser.save();
  } catch(error) {
      console.log(error.message, "error");
      return res.status(500).send({ message: error.message });
  }
  let token;
  try {
    token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
      },
     jwt_secret_key,
      { expiresIn: "1h" }
    );
  } catch (error) {
    console.log(error.message)
   return res.status(500).send({ message: error.message });
  }
  res.status(201).json({
    success: true,
    data: {
      userId: newUser.id,
      email: newUser.email,
      token: token,
    },
  });
});
 mongoose.connect(mongoDBURL).then(()=>{
    app.listen(PORT, () => {
      console.log("listening at port: ", PORT);
    });

 }).catch((error)=>{
    console.log(error.message)
 })