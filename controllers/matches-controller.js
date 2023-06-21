/* eslint-disable consistent-return */
const { Configuration, OpenAIApi } = require("openai");
const { default: mongoose } = require("mongoose");

require("dotenv").config();

const HttpError = require("../models/http-error");
const Match = require("../models/match");
const User = require("../models/user");

const getMatchesByUserId = async (req, res, next) => {
  const userId = req.params.pid;

  let userWithMatches;
  try {
    userWithMatches = await User.findById(userId).populate("pastMatches");
  } catch (err) {
    const error = new HttpError("something went wrong with mongoose", 500);
    return next(error);
  }

  if (!userWithMatches || userWithMatches.pastMatches.length === 0) {
    // const error = new HttpError(
    //   "Could not find matches for provided user id.",
    //   404
    // );
    // return next(error);

    // for now just return [] if it is empty
    return [];
  }

  res.json({
    pastMatches: userWithMatches.pastMatches.map((pastMatch) =>
      pastMatch.toObject({ getters: true })
    ),
  });
};

const createMatch = async (req, res, next) => {
  const { creatorID, targetID, commonDateTime, commonInterests } = req.body;

  let creator;
  let target;

  try {
    creator = await User.findById(creatorID);
    target = await User.findById(targetID);
  } catch (err) {
    const error = new HttpError("creating match failed...", 500);
    return next(error);
  }

  if (!creator || !target) {
    const error = new HttpError("no valid creator or target id", 500);
    return next(error);
  }

  const createdMatch = new Match({
    creatorID,
    targetID,
    isAccepted: false,
    commonDateTime,
    // an array of interests
    commonInterests,
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdMatch.save({ session: sess });
    creator.pastMatches.push(createdMatch);
    await creator.save({ session: sess });
    target.pastMatches.push(createdMatch);
    await target.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("create match failed...", 500);
    return next(error);
  }

  res.status(201).json({ match: createdMatch });
};

const updateMatch = async (req, res, next) => {
  const matchId = req.params.mid;

  let match;
  try {
    match = await Match.findById(matchId);
  } catch (err) {
    const error = new HttpError("something went wrong with mongoose", 500);
    return next(error);
  }
  if (!match) {
    return next(new HttpError("Could not find match for provided id.", 404));
  }

  match.isAccepted = true;

  try {
    await match.save();
  } catch (err) {
    const error = new HttpError("update match failed...", 500);
    return next(error);
  }

  res.status(200).json({ match: match.toObject({ getters: true }) });
};

const deleteMatch = async (req, res, next) => {
  const matchId = req.params.mid;

  let match;
  try {
    match = await Match.findById(matchId).populate("creator target");
  } catch (err) {
    const error = new HttpError("mongoose find didn't work", 500);
    return next(error);
  }

  if (!match) {
    throw new HttpError("Could not find match for that id.", 404);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await match.deleteOne({ session: sess });
    match.creator.pastMatches.pull(match);
    await match.creator.save({ session: sess });
    match.target.pastMatches.pull(match);
    await match.target.save({ session: sess });
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  res.status(200).json({ message: "deleted match" });
};

const getPromptsByMatchId = async (req, res, next) => {
  const matchId = req.params.mid;
  const { isCreator } = req.body;

  let existingMatch;
  try {
    existingMatch = await Match.findById(matchId);
  } catch (err) {
    const error = new HttpError("something went wrong with mongoose", 500);
    return next(error);
  }

  if (!existingMatch || existingMatch.length === 0) {
    const error = new HttpError(
      "Could not find matches for provided match id.",
      404
    );
    return next(error);
  }

  let creator;
  let target;
  try {
    creator = await User.findById(existingMatch.creatorID);
    target = await User.findById(existingMatch.targetID);
  } catch (err) {
    const error = new HttpError("something went wrong with mongoose 2", 500);
    return next(error);
  }

  if (!creator || creator.length === 0 || !target || target.length === 0) {
    const error = new HttpError(
      `no creator, ${creator}, or target, ${target}`,
      404
    );
    return next(error);
  }

  const query = `Generate 10 conversation prompts for ${
    isCreator ? creator.name : target.name
  } for a conversation with ${isCreator ? target.name : creator.name}. 
  Make it personalized and based on their interests. 
  ${isCreator ? creator.name : target.name}'s interests: ${
    isCreator ? creator.interests : target.interests
  }. 
  ${isCreator ? target.name : creator.name}'s interests: ${
    isCreator ? target.interests : creator.interests
  }. 
  Reply in the following JSON format: prompts: ["Example Conversation Prompt 1", "Example Conversation Prompt 2"] and so on...`;

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: query,
    temperature: 0.6,
  });

  console.log(completion);

  res.json({ completion });
};

exports.getMatchesByUserId = getMatchesByUserId;
exports.createMatch = createMatch;
exports.updateMatch = updateMatch;
exports.deleteMatch = deleteMatch;
exports.getPromptsByMatchId = getPromptsByMatchId;
