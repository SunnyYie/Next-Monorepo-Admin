# NextSDK - 用户行为追踪和错误监控SDK

## 概述

NextSDK 是一个功能完整的前端埋点SDK，支持用户行为追踪、错误监控、性能监控等功能。

## 功能特性

- 🚀 **自动追踪**: 页面访问、点击事件、API请求、错误等
- 📊 **数据收集**: 用户设备信息、会话信息、页面性能等
- 🔄 **批量发送**: 支持事件队列和批量发送，减少网络请求
- 💾 **离线缓存**: 支持本地存储，网络恢复后自动发送
- 🎯 **重试机制**: 发送失败自动重试，确保数据可靠性
- ⚛️ **React集成**: 提供React组件和Hooks，使用简单

## 安装

```bash
npm install @next-admin/tracking-sdk
# 或
yarn add @next-admin/tracking-sdk
# 或
pnpm add @next-admin/tracking-sdk
```

## 基础使用

### 1. 初始化SDK

```javascript
import NextSDK from '@next-admin/tracking-sdk';

NextSDK.init({
  apiUrl: 'https://your-api.com/api',
  userId: 'user123',
  userName: 'John Doe',
  debug: true,
  autoTrack: {
    pageView: true,
    clicks: true,
    errors: true,
    apiRequests: true,
    pageLeave: true,
  },
  batchSize: 10,
  batchInterval: 30000,
});
```

### 2. 手动追踪事件

```javascript
// 追踪页面访问
NextSDK.trackPageView('/dashboard', 'Dashboard');

// 追踪点击事件
document.getElementById('button').addEventListener('click', (event) => {
  NextSDK.trackClick(event.target, { section: 'header' });
});

// 追踪自定义事件
NextSDK.trackCustomEvent('video_play', {
  videoId: 'video123',
  duration: 120,
  position: 30,
});

// 追踪API请求
NextSDK.trackApiRequest('/api/users', 'GET', 250, 200);

// 追踪错误
try {
  // some code
} catch (error) {
  NextSDK.trackError(error);
}
```

## React集成

### 1. 使用TrackingProvider

```jsx
import React from 'react';
import {
  TrackingProvider,
  TrackingErrorBoundary,
} from '@next-admin/tracking-sdk';

function App() {
  const config = {
    apiUrl: 'https://your-api.com/api',
    userId: 'user123',
    userName: 'John Doe',
    debug: true,
  };

  return (
    <TrackingProvider config={config}>
      <TrackingErrorBoundary>
        <div className="App">
          <h1>My App</h1>
          {/* 你的应用内容 */}
        </div>
      </TrackingErrorBoundary>
    </TrackingProvider>
  );
}

export default App;
```

### 2. 使用Hooks

```jsx
import React from 'react';
import {
  useTracking,
  usePageTracking,
  useClickTracking,
} from '@next-admin/tracking-sdk';

function Dashboard() {
  const { trackCustomEvent } = useTracking();
  const trackClick = useClickTracking();

  // 自动追踪页面访问
  usePageTracking('/dashboard', 'Dashboard');

  const handleButtonClick = (event) => {
    trackClick(event.target, { action: 'export_data' });
  };

  const handleVideoPlay = () => {
    trackCustomEvent('video_play', { videoId: 'intro-video' });
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleButtonClick}>Export Data</button>
      <button onClick={handleVideoPlay}>Play Video</button>
    </div>
  );
}
```

## 配置选项

```typescript
interface SDKConfig {
  apiUrl: string; // API服务器地址
  userId: string; // 用户ID
  userName: string; // 用户名
  appName?: string; // 应用名称
  version?: string; // 应用版本
  debug?: boolean; // 调试模式

  // 自动追踪配置
  autoTrack?: {
    pageView?: boolean; // 自动追踪页面访问
    clicks?: boolean; // 自动追踪点击事件
    errors?: boolean; // 自动追踪错误
    apiRequests?: boolean; // 自动追踪API请求
    pageLeave?: boolean; // 自动追踪页面离开
  };

  // 批量发送配置
  batchSize?: number; // 批量大小，默认10
  batchInterval?: number; // 批量间隔，默认30秒
  maxRetries?: number; // 最大重试次数，默认3
  retryDelay?: number; // 重试延迟，默认1秒

  // 存储配置
  enableLocalStorage?: boolean; // 启用本地存储
  enableSessionStorage?: boolean; // 启用会话存储

  // 自定义请求头
  customHeaders?: Record<string, string>;
}
```

## API参考

### NextSDK实例方法

- `init(config: SDKConfig)`: 初始化SDK
- `track(eventData: Partial<BaseEventData>)`: 追踪通用事件
- `trackPageView(pagePath: string, pageTitle?: string)`: 追踪页面访问
- `trackClick(element: HTMLElement, customData?: Record<string, any>)`: 追踪点击事件
- `trackError(error: Error | ErrorInfo)`: 追踪错误
- `trackApiRequest(url: string, method: string, duration?: number, statusCode?: number)`: 追踪API请求
- `trackCustomEvent(eventType: string, data?: Record<string, any>)`: 追踪自定义事件
- `setUserId(userId: string)`: 设置用户ID
- `setUserName(userName: string)`: 设置用户名
- `getSessionId(): string`: 获取会话ID
- `flush(): Promise<void>`: 立即发送所有队列中的事件
- `destroy()`: 销毁SDK实例

### React组件和Hooks

- `<TrackingProvider>`: 追踪上下文提供者
- `<TrackingErrorBoundary>`: 错误边界组件，自动追踪React错误
- `useTracking()`: 获取追踪方法的Hook
- `usePageTracking(pagePath?, pageTitle?)`: 自动追踪页面访问的Hook
- `useClickTracking()`: 获取点击追踪方法的Hook
- `useErrorTracking()`: 获取错误追踪方法的Hook

## 事件类型

SDK支持以下事件类型：

- `PAGE_VIEW`: 页面访问
- `PAGE_LEAVE`: 页面离开
- `BUTTON_CLICK`: 按钮点击
- `LINK_CLICK`: 链接点击
- `FORM_SUBMIT`: 表单提交
- `INPUT_FOCUS`: 输入框获得焦点
- `INPUT_BLUR`: 输入框失去焦点
- `API_REQUEST`: API请求
- `ERROR`: 错误
- `SCROLL`: 滚动
- `RESIZE`: 窗口大小变化
- `CUSTOM`: 自定义事件

## 数据收集

SDK会自动收集以下信息：

### 设备信息

- 用户代理字符串
- 操作系统平台
- 浏览器名称和版本
- 屏幕分辨率
- 语言设置
- 时区

### 会话信息

- 会话ID
- 会话开始时间
- 最后活跃时间
- 页面访问次数
- 事件总数

### 页面信息

- 页面路径
- 页面标题
- 停留时间
- 来源页面

## 错误监控

SDK会自动监控以下类型的错误：

1. **JavaScript运行时错误**: 未捕获的JavaScript异常
2. **Promise拒绝错误**: 未处理的Promise拒绝
3. **资源加载错误**: 图片、脚本等资源加载失败
4. **React组件错误**: 使用ErrorBoundary捕获的React组件错误

## 性能监控

SDK可以收集页面性能指标：

- 页面加载时间
- DOM准备时间
- 首次绘制时间
- 首次内容绘制时间
- 最大内容绘制时间
- 首次输入延迟
- 累积布局偏移分数

## 数据隐私

SDK遵循数据隐私最佳实践：

- 不会自动收集用户个人身份信息
- 支持用户自定义数据过滤
- 提供数据脱敏选项
- 支持用户选择退出追踪

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- IE 11+

## 许可证

MIT
