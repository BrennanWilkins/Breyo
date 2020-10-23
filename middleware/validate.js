const { validationResult } = require('express-validator');

// express-validator middleware for validating input for all routes
const validate = (validations, msg) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) { return next(); }

    // if errors, respond w 400 error with the custom error message
    res.status(400).json({ msg });
  };
};

module.exports = validate;
