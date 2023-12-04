const errorHandler = (err, req, res, next) => {
  console.error("Error middleware: ", err);

  res.status(500).json({ msg: "Something failed" });
};

const notFound = (req, res, next) => {
  const error = `The url: ${req.originalUrl} not found.`;

  res.status(404).json({ msg: error });
};

export { errorHandler, notFound };
