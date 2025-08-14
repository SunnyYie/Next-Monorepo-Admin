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

export interface UserEvent {
  id: string;
  userId: string;
  userName: string;
  eventType: EventType;
  eventData?: any;

  // 页面相关信息
  pagePath?: string;
  pageTitle?: string;
  duration?: number;

  // 用户交互信息
  elementId?: string;
  elementType?: string;
  elementText?: string;

  // 请求相关信息
  apiUrl?: string;
  httpMethod?: string;
  responseTime?: number;
  statusCode?: number;

  // 设备和环境信息
  userAgent?: string;
  platform?: string;
  browser?: string;
  browserVersion?: string;
  screenResolution?: string;
  language?: string;
  timezone?: string;

  // IP 和地理位置信息
  ipAddress?: string;
  country?: string;
  region?: string;
  city?: string;

  // 会话信息
  sessionId?: string;
  referrer?: string;

  // 错误信息
  errorMessage?: string;
  errorStack?: string;

  // 自定义标签和属性
  tags: string[];
  customData?: any;

  createdAt: Date;
}

export interface EventStats {
  summary: {
    totalEvents: number;
    uniqueUsers: number;
  };
  eventTypeStats: Array<{
    eventType: string;
    count: number;
  }>;
  pageStats: Array<{
    pagePath: string;
    count: number;
  }>;
  browserStats: Array<{
    browser: string;
    count: number;
  }>;
  platformStats: Array<{
    platform: string;
    count: number;
  }>;
}

export interface SessionAnalysis {
  totalEvents: number;
  sessionCount: number;
  sessions: Array<{
    sessionId: string;
    startTime: Date;
    endTime: Date;
    duration: number;
    eventCount: number;
    pageViewCount: number;
    uniquePageCount: number;
    events: UserEvent[];
  }>;
}

export interface PagePerformanceStats {
  pagePath: string;
  viewCount: number;
  avgDuration: number;
  minDuration: number;
  maxDuration: number;
  medianDuration: number;
}
