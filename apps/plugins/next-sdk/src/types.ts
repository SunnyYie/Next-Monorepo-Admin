// 事件类型枚举
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

// 元素类型枚举
export enum ElementType {
  BUTTON = 'button',
  LINK = 'link',
  INPUT = 'input',
  FORM = 'form',
  DIV = 'div',
  SPAN = 'span',
  OTHER = 'other',
}

// 设备信息接口
export interface DeviceInfo {
  userAgent?: string;
  platform?: string;
  browser?: string;
  browserVersion?: string;
  screenResolution?: string;
  language?: string;
  timezone?: string;
}

// 位置信息接口
export interface LocationInfo {
  ipAddress?: string;
  country?: string;
  region?: string;
  city?: string;
}

// 基础事件数据接口
export interface BaseEventData {
  userId: string;
  userName: string;
  eventType: EventType;
  eventData?: Record<string, any>;
  
  // 页面相关信息
  pagePath?: string;
  pageTitle?: string;
  duration?: number;
  
  // 用户交互信息
  elementId?: string;
  elementType?: ElementType;
  elementText?: string;
  
  // 请求相关信息
  apiUrl?: string;
  httpMethod?: string;
  responseTime?: number;
  statusCode?: number;
  
  // 设备和环境信息
  deviceInfo?: DeviceInfo;
  locationInfo?: LocationInfo;
  
  // 会话信息
  sessionId?: string;
  referrer?: string;
  
  // 错误信息
  errorMessage?: string;
  errorStack?: string;
  
  // 自定义标签和属性
  tags?: string[];
  customData?: Record<string, any>;
}

// 错误事件数据接口
export interface ErrorEventData extends BaseEventData {
  eventType: EventType.ERROR;
  errorMessage: string;
  errorStack?: string;
  errorUrl?: string;
  errorLine?: number;
  errorColumn?: number;
  errorSource?: 'javascript' | 'promise' | 'resource' | 'network' | 'react';
}

// 页面访问事件数据接口
export interface PageViewEventData extends BaseEventData {
  eventType: EventType.PAGE_VIEW;
  pagePath: string;
  pageTitle?: string;
  referrer?: string;
}

// 用户交互事件数据接口
export interface UserInteractionEventData extends BaseEventData {
  eventType: EventType.BUTTON_CLICK | EventType.LINK_CLICK | EventType.FORM_SUBMIT;
  elementId?: string;
  elementType: ElementType;
  elementText?: string;
}

// API请求事件数据接口
export interface ApiRequestEventData extends BaseEventData {
  eventType: EventType.API_REQUEST;
  apiUrl: string;
  httpMethod: string;
  responseTime?: number;
  statusCode?: number;
}

// SDK配置接口
export interface SDKConfig {
  apiUrl: string;
  userId: string;
  userName: string;
  appName?: string;
  version?: string;
  debug?: boolean;
  autoTrack?: {
    pageView?: boolean;
    clicks?: boolean;
    errors?: boolean;
    apiRequests?: boolean;
    pageLeave?: boolean;
  };
  batchSize?: number;
  batchInterval?: number;
  maxRetries?: number;
  retryDelay?: number;
  enableLocalStorage?: boolean;
  enableSessionStorage?: boolean;
  customHeaders?: Record<string, string>;
}

// 错误信息接口
export interface ErrorInfo {
  message: string;
  stack?: string;
  url?: string;
  line?: number;
  column?: number;
  source?: 'javascript' | 'promise' | 'resource' | 'network' | 'react';
  componentStack?: string;
  timestamp?: number;
}

// 页面性能信息接口
export interface PerformanceInfo {
  loadTime?: number;
  domReadyTime?: number;
  firstPaintTime?: number;
  firstContentfulPaintTime?: number;
  largestContentfulPaintTime?: number;
  firstInputDelayTime?: number;
  cumulativeLayoutShiftScore?: number;
}

// 会话信息接口
export interface SessionInfo {
  sessionId: string;
  startTime: number;
  lastActiveTime: number;
  pageViewCount: number;
  eventCount: number;
}

// 事件队列项接口
export interface QueueItem {
  id: string;
  data: BaseEventData;
  timestamp: number;
  retryCount: number;
}

// SDK实例接口
export interface INextSDK {
  init(config: SDKConfig): void;
  track(eventData: Partial<BaseEventData>): void;
  trackPageView(pagePath: string, pageTitle?: string): void;
  trackClick(element: HTMLElement, customData?: Record<string, any>): void;
  trackError(error: Error | ErrorInfo): void;
  trackApiRequest(url: string, method: string, duration?: number, statusCode?: number): void;
  trackCustomEvent(eventType: string, data?: Record<string, any>): void;
  setUserId(userId: string): void;
  setUserName(userName: string): void;
  getSessionId(): string;
  flush(): Promise<void>;
  destroy(): void;
}
