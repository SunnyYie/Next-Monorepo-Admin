import {
  IsString,
  IsOptional,
  IsInt,
  IsArray,
  IsObject,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum EventType {
  PAGE_VIEW = 'page_view',
  PAGE_LEAVE = 'page_leave',
  BUTTON_CLICK = 'button_click',
  LINK_CLICK = 'link_click',
  FORM_SUBMIT = 'form_submit',
  INPUT_FOCUS = 'input_focus',
  INPUT_BLUR = 'input_blur',
  API_REQUEST = 'api_request',
  ERROR = 'error',
  SCROLL = 'scroll',
  RESIZE = 'resize',
  CUSTOM = 'custom',
}

export enum ElementType {
  BUTTON = 'button',
  LINK = 'link',
  INPUT = 'input',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  IMAGE = 'image',
  VIDEO = 'video',
  DIV = 'div',
  SPAN = 'span',
  OTHER = 'other',
}

export class DeviceInfoDto {
  @ApiPropertyOptional({ description: '用户代理字符串' })
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiPropertyOptional({ description: '操作系统平台' })
  @IsOptional()
  @IsString()
  platform?: string;

  @ApiPropertyOptional({ description: '浏览器名称' })
  @IsOptional()
  @IsString()
  browser?: string;

  @ApiPropertyOptional({ description: '浏览器版本' })
  @IsOptional()
  @IsString()
  browserVersion?: string;

  @ApiPropertyOptional({ description: '屏幕分辨率' })
  @IsOptional()
  @IsString()
  screenResolution?: string;

  @ApiPropertyOptional({ description: '浏览器语言' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ description: '时区' })
  @IsOptional()
  @IsString()
  timezone?: string;
}

export class LocationInfoDto {
  @ApiPropertyOptional({ description: 'IP地址' })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiPropertyOptional({ description: '国家' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: '地区' })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiPropertyOptional({ description: '城市' })
  @IsOptional()
  @IsString()
  city?: string;
}

export class CreateUserEventDto {
  @ApiProperty({ description: '用户ID' })
  @IsString()
  userId: string;

  @ApiProperty({ description: '用户名' })
  @IsString()
  userName: string;

  @ApiProperty({ description: '事件类型', enum: EventType })
  @IsEnum(EventType)
  eventType: EventType;

  @ApiPropertyOptional({ description: '事件详细数据' })
  @IsOptional()
  @IsObject()
  eventData?: any;

  // 页面相关信息
  @ApiPropertyOptional({ description: '页面路径' })
  @IsOptional()
  @IsString()
  pagePath?: string;

  @ApiPropertyOptional({ description: '页面标题' })
  @IsOptional()
  @IsString()
  pageTitle?: string;

  @ApiPropertyOptional({ description: '停留时间（毫秒）', minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  duration?: number;

  // 用户交互信息
  @ApiPropertyOptional({ description: '点击元素ID' })
  @IsOptional()
  @IsString()
  elementId?: string;

  @ApiPropertyOptional({ description: '元素类型', enum: ElementType })
  @IsOptional()
  @IsEnum(ElementType)
  elementType?: ElementType;

  @ApiPropertyOptional({ description: '元素文本内容' })
  @IsOptional()
  @IsString()
  elementText?: string;

  // 请求相关信息
  @ApiPropertyOptional({ description: 'API 请求地址' })
  @IsOptional()
  @IsString()
  apiUrl?: string;

  @ApiPropertyOptional({ description: 'HTTP 方法' })
  @IsOptional()
  @IsString()
  httpMethod?: string;

  @ApiPropertyOptional({ description: '响应时间（毫秒）', minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  responseTime?: number;

  @ApiPropertyOptional({
    description: '响应状态码',
    minimum: 100,
    maximum: 599,
  })
  @IsOptional()
  @IsInt()
  @Min(100)
  @Max(599)
  statusCode?: number;

  // 设备信息
  @ApiPropertyOptional({ description: '设备信息', type: DeviceInfoDto })
  @IsOptional()
  @IsObject()
  deviceInfo?: DeviceInfoDto;

  // 位置信息
  @ApiPropertyOptional({ description: '位置信息', type: LocationInfoDto })
  @IsOptional()
  @IsObject()
  locationInfo?: LocationInfoDto;

  // 会话信息
  @ApiPropertyOptional({ description: '会话ID' })
  @IsOptional()
  @IsString()
  sessionId?: string;

  @ApiPropertyOptional({ description: '来源页面' })
  @IsOptional()
  @IsString()
  referrer?: string;

  // 错误信息
  @ApiPropertyOptional({ description: '错误消息' })
  @IsOptional()
  @IsString()
  errorMessage?: string;

  @ApiPropertyOptional({ description: '错误堆栈' })
  @IsOptional()
  @IsString()
  errorStack?: string;

  // 自定义信息
  @ApiPropertyOptional({ description: '自定义标签', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: '自定义数据' })
  @IsOptional()
  @IsObject()
  customData?: any;
}

export class UserEventQueryDto {
  @ApiPropertyOptional({ description: '用户ID' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ description: '事件类型', enum: EventType })
  @IsOptional()
  @IsEnum(EventType)
  eventType?: EventType;

  @ApiPropertyOptional({ description: '页面路径' })
  @IsOptional()
  @IsString()
  pagePath?: string;

  @ApiPropertyOptional({ description: '会话ID' })
  @IsOptional()
  @IsString()
  sessionId?: string;

  @ApiPropertyOptional({ description: '开始时间 (ISO 8601)' })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional({ description: '结束时间 (ISO 8601)' })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiPropertyOptional({ description: '页码', minimum: 1, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: '每页数量',
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 20;
}

export class UserEventStatsDto {
  @ApiPropertyOptional({ description: '用户ID' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ description: '开始时间 (ISO 8601)' })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional({ description: '结束时间 (ISO 8601)' })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiPropertyOptional({
    description: '分组维度',
    enum: ['hour', 'day', 'week', 'month'],
  })
  @IsOptional()
  @IsString()
  groupBy?: 'hour' | 'day' | 'week' | 'month' = 'day';
}

export class BatchCreateUserEventDto {
  @ApiProperty({ description: '批量事件数据', type: [CreateUserEventDto] })
  @IsArray()
  events: CreateUserEventDto[];
}
