const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

const DUMMY = [
  { id: "u1", name: "yeah", email: "test@tes.com", password: "test" },
  { id: "u2", name: "ye2ah", email: "tessaft@tes.com", password: "ftest" },
];

const getUsers = (req, res) => {
  res.status(200).json({ users: DUMMY });
};

const signUp = (req, res) => {
  const { name, email, password } = req.body;

  const userPreviouslyRegistered = DUMMY.find((u) => u.email === email);
  if (userPreviouslyRegistered) {
    throw new HttpError("User alr exists, cannot sign up again", 422);
  }

  const createdUser = {
    id: uuid(),
    name,
    email,
    password,
  };

  DUMMY.push(createdUser);
  res.status(201).json({ user: createdUser });
};

const login = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("invalid inputs passed!", 422);
  }

  const { email, password } = req.body;

  const validUser = DUMMY.find((u) => u.email === email);
  if (!validUser || validUser.password !== password) {
    throw new HttpError("User email or password wrong");
  }

  res.json({ message: "Logged in" });
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;
