/* eslint-disable consistent-return */
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const getOpenToMatchUsers = async (req, res, next) => {
  let users;

  const filter = { openToMatch: true };
  try {
    users = await User.find(filter, "-password");
  } catch {
    return next(new HttpError("unable to fetch users", 500));
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signUp = async (req, res, next) => {
  const { name, email, password, number, interests } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    console.log("here!");
    const error = new HttpError("Sign up failed", 422);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("User alr exists, cannot sign up again", 422);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password,
    number,
    interests,
    apples: 0,
    trees: [],
    vouchers: [],
    openToMatch: false,
    matchDateTime: "",
    pastMatches: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("sign up failed cuz cannot save", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("invalid inputs passed!", 422);
  }

  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError("Logging in failed", 422);
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError("User email or password wrong", 500);
    return next(error);
  }

  res.json({
    message: "Logged in",
    user: existingUser.toObject({ getters: true }),
  });
};

const updateOpenToMatchStatus = async (req, res, next) => {
  const { email, matchDateTimeStart, matchDateTimeEnd } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError("Logging in failed", 422);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("No User", 500);
    return next(error);
  }

  existingUser.openToMatch = !existingUser.openToMatch;
  existingUser.matchDateTime = {
    start: matchDateTimeStart,
    end: matchDateTimeEnd,
  };

  try {
    await existingUser.save();
  } catch (err) {
    const error = new HttpError("update status failed...", 500);
    return next(error);
  }

  res.json({
    message: "Updated",
    user: existingUser.toObject({ getters: true }),
  });
};

const updateApples = async (req, res, next) => {
  const { email, apples } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError("Logging in failed", 422);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("No User", 500);
    return next(error);
  }

  existingUser.apples = apples;

  try {
    await existingUser.save();
  } catch (err) {
    const error = new HttpError("update status failed...", 500);
    return next(error);
  }

  res.json({
    message: "Updated",
    user: existingUser.toObject({ getters: true }),
  });
};

const updateTrees = async (req, res, next) => {
  const { email, trees } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError("Logging in failed", 422);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("No User", 500);
    return next(error);
  }

  existingUser.trees = trees;

  try {
    await existingUser.save();
  } catch (err) {
    const error = new HttpError("update status failed...", 500);
    return next(error);
  }

  res.json({
    message: "Updated",
    user: existingUser.toObject({ getters: true }),
  });
};

const updateVouchers = async (req, res, next) => {
  const { email, vouchers } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError("Logging in failed", 422);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("No User", 500);
    return next(error);
  }

  existingUser.vouchers = vouchers;

  try {
    await existingUser.save();
  } catch (err) {
    const error = new HttpError("update status failed...", 500);
    return next(error);
  }

  res.json({
    message: "Updated",
    user: existingUser.toObject({ getters: true }),
  });
};

exports.getOpenToMatchUsers = getOpenToMatchUsers;
exports.signUp = signUp;
exports.login = login;
exports.updateOpenToMatchStatus = updateOpenToMatchStatus;
exports.updateApples = updateApples;
exports.updateTrees = updateTrees;
exports.updateVouchers = updateVouchers;
