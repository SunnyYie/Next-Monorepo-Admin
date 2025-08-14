import {
  SDKConfig,
  BaseEventData,
  ErrorEventData,
  PageViewEventData,
  UserInteractionEventData,
  ApiRequestEventData,
  EventType,
  ElementType,
  DeviceInfo,
  ErrorInfo,
  SessionInfo,
  QueueItem,
  INextSDK,
} from './types';

class NextSDK implements INextSDK {
  private config!: SDKConfig;
  private sessionId: string;
  private eventQueue: QueueItem[] = [];
  private batchTimer: NodeJS.Timeout | null = null;
  private isInitialized = false;
  private deviceInfo: DeviceInfo;
  private sessionInfo: SessionInfo;
  private pageStartTime: number = Date.now();

  constructor() {
    this.sessionId = this.generateSessionId();
    this.deviceInfo = this.collectDeviceInfo();
    this.sessionInfo = {
      sessionId: this.sessionId,
      startTime: Date.now(),
      lastActiveTime: Date.now(),
      pageViewCount: 0,
      eventCount: 0,
    };
  }

  /**
   * 初始化SDK
   */
  public init(config: SDKConfig): void {
    this.config = {
      debug: false,
      autoTrack: {
        pageView: true,
        clicks: true,
        errors: true,
        apiRequests: true,
        pageLeave: true,
      },
      batchSize: 10,
      batchInterval: 30000, // 30秒
      maxRetries: 3,
      retryDelay: 1000,
      enableLocalStorage: true,
      enableSessionStorage: true,
      ...config,
    };

    this.isInitialized = true;
    this.log('NextSDK 初始化完成', this.config);

    // 设置自动追踪
    this.setupAutoTracking();

    // 开始批量发送
    this.startBatchSending();

    // 恢复未发送的事件
    this.restoreQueueFromStorage();

    // 初始页面访问追踪
    if (this.config.autoTrack?.pageView) {
      this.trackPageView(window.location.pathname, document.title);
    }
  }

  /**
   * 追踪通用事件
   */
  public track(eventData: Partial<BaseEventData>): void {
    if (!this.isInitialized) {
      this.log('SDK 未初始化，无法追踪事件');
      return;
    }

    const fullEventData: BaseEventData = {
      userId: this.config.userId,
      userName: this.config.userName,
      eventType: EventType.CUSTOM,
      sessionId: this.sessionId,
      deviceInfo: this.deviceInfo,
      pagePath: window.location.pathname,
      pageTitle: document.title,
      referrer: document.referrer,
      ...eventData,
    };

    this.addToQueue(fullEventData);
    this.updateSessionInfo();
  }

  /**
   * 追踪页面访问
   */
  public trackPageView(pagePath: string, pageTitle?: string): void {
    const eventData: PageViewEventData = {
      userId: this.config.userId,
      userName: this.config.userName,
      eventType: EventType.PAGE_VIEW,
      pagePath,
      pageTitle: pageTitle || document.title,
      sessionId: this.sessionId,
      deviceInfo: this.deviceInfo,
      referrer: document.referrer,
    };

    this.addToQueue(eventData);
    this.sessionInfo.pageViewCount++;
    this.updateSessionInfo();
    this.pageStartTime = Date.now();

    this.log('页面访问追踪', eventData);
  }

  /**
   * 追踪页面离开
   */
  public trackPageLeave(): void {
    const duration = Date.now() - this.pageStartTime;
    const eventData: BaseEventData = {
      userId: this.config.userId,
      userName: this.config.userName,
      eventType: EventType.PAGE_LEAVE,
      pagePath: window.location.pathname,
      pageTitle: document.title,
      duration,
      sessionId: this.sessionId,
      deviceInfo: this.deviceInfo,
    };

    this.addToQueue(eventData);
    this.updateSessionInfo();

    this.log('页面离开追踪', eventData);
  }

  /**
   * 追踪点击事件
   */
  public trackClick(
    element: HTMLElement,
    customData?: Record<string, any>
  ): void {
    const elementType = this.getElementType(element);
    const eventType =
      elementType === ElementType.LINK
        ? EventType.LINK_CLICK
        : EventType.BUTTON_CLICK;

    const eventData: UserInteractionEventData = {
      userId: this.config.userId,
      userName: this.config.userName,
      eventType,
      elementId: element.id,
      elementType,
      elementText: element.textContent?.trim() || '',
      pagePath: window.location.pathname,
      pageTitle: document.title,
      sessionId: this.sessionId,
      deviceInfo: this.deviceInfo,
      customData,
    };

    this.addToQueue(eventData);
    this.updateSessionInfo();

    this.log('点击事件追踪', eventData);
  }

  /**
   * 追踪错误
   */
  public trackError(error: Error | ErrorInfo): void {
    let errorData: ErrorEventData;

    if (error instanceof Error) {
      errorData = {
        userId: this.config.userId,
        userName: this.config.userName,
        eventType: EventType.ERROR,
        errorMessage: error.message,
        errorStack: error.stack,
        errorUrl: window.location.href,
        errorSource: 'javascript',
        pagePath: window.location.pathname,
        pageTitle: document.title,
        sessionId: this.sessionId,
        deviceInfo: this.deviceInfo,
      };
    } else {
      errorData = {
        userId: this.config.userId,
        userName: this.config.userName,
        eventType: EventType.ERROR,
        errorMessage: error.message,
        errorStack: error.stack,
        errorUrl: error.url || window.location.href,
        errorLine: error.line,
        errorColumn: error.column,
        errorSource: error.source || 'javascript',
        pagePath: window.location.pathname,
        pageTitle: document.title,
        sessionId: this.sessionId,
        deviceInfo: this.deviceInfo,
      };
    }

    this.addToQueue(errorData);
    this.updateSessionInfo();

    this.log('错误追踪', errorData);
  }

  /**
   * 追踪API请求
   */
  public trackApiRequest(
    url: string,
    method: string,
    duration?: number,
    statusCode?: number
  ): void {
    const eventData: ApiRequestEventData = {
      userId: this.config.userId,
      userName: this.config.userName,
      eventType: EventType.API_REQUEST,
      apiUrl: url,
      httpMethod: method.toUpperCase(),
      responseTime: duration,
      statusCode,
      pagePath: window.location.pathname,
      pageTitle: document.title,
      sessionId: this.sessionId,
      deviceInfo: this.deviceInfo,
    };

    this.addToQueue(eventData);
    this.updateSessionInfo();

    this.log('API请求追踪', eventData);
  }

  /**
   * 追踪自定义事件
   */
  public trackCustomEvent(eventType: string, data?: Record<string, any>): void {
    const eventData: BaseEventData = {
      userId: this.config.userId,
      userName: this.config.userName,
      eventType: eventType as EventType,
      eventData: data,
      pagePath: window.location.pathname,
      pageTitle: document.title,
      sessionId: this.sessionId,
      deviceInfo: this.deviceInfo,
      customData: data,
    };

    this.addToQueue(eventData);
    this.updateSessionInfo();

    this.log('自定义事件追踪', eventData);
  }

  /**
   * 设置用户ID
   */
  public setUserId(userId: string): void {
    this.config.userId = userId;
    this.log('用户ID已更新', userId);
  }

  /**
   * 设置用户名
   */
  public setUserName(userName: string): void {
    this.config.userName = userName;
    this.log('用户名已更新', userName);
  }

  /**
   * 获取会话ID
   */
  public getSessionId(): string {
    return this.sessionId;
  }

  /**
   * 立即发送所有队列中的事件
   */
  public async flush(): Promise<void> {
    if (this.eventQueue.length === 0) {
      this.log('事件队列为空，无需发送');
      return;
    }

    await this.sendBatch();
  }

  /**
   * 销毁SDK实例
   */
  public destroy(): void {
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
      this.batchTimer = null;
    }

    // 发送剩余事件
    this.flush();

    // 移除事件监听器
    this.removeAutoTracking();

    this.isInitialized = false;
    this.log('NextSDK 已销毁');
  }

  /**
   * 设置自动追踪
   */
  private setupAutoTracking(): void {
    // 错误监听
    if (this.config.autoTrack?.errors) {
      this.setupErrorTracking();
    }

    // 点击监听
    if (this.config.autoTrack?.clicks) {
      this.setupClickTracking();
    }

    // API请求监听
    if (this.config.autoTrack?.apiRequests) {
      this.setupApiTracking();
    }

    // 页面离开监听
    if (this.config.autoTrack?.pageLeave) {
      this.setupPageLeaveTracking();
    }

    // 页面可见性变化监听
    // this.setupVisibilityTracking();
  }

  /**
   * 设置错误追踪
   */
  private setupErrorTracking(): void {
    // JavaScript错误
    window.addEventListener('error', (event) => {
      this.trackError({
        message: event.message,
        stack: event.error?.stack,
        url: event.filename,
        line: event.lineno,
        column: event.colno,
        source: 'javascript',
      });
    });

    // Promise错误
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        message: event.reason?.message || String(event.reason),
        stack: event.reason?.stack,
        source: 'promise',
      });
    });

    // 资源加载错误
    window.addEventListener(
      'error',
      (event) => {
        if (event.target !== window) {
          this.trackError({
            message: `资源加载失败: ${(event.target as any)?.src || (event.target as any)?.href}`,
            source: 'resource',
          });
        }
      },
      true
    );
  }

  /**
   * 设置点击追踪
   */
  private setupClickTracking(): void {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.onclick)
      ) {
        this.trackClick(target);
      }
    });
  }

  /**
   * 设置API追踪
   */
  private setupApiTracking(): void {
    // 拦截fetch请求
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = Date.now();
      const url = args[0] as string;
      const options = args[1] || {};
      const method = options.method || 'GET';

      try {
        const response = await originalFetch(...args);
        const duration = Date.now() - startTime;
        this.trackApiRequest(url, method, duration, response.status);
        return response;
      } catch (error) {
        const duration = Date.now() - startTime;
        this.trackApiRequest(url, method, duration, 0);
        throw error;
      }
    };

    // 拦截XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (
      method: string,
      url: string,
      ...args: any[]
    ) {
      (this as any)._method = method;
      (this as any)._url = url;
      (this as any)._startTime = Date.now();
      return (originalXHROpen as any).apply(this, [method, url, ...args]);
    };

    XMLHttpRequest.prototype.send = function (...args: any[]) {
      const xhr = this;
      const startTime = (xhr as any)._startTime;

      xhr.addEventListener('loadend', function () {
        const duration = Date.now() - startTime;
        const method = (xhr as any)._method;
        const url = (xhr as any)._url;
        const sdk = (window as any).__nextSDK;
        if (sdk) {
          sdk.trackApiRequest(url, method, duration, xhr.status);
        }
      });

      return (originalXHRSend as any).apply(this, args);
    };
  }

  /**
   * 设置页面离开追踪
   */
  private setupPageLeaveTracking(): void {
    window.addEventListener('beforeunload', () => {
      this.trackPageLeave();
      // 尝试立即发送
      if (typeof navigator.sendBeacon === 'function') {
        this.sendBeacon();
      }
    });

    window.addEventListener('pagehide', () => {
      this.trackPageLeave();
      if (typeof navigator.sendBeacon === 'function') {
        this.sendBeacon();
      }
    });
  }

  /**
   * 设置页面可见性追踪
   */
  private setupVisibilityTracking(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackCustomEvent('page_hidden');
      } else {
        this.trackCustomEvent('page_visible');
        this.updateSessionInfo();
      }
    });
  }

  /**
   * 移除自动追踪
   */
  private removeAutoTracking(): void {
    // 这里应该移除所有事件监听器，但由于我们修改了原生方法，
    // 在实际应用中可能需要更复杂的清理逻辑
  }

  /**
   * 收集设备信息
   */
  private collectDeviceInfo(): DeviceInfo {
    const userAgent = navigator.userAgent;
    return {
      userAgent,
      platform: navigator.platform,
      browser: this.getBrowserName(userAgent),
      browserVersion: this.getBrowserVersion(userAgent),
      screenResolution: `${screen.width}x${screen.height}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  /**
   * 获取浏览器名称
   */
  private getBrowserName(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  /**
   * 获取浏览器版本
   */
  private getBrowserVersion(userAgent: string): string {
    const match = userAgent.match(/(Chrome|Firefox|Safari|Edge)\/(\d+)/);
    return match ? match[2] : 'Unknown';
  }

  /**
   * 获取元素类型
   */
  private getElementType(element: HTMLElement): ElementType {
    const tagName = element.tagName.toLowerCase();
    switch (tagName) {
      case 'button':
        return ElementType.BUTTON;
      case 'a':
        return ElementType.LINK;
      case 'input':
        return ElementType.INPUT;
      case 'form':
        return ElementType.FORM;
      case 'div':
        return ElementType.DIV;
      case 'span':
        return ElementType.SPAN;
      default:
        return ElementType.OTHER;
    }
  }

  /**
   * 生成会话ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 生成事件ID
   */
  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 添加事件到队列
   */
  private addToQueue(eventData: BaseEventData): void {
    const queueItem: QueueItem = {
      id: this.generateEventId(),
      data: eventData,
      timestamp: Date.now(),
      retryCount: 0,
    };

    this.eventQueue.push(queueItem);

    // 保存到本地存储
    this.saveQueueToStorage();

    // 如果队列达到批量大小，立即发送
    if (this.eventQueue.length >= this.config.batchSize!) {
      this.sendBatch();
    }
  }

  /**
   * 开始批量发送
   */
  private startBatchSending(): void {
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
    }

    this.batchTimer = setInterval(() => {
      this.sendBatch();
    }, this.config.batchInterval!);
  }

  /**
   * 发送批量事件
   */
  private async sendBatch(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const batch = this.eventQueue.splice(0, this.config.batchSize!);
    const eventData = batch.map((item) => item.data);

    try {
      const response = await fetch(`${this.config.apiUrl}/user-events/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.config.customHeaders,
        },
        body: JSON.stringify({ events: eventData }),
      });

      if (response.ok) {
        this.log(`成功发送 ${batch.length} 个事件`);
        this.saveQueueToStorage();
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      this.log('发送事件失败', error);

      // 重试机制
      const retriableBatch = batch.filter(
        (item) => item.retryCount < this.config.maxRetries!
      );
      retriableBatch.forEach((item) => {
        item.retryCount++;
        this.eventQueue.unshift(item);
      });

      // 延迟重试
      setTimeout(
        () => {
          this.sendBatch();
        },
        this.config.retryDelay! *
          Math.pow(2, retriableBatch[0]?.retryCount || 0)
      );
    }
  }

  /**
   * 使用sendBeacon发送
   */
  private sendBeacon(): void {
    if (this.eventQueue.length === 0) return;

    const eventData = this.eventQueue.map((item) => item.data);
    const data = JSON.stringify({ events: eventData });

    navigator.sendBeacon(`${this.config.apiUrl}/user-events/batch`, data);
    this.eventQueue = [];
    this.clearStorageQueue();
  }

  /**
   * 保存队列到本地存储
   */
  private saveQueueToStorage(): void {
    if (!this.config.enableLocalStorage) return;

    try {
      localStorage.setItem(
        'nextSDK_eventQueue',
        JSON.stringify(this.eventQueue)
      );
    } catch (error) {
      this.log('保存队列到本地存储失败', error);
    }
  }

  /**
   * 从本地存储恢复队列
   */
  private restoreQueueFromStorage(): void {
    if (!this.config.enableLocalStorage) return;

    try {
      const saved = localStorage.getItem('nextSDK_eventQueue');
      if (saved) {
        this.eventQueue = JSON.parse(saved);
        this.log(`从本地存储恢复 ${this.eventQueue.length} 个事件`);
      }
    } catch (error) {
      this.log('从本地存储恢复队列失败', error);
    }
  }

  /**
   * 清除存储队列
   */
  private clearStorageQueue(): void {
    if (!this.config.enableLocalStorage) return;

    try {
      localStorage.removeItem('nextSDK_eventQueue');
    } catch (error) {
      this.log('清除存储队列失败', error);
    }
  }

  /**
   * 更新会话信息
   */
  private updateSessionInfo(): void {
    this.sessionInfo.lastActiveTime = Date.now();
    this.sessionInfo.eventCount++;

    if (this.config.enableSessionStorage) {
      try {
        sessionStorage.setItem(
          'nextSDK_sessionInfo',
          JSON.stringify(this.sessionInfo)
        );
      } catch (error) {
        this.log('保存会话信息失败', error);
      }
    }
  }

  /**
   * 日志输出
   */
  private log(message: string, data?: any): void {
    if (this.config.debug) {
      console.log(`[NextSDK] ${message}`, data || '');
    }
  }
}

// 导出SDK类
export { NextSDK };

// 创建全局实例
const nextSDK = new NextSDK();

// 挂载到全局对象
(window as any).__nextSDK = nextSDK;

export default nextSDK;
