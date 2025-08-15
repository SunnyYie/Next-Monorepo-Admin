import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseDto } from '../dto/response.dto';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        // 处理验证错误等复合错误信息
        const responseObj = exceptionResponse as any;
        if (responseObj.message) {
          if (Array.isArray(responseObj.message)) {
            message = responseObj.message.join(', ');
          } else {
            message = responseObj.message;
          }
        } else {
          message = responseObj.error || '请求处理失败';
        }
      } else {
        message = '请求处理失败';
      }
    } else {
      // 处理非 HTTP 异常
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = '服务器内部错误';

      // 记录未知错误
      this.logger.error('Unexpected error:', exception);
    }

    // 记录错误日志
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    // 返回统一错误格式
    const errorResponse = ResponseDto.error(message, status, request.url);

    response.status(status).json(errorResponse);
  }
}
