const express = require("express");

const usersControllers = require("../controllers/users-controller");

const router = express.Router();

router.get("/", usersControllers.getOpenToMatchUsers);

router.post("/signup", usersControllers.signUp);

router.post("/login", usersControllers.login);

router.patch(
  "/updateOpenToMatchStatus",
  usersControllers.updateOpenToMatchStatus
);

router.patch("/updateApples", usersControllers.updateApples);

router.patch("/updateTrees", usersControllers.updateTrees);

router.patch("/updateVouchers", usersControllers.updateVouchers);

module.exports = router;
