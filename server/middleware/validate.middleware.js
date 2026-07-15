// middlewares/validate.js
// npm i zod
// Applied to all routes accepting input. Runs before the controller touches
// the DB — invalid input never reaches business logic (B.5).
//
// Usage: validate({ body: createDepartmentSchema })

import AppError from "./appError.middleware.js";

function validate(schema) {
  return function (req, res, next) {
    try {
      if (schema.body) req.body = schema.body.parse(req.body);
      if (schema.params) req.params = schema.params.parse(req.params);
      if (schema.query) req.query = schema.query.parse(req.query);
      return next();
    } catch (err) {
      const details = err.errors?.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));

      return next(
        new AppError(
          400,
          'VALIDATION_ERROR',
          details ? JSON.stringify(details) : 'Invalid request data'
        )
      );
    }
  };
}

export default validate;