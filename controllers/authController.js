import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {
  validateSignin,
  validateSignup,
} from "../lib/validations/userValidation.js";
import { genJWT } from "../lib/helpers/jwt.js";
import { genRandomDigits, generateUniqueChars } from "../lib/utils.js";
import {
  sendActivationLink,
  sendPasswordRecCode,
} from "../lib/nodemailer/activationEmail.js";

// @description: User signin
// @Method: POST
// @Endpoint: api/auth/signin
// @AccessType: public
const signin = async (req, res) => {
  // validation
  const error = await validateSignin(req.body);
  if (error) {
    return res.status(400).json({ msg: error });
  }

  const { email, password } = req.body;

  // Check if user have an account
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ msg: "Invalid email or password" });
  }

  // Check if password is equal
  const isValid = await bcryptjs.compare(password, user.password);
  if (!isValid) {
    return res.status(400).json({ msg: "Invalid email or password" });
  }

  // check if the user is activated

  const payload = {
    _id: user._id,
    email: user.email,
    name: `${user.firstName} ${user.lastName}`,
  };

  let isSecureCookie = false;
  let sameSiteCookie = "Lax";
  if (process.env.NODE_ENV === "production") {
    isSecureCookie = true;
    sameSiteCookie = "None";
  }
  const token = genJWT(payload);

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: isSecureCookie,
    signed: true,
    expires: new Date(Date.now() + oneDay),
    sameSite: sameSiteCookie,
  });

  res.json({ msg: "Login succeccful" });
};

// @description: User signup
// @Method: POST
// @Endpoint: api/auth/signup
// @AccessType: public
const signup = async (req, res) => {
  // validation
  const error = await validateSignup(req.body);
  if (error) {
    return res.status(400).json({ msg: error });
  }

  const { email, firstName, lastName, password, phone } = req.body;

  // Check if user exist
  const phoneExist = await User.findOne({ phone });
  if (phoneExist) {
    return res.status(400).json({ msg: "Phone number already exist" });
  }
  const emailExist = await User.findOne({ email });
  if (emailExist) {
    return res.status(400).json({ msg: "Email already exist" });
  }

  // Hash the password
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);

  // Create the user
  const newUser = new User({
    firstName,
    lastName,
    phone,
    email,
    password: hashedPassword,
  });

  const activationToken = generateUniqueChars(80);
  const activationTokenExpires = Date.now() + 20 * 60 * 1000;

  newUser.activationToken = activationToken;
  newUser.activationTokenExpires = activationTokenExpires;

  await newUser.save();

  await sendActivationLink({ email, lastName, activationToken });

  res
    .status(201)
    .json({ msg: "An email has been sent to activate your account" });
};

// @description: User activate
// @Method: GET
// @Endpoint: api/auth/activate/:activationToken
// @AccessType: public
// @AccessType: public
const activate = async (req, res) => {
  const activationToken = req.params.activationToken;

  const user = await User.findOne({ activationToken });
  if (!user) {
    return res.status(400).json({ msg: "Invalid activation token" });
  }

  if (Date.now() > user.activationTokenExpires) {
    return res.status(400).json({ msg: "Activation token expired" });
  }

  user.isActivate = true;
  user.activationToken = undefined;
  user.activationTokenExpires = undefined;

  await user.save();

  res.status(200).json({ msg: "Account activated successfully" });
};

// @description: Forgot password
// @Method: POST
// @Endpoint: api/auth/forgot-password
// @AccessType: public
const forgotPassword = async (req, res) => {
  const email = req.body.email;

  // Find the user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ msg: "Email doesn't exist" });
  }

  const code = genRandomDigits(6);

  console.log(code);

  user.passwordRecCode = code;
  user.passwordRecCodeExpires = Date.now() + 300_000; // 5 minutes

  await user.save();

  await sendPasswordRecCode({ email, code });

  res.status(200).json({ msg: "Password recovery code sent to your email" });
};

// @description: Forgot password code
// @Method: POST
// @Endpoint: api/auth/forgot-password/verify-code
// @AccessType: public
const forgotPasswordCode = async (req, res) => {
  const code = req.body.code;

  // Find the user
  const user = await User.findOne({ passwordRecCode: code });
  if (!user) {
    return res.status(400).json({ msg: "Invalid recovery code" });
  }

  if (Date.now() > user.passwordRecCodeExpires) {
    return res.status(400).json({ msg: "Recovery code expired" });
  }

  const accessToken = genJWT({ email: user.email });

  user.passwordRecCode = undefined;
  user.passwordRecCodeExpires = undefined;

  await user.save();

  res.status(200).json({ msg: "Code verified", accessToken });
};

// @description: Reset Password
// @Method: POST
// @Endpoint: api/auth/reset-password
// @AccessType: public
const resetPassword = async (req, res) => {
  const password = req.body.password;

  const payload = jwt.verify(req.body.accessToken, process.env.JWT_SECRET);

  // Find the user
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    return res.status(400).json({ msg: "Invalid token" });
  }

  // Hash the password
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);
  user.password = hashedPassword;
  await user.save();

  res.status(200).json({ msg: "Password reset successful" });
};

export {
  signin,
  signup,
  activate,
  forgotPassword,
  forgotPasswordCode,
  resetPassword,
};
