import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseDto } from '../dto/response.dto';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ResponseDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseDto<T>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        // 如果返回的数据已经是 ResponseDto 格式，直接返回
        if (
          data &&
          typeof data === 'object' &&
          'code' in data &&
          'status' in data
        ) {
          return data;
        }

        // 否则包装成统一格式
        return ResponseDto.success(data, response.statusCode, request.url);
      }),
    );
  }
}
