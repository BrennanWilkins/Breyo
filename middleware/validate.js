const { param, body, validationResult } = require('express-validator');

// express-validator middleware for validating input for all routes
const validate = (validations, msg) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) { return next(); }

    // if errors, respond w 400 error with the custom error message
    if (msg) { res.status(400).json({ msg }); }
    else { res.sendStatus(400); }
  };
};

// helper for running multiple isMongoId validator
const areAllMongo = (fields, type) => {
  if (type === 'body') {
    return fields.map(field => body(field).isMongoId());
  }
  return fields.map(field => param(field).isMongoId());
};

module.exports = validate;
module.exports.areAllMongo = areAllMongo;
