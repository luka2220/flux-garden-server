/** HTTP Status Response Codes */
export enum StatusResponseCode {
  Success = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  InternalServerError = 500,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
}

/** Response Messages */
export enum ResponseMessages {
  ServerError = "Something went wrong",
  InvalidRequestBody = "Invalid request body",
  InvalidRequestParams = "Invalid request params",
  ResourceNotFound = "Resouce not found",
}
