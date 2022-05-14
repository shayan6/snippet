const router = require("express").Router();
const bcrypt = require("bcryptjs/dist/bcrypt");
const user = require("../models/userModel");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  try {

    const { email, password, confirmPassword } = req.body;
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ status: false, message: "You must enter email, password & confirmPassword." })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ status: false, message: "Password not matched." })
    }

    let existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: false, message: "User with this email already exist." })
    }
    
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new user({
      email, passwordHash
    });

    const savedUser = await newUser.save();
    const token = jwt.sign(
      {
        id: savedUser._id
      }, 
      process.env.JWT_SECRET
    );

    res.cookie("token", token, { httpOnly: true }).send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});


router.post("/:id", async (req, res) => {
  try {

    const id = req.params.id;

    let existingSnippet = await user.findById(id);
    if (!existingSnippet) {
      return res.status(400).json({ status: false, message: "Id is not found." })
    }

    const token = jwt.sign(
      {
        id: existingSnippet._id
      }, 
      process.env.JWT_SECRET
    );

    res.cookie("token", token, { httpOnly: true }).send();

  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.get("/", async (req, res) => {
  try {
    const getUser = await user.find();
    // const token = req.cookies.token;
    // console.log(token);
    res.json(getUser);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});


module.exports = router;
