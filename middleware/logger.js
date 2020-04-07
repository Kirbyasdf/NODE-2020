//middle ware demo, we have access to req.x anywhere in our routes

const logger = (req, res, next) => {
  console.log(
    req.method + req.protocol + "://" + req.get("host") + req.originalUrl
  );
  next();
};

module.exports = logger;
