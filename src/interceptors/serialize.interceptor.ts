import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';
import { ResponseModel } from '../models/response-model';

interface ClassConstructor {
  new (...args: any[]): {
    //
  };
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeModelledDataInterceptor(dto));
}

export class SerializeModelledDataInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: ResponseModel<any>) => {
        const responseData = plainToClass(this.dto, data.data, {
          excludeExtraneousValues: true,
        });

        const responseModelData = new ResponseModel(
          data?.statusCode,
          data?.message,
          responseData,
        );

        return responseModelData;
      }),
    );
  }
}
