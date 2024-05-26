const { build } = require("../config/env");

const successResponse = (res, data = null, message = null, code = 200) => {
  const response = { status: "success", data };
  // if (pagination) {
  //   response.pagination = pagination;
  // }
  if (message) {
    response.message = message;
  }
  res.status(code).json(response);
};

const errorResponse = (
  res,
  message = "Internal Server Error",
  errors = null,
  code = 500
) => {
  // 500 error don't display error details to client
  errors = build === "production" ? null : errors;

  res.status(code).json({
    status: "error",
    message,
    errors,
    code,
  });
};

module.exports = { successResponse, errorResponse };
