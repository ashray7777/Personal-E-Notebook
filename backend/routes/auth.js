const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
var fetchuser = require('../middleware/fetchuser'); 

const JWT_SECRET = "Ashrayisher@e";

//Route1: Create a user using: POST "/api/auth/createuser". Doesn't require auth
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success= false; 
    // console.log(req.body);
    // const user = User(req.body);
    // user.save();

    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    try {
      //Check whether user with this email exist already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success, error: "Sorry a user with this email already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      success=true;
      const authtoken = jwt.sign(data, JWT_SECRET);
      console.log(authtoken);
      // User.create({
      //     name: req.body.name,
      //     email: req.body.email,
      //     password: req.body.password
      //   }).then(user => res.json(user))
      //   .catch(err=>{console.log(err)
      //   res.json({error: 'Please enter a unique value for email', message: err.message})})

      //res.json(user);
      res.json({success, authtoken });

      // res.send(req.body);
    } catch (error) {
      console.log(error.message);
      res.status(500).send(success, "Internal server error1");
    }
  }
);

//Route 2: Authenticate a User using: POST "/api/auth/login". No login required.
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    // If there are errors, return Bad request and the errors
    let success= false; 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      // let user = User.findOne({email});
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success, error: "Please try to login with correct credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ success, error: "Please try to login with correct credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success=true;  
      res.json({ success, authtoken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send(success,"Internal server error");
    }
  }
);

//Route 3: Get logggedin User using: POST "/api/auth/getuser". Login required.
router.post("/getuser",fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user)
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
});
module.exports = router;
