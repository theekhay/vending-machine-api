import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { GENERIC_RESPONSE_STATUS } from '../enums/common.enum';
import { ResponseModel } from '../models/response-model';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ResponseModel<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseModel<T>> {
    let response: any;

    const ctx = context.switchToHttp();
    // const request = ctx.getRequest();
    const httpResponse = ctx.getResponse();

    return next.handle().pipe(
      map((incomingResponse: any) => {
        if (incomingResponse instanceof ResponseModel) {
          response = incomingResponse;
        } else if (
          incomingResponse instanceof Error ||
          incomingResponse instanceof HttpException
        ) {
          response = {
            statusCode: GENERIC_RESPONSE_STATUS.FAILED,
            message: incomingResponse?.message || 'An Error occurred',
            data: null,
          };
        } else if (
          (incomingResponse?.stack && incomingResponse?.message) ||
          (incomingResponse?.statusCode &&
            incomingResponse?.statusCode !== '00')
        ) {
          response = {
            statusCode: '99',
            message: 'An Error occurred',
            data:
              incomingResponse?.data ||
              incomingResponse?.message ||
              'An Error occurred',
          };
        } else if (!incomingResponse) {
          response = {
            statusCode: '99',
            message: 'An Error occurred',
            data: null,
          };
        } else {
          response = {
            statusCode: incomingResponse?.statusCode || '00',
            message: incomingResponse?.message || 'Operation successful',
            data: incomingResponse?.data || null,
          };
        }

        const failureProp = response?.status || response?.statusCode;
        if (
          incomingResponse instanceof ResponseModel &&
          failureProp != '03' &&
          failureProp != '00'
        ) {
          httpResponse.status(400);
          response.message = incomingResponse?.message;
        }

        return response;
      }),
    );
  }
}
