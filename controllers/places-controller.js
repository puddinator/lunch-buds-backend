const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

let DUMMY = [
  {
    id: "p1",
    title: "prsd",
    description: "just",
    location: {
      lat: 1,
      lng: 1,
    },
    address: " street",
    creator: "u1",
  },
];

const getPlaceById = (req, res) => {
  const placeId = req.params.pid;
  console.log("GET request in places");
  const place = DUMMY.find((p) => p.id === placeId);

  if (!place) {
    throw new HttpError("Could not find place for provided id.", 404);
  }
  res.json({ place });
};

const getPlacesByUserid = (req, res) => {
  const userId = req.params.pid;

  const places = DUMMY.filter((p) => p.creator === userId);
  if (!places || places.length === 0) {
    throw new HttpError("Could not find places for provided user id.", 404);
  }
  res.json({ places });
};

const createPlace = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("invalid inputs passed!", 422);
  }

  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY.push(createdPlace);

  res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("invalid inputs passed!", 422);
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  const updatedPlace = { ...DUMMY.find((p) => p.id === placeId) };
  if (!updatedPlace) {
    throw new HttpError("Could not find place for provided id.", 404);
  }

  updatedPlace.title = title;
  updatedPlace.description = description;

  const placeIndex = DUMMY.findIndex((p) => p.id === placeId);
  DUMMY[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res) => {
  const placeId = req.params.pid;

  if (!DUMMY.find((p) => p.id === placeId)) {
    throw new HttpError("Could not find places for that id.", 404);
  }

  DUMMY = DUMMY.filter((p) => p.id !== placeId);

  res.status(200).json({ message: "deleted place." });
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserid = getPlacesByUserid;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
