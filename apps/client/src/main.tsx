import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as NextSDK from '@next-admin/tracking-sdk';
import { createRoot } from 'react-dom/client';
import { StrictMode, Suspense } from 'react';
import App from './App.tsx';
import './index.css';

// 初始化SDK，类似Sentry的方式
NextSDK.init({
  apiUrl: 'http://localhost:3001/api', // 指向后端API
  userId: 'user_123', // 这里应该从用户状态获取
  userName: 'Demo User', // 这里应该从用户状态获取
  appName: 'Next Admin Client',
  version: '1.0.0',
  debug: true, // 开发环境开启调试
  autoTrack: {
    pageView: false,
    clicks: false,
    errors: false,
    apiRequests: false,
    pageLeave: false,
  },
  batchSize: 5, // 开发环境使用较小的批量大小便于测试
  batchInterval: 10000, // 10秒间隔
  maxRetries: 3,
  retryDelay: 1000,
  enableLocalStorage: true,
  enableSessionStorage: true,
  customHeaders: {
    'X-App-Version': '1.0.0',
    'X-Client-Type': 'web',
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={new QueryClient()}>
      <Suspense>
        <App />
      </Suspense>
    </QueryClientProvider>
  </StrictMode>
);
