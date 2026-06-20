const StatusCode = {
  OK: 200,
  CREATED: 201,
};

const ReasonStatusCode = {
  OK: "OK",
  CREATED: "CREATED",
};

class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCode.OK,
    reason = ReasonStatusCode.OK,
    metadata = {},
    options = {},
  }) {
    this.message = !message ? reason : message;
    this.status = statusCode;
    this.metadata = metadata;
    this.options = options;
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata, options }) {
    super({ message, metadata, options });
  }
}

class CREATED extends SuccessResponse {
  constructor({
    message,
    statusCode = StatusCode.CREATED,
    reason = ReasonStatusCode.CREATED,
    metadata,
    options,
  }) {
    super({ message, statusCode, reason, metadata, options });
  }
}

module.exports = {
  OK,
  CREATED,
  SuccessResponse,
};
