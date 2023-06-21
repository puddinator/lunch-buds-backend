const express = require("express");

const matchesControllers = require("../controllers/matches-controller");

const router = express.Router();

router.get("/user/:uid", matchesControllers.getMatchesByUserId);

router.post("/", matchesControllers.createMatch);

router.patch("/:mid", matchesControllers.updateMatch);

router.delete("/:mid", matchesControllers.deleteMatch);

router.post("/prompts/:mid", matchesControllers.getPromptsByMatchId);

module.exports = router;
