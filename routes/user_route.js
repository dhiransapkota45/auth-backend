const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User_Model = require("../models/user");
const bcrypt = require("bcryptjs");
const User = require("../../../project-1/backend/models/User");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/token")
const JWT_SECRET = "mynameisdhiransapkota";

router.post(
  "/signup",
  body("username", "Enter at least five characters for username").isLength({ min: 5 }),
  body("email", "Wrong Email").isEmail(),
  body("password", "length of password should be more than 5 characters").isLength({
    min: 5,
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), success: false, msg:"Enter valid datas" });
    }
    try {
      const { username, email, password } = req.body;
      const email_check = await User_Model.findOne({ email });
      if (email_check) {
        return res
          .status(403)
          .json({ msg: "User with that email already exists", success: false });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(password, salt);
      const user_data = await User_Model.create({
        username,
        email,
        password: secPass,
      });
      // console.log(user_data);
      const auth_data = {
        id: user_data.id,
      };
      // console.log(auth_data.id);
      const authToken = jwt.sign(auth_data, JWT_SECRET);

      res
        .status(200)
        .json({ authToken, success: true, msg: "User created successfully", user:user_data });
    } catch (error) {
      if (error.name === "ValidationError") {
        let errors = {};

        Object.keys(error.errors).forEach((key) => {
          errors[key] = error.errors[key].message;
        });

        return res.status(400).send(errors);
      }
      res.status(500).json({ msg: "Server error occured", success: false });
    }
  }
);


router.post(
  "/login",
  body("email", "Wrong Email").isEmail(),
  body("password", "length must be more than 5 characters").isLength({
    min: 5,
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), success: false });
    }
    try {
      const { email, password } = req.body;
      const email_checker = await User_Model.findOne({ email: email });
      if (!email_checker) {
        return res
          .status(400)
          .json({ msg: "Invalid Credentials! Please try again.", success:false });
      }

      const password_checker = await bcrypt.compare(
        password,
        email_checker.password
      );
      if (!password_checker) {
        return res
          .status(400)
          .json({ msg: "Invalid Credentials! Please try again.", success:false });
      }
      const auth_data = {
        id: email_checker.id,
      };
      const authToken = jwt.sign(auth_data, JWT_SECRET);
      res
        .status(200)
        .json({
          msg: "User logged in successfully.",
          success: true,
          authToken,
        });
    } catch (error) {
      res.status(500).json({ msg: "Server error occured", success: false });
    }
  }
);


router.get("/", fetchuser, async (req, res)=>{
      const user_id = req.id
      // console.log(user_id);
      const user = await User_Model.findOne({_id:user_id})
      // console.log(user);
      // console.log(user.username);
      res.status(200).json({username:user.username, success:true})
})
module.exports = router;
