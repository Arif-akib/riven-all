function errorMiddleware(err, req, res, next) {
  if (err.name == "UnauthorizedError") {
    return res.status(401).json({
      success: false,
      error: err.message,
      name: err.name,
      message: "The user is not authorized",
    });
  }
  if (err.name == "ValidationError") {
    return res.status(400).json({
      success: false,
      error: err.message,
      name: err.name,
      message: err.message,
    });
  }
  return res.status(500).json({
    success: false,
    error: err.message,
    name: err.name,
    message: err.message,
  });
}

module.exports = errorMiddleware;
