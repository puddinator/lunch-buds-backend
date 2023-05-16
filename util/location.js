const axios = require("axios");

const HttpError = require("../models/http-error");

require("dotenv").config();

const API_KEY = `${process.env.GEOLOCATION_API_KEY}`;
console.log(API_KEY);

async function getCoordsForAddress(address) {
  // return {
  //   lat: 1.23452,
  //   lng: -1.1365
  // }

  const response = await axios.get(
    `https://us1.locationiq.com/v1/search.php?key=${API_KEY}&q=${encodeURIComponent(
      address
    )}&format=json`
  );
  const data = response?.data[0];

  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError("cannot get coordinates for address", 422);
    throw error;
  }

  const coorLat = data.lat;
  const coorLon = data.lon;
  return {
    lat: coorLat,
    lng: coorLon,
  };
}

module.exports = getCoordsForAddress;
