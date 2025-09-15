const User = require("../models/User");

const sendMail = require("../services/emailService");
const { otpTemplate } = require("../templates/emailtemplate");

const bcryptjs = require("bcryptjs");

const jwt = require("jsonwebtoken");
module.exports.createUser = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    //find user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "User Already Exist" });
    } else {
      const hashPass = await bcryptjs.hash(password, 10);

      const NewUser = await User.create({ email, password: hashPass, name });
      const otp = Math.floor(100000 + Math.random() * 900000);

      NewUser.otp = otp;
      NewUser.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

      await NewUser.save();
      await sendMail({
        to: email,
        subject: "Verification OTP",
        text: "Hello Please Verify to Register at Our Platform",
        html: otpTemplate(name, otp),
      });

      return res.status(200).json({
        message: "Please Check Your Email ! We Have Sent You a Otp",
        NewUser,
      });
    }
  } catch (error) {
    console.log("ERR", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  console.log("REQ<body",req.body);
  try {
    const existingUser = await User.findOne({ email });
    console.log("Existing", existingUser.otp);
    if (existingUser.otp != otp) {
      return res.status(400).json({ message: "OTP INVALID" });
    }
    existingUser.otp = null;
    existingUser.otpExpiresAt = null;
    existingUser.isVerified = true;
    await existingUser.save();

    return res
      .status(200)
      .json({ messgae: "Verification Succefull Now You Can Login !" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    const isMatch = await bcryptjs.compare(password, existingUser.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Email/Password is Incorrect" });
    }

    if (!existingUser.isVerified) {
      const otp = Math.floor(100000 + Math.random() * 900000);

      existingUser.otp = otp;
      existingUser.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

      await existingUser.save();
      await sendMail({
        to: email,
        subject: "Verification OTP",
        text: "Hello Please Verify to Register at Our Platform",
        html: otpTemplate(existingUser.email, otp),
      });

      return res
        .status(400)
        .json({ message: "Please Verify Login Check Your Email !" });
    }
    const token = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    return res
      .status(200)
      .json({ messgae: "Login SussessFully", token, existingUser });
  } catch (err) {
    console.log("LOgin_err", err);
    return res.status(500).json({ messgae: "Something Went Wrong" });
  }
};
