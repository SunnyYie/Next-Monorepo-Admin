import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T = any> {
  @ApiProperty({ description: 'HTTP状态码', example: 200 })
  code: number;

  @ApiProperty({ description: '业务状态码，0表示成功，-1表示失败', example: 0 })
  status: number;

  @ApiProperty({ description: '响应数据' })
  data?: T;

  @ApiProperty({ description: '错误信息', required: false })
  message?: string;

  @ApiProperty({ description: '响应时间戳', example: 1692096000000 })
  timestamp: number;

  @ApiProperty({ description: '请求路径', example: '/api/users' })
  path: string;

  constructor(
    code: number,
    status: number,
    data?: T,
    message?: string,
    path?: string,
  ) {
    this.code = code;
    this.status = status;
    this.data = data;
    this.message = message;
    this.timestamp = Date.now();
    this.path = path || '';
  }

  static success<T>(
    data?: T,
    code: number = 200,
    path?: string,
  ): ResponseDto<T> {
    return new ResponseDto(code, 0, data, undefined, path);
  }

  static error(
    message: string,
    code: number = 500,
    path?: string,
  ): ResponseDto {
    return new ResponseDto(code, -1, undefined, message, path);
  }
}
