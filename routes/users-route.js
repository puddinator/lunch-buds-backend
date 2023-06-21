const express = require("express");
const { check } = require("express-validator");

const usersControllers = require("../controllers/users-controller");

const router = express.Router();

router.get("/", usersControllers.getOpenToMatchUsers);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersControllers.signUp
);

router.post("/login", usersControllers.login);

router.patch(
  "/updateOpenToMatchStatus",
  usersControllers.updateOpenToMatchStatus
);

router.patch(
  "/updateOpenToMatchStatus",
  usersControllers.updateOpenToMatchStatus
);

router.patch("/updateApples", usersControllers.updateApples);

router.patch("/updateTrees", usersControllers.updateTrees);

router.patch("/updateVouchers", usersControllers.updateVouchers);

module.exports = router;
