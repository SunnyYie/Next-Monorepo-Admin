export * from './sdk';
export * from './types';
export * from './react';

// 导出SDK类，供需要创建新实例的场景使用
export { NextSDK } from './sdk';

// 导出默认实例，类似Sentry的使用方式
import nextSDK from './sdk';

// 导出全局方法
export const init = nextSDK.init.bind(nextSDK);
export const track = nextSDK.track.bind(nextSDK);
export const trackPageView = nextSDK.trackPageView.bind(nextSDK);
export const trackClick = nextSDK.trackClick.bind(nextSDK);
export const trackError = nextSDK.trackError.bind(nextSDK);
export const trackApiRequest = nextSDK.trackApiRequest.bind(nextSDK);
export const trackCustomEvent = nextSDK.trackCustomEvent.bind(nextSDK);
export const setUserId = nextSDK.setUserId.bind(nextSDK);
export const setUserName = nextSDK.setUserName.bind(nextSDK);
export const getSessionId = nextSDK.getSessionId.bind(nextSDK);
export const destroy = nextSDK.destroy.bind(nextSDK);

// 导出默认实例
export default nextSDK;
