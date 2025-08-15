import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

interface ApiResponseOptions {
  status: number;
  description: string;
  dataExample?: any;
  isError?: boolean;
}

export function ApiUnifiedResponse(options: ApiResponseOptions) {
  const { status, description, dataExample, isError = false } = options;

  const example = isError
    ? {
        code: status,
        status: -1,
        message: description,
        timestamp: 1692096000000,
        path: '/api/example',
      }
    : {
        code: status,
        status: 0,
        data: dataExample,
        timestamp: 1692096000000,
        path: '/api/example',
      };

  return applyDecorators(
    ApiResponse({
      status,
      description,
      schema: { example },
    }),
  );
}

export function ApiSuccessResponse(
  status: number = 200,
  description: string = '操作成功',
  dataExample?: any,
) {
  return ApiUnifiedResponse({
    status,
    description,
    dataExample,
    isError: false,
  });
}

export function ApiErrorResponse(status: number, description: string) {
  return ApiUnifiedResponse({ status, description, isError: true });
}
