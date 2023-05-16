class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); // adds message property to base class error
    this.code = errorCode;
  }
}

module.exports = HttpError;
