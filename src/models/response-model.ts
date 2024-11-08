import { GENERIC_RESPONSE_STATUS } from '../enums/response-code.enum';

export class ResponseModel<T> {
  statusCode: string;
  message: string;
  data: T;

  constructor(statusCode: string, message: string, data: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  static success<T>(message: string, data?: T): ResponseModel<T> {
    return new ResponseModel<T>(GENERIC_RESPONSE_STATUS.SUCCESS, message, data);
  }

  static error<T>(message: string, data: T): ResponseModel<T> {
    return new ResponseModel<T>(GENERIC_RESPONSE_STATUS.FAILED, message, data);
  }
}
