import React, { 
  createContext, 
  useContext, 
  useEffect, 
  ReactNode, 
  Component, 
  ErrorInfo 
} from 'react';
import nextSDK from './sdk';
import { SDKConfig, ErrorInfo as SDKErrorInfo } from './types';

// ============ Context 定义 ============
interface TrackingContextType {
  track: typeof nextSDK.track;
  trackPageView: typeof nextSDK.trackPageView;
  trackClick: typeof nextSDK.trackClick;
  trackError: typeof nextSDK.trackError;
  trackApiRequest: typeof nextSDK.trackApiRequest;
  trackCustomEvent: typeof nextSDK.trackCustomEvent;
  setUserId: typeof nextSDK.setUserId;
  setUserName: typeof nextSDK.setUserName;
  getSessionId: typeof nextSDK.getSessionId;
}

const TrackingContext = createContext<TrackingContextType | null>(null);

// ============ TrackingProvider 组件 ============
interface TrackingProviderProps {
  children: ReactNode;
}

export const TrackingProvider: React.FC<TrackingProviderProps> = ({ children }) => {
  const contextValue: TrackingContextType = {
    track: nextSDK.track.bind(nextSDK),
    trackPageView: nextSDK.trackPageView.bind(nextSDK),
    trackClick: nextSDK.trackClick.bind(nextSDK),
    trackError: nextSDK.trackError.bind(nextSDK),
    trackApiRequest: nextSDK.trackApiRequest.bind(nextSDK),
    trackCustomEvent: nextSDK.trackCustomEvent.bind(nextSDK),
    setUserId: nextSDK.setUserId.bind(nextSDK),
    setUserName: nextSDK.setUserName.bind(nextSDK),
    getSessionId: nextSDK.getSessionId.bind(nextSDK),
  };

  return (
    <TrackingContext.Provider value={contextValue}>
      {children}
    </TrackingContext.Provider>
  );
};

// ============ 错误边界组件 ============
interface TrackingErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface TrackingErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

class TrackingErrorBoundaryClass extends Component<
  TrackingErrorBoundaryProps,
  TrackingErrorBoundaryState
> {
  constructor(props: TrackingErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): TrackingErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 上报错误到埋点系统
    const errorData: SDKErrorInfo = {
      message: error.message,
      stack: error.stack,
      source: 'react',
      componentStack: errorInfo.componentStack || undefined,
    };

    nextSDK.trackError(errorData);

    // 调用用户提供的错误处理函数
    this.props.onError?.(error, errorInfo);

    console.error('TrackingErrorBoundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props;
      
      if (Fallback) {
        return <Fallback error={this.state.error} resetError={this.resetError} />;
      }

      // 默认错误UI
      return (
        <div style={{ 
          padding: '20px', 
          border: '1px solid #ff6b6b', 
          borderRadius: '4px', 
          backgroundColor: '#ffe0e0',
          color: '#d63031'
        }}>
          <h3>发生了错误</h3>
          <p>抱歉，页面遇到了问题。错误信息已记录，我们会尽快修复。</p>
          <button 
            onClick={this.resetError}
            style={{
              padding: '8px 16px',
              backgroundColor: '#d63031',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            重试
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// 导出错误边界组件
export const TrackingErrorBoundary = TrackingErrorBoundaryClass;

// ============ TrackingWrapper 组件 ============
interface TrackingWrapperProps {
  children: ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export const TrackingWrapper: React.FC<TrackingWrapperProps> = ({
  children,
  fallback,
  onError,
}) => {
  return (
    <TrackingProvider>
      <TrackingErrorBoundary fallback={fallback} onError={onError}>
        {children}
      </TrackingErrorBoundary>
    </TrackingProvider>
  );
};

// ============ useTracking Hook ============
export const useTracking = (): TrackingContextType => {
  const context = useContext(TrackingContext);
  if (!context) {
    throw new Error('useTracking must be used within a TrackingProvider');
  }
  return context;
};

// ============ 高阶组件 ============
export function withTracking<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.ComponentType<P> {
  const WithTrackingComponent = (props: P) => {
    const tracking = useTracking();
    
    return <WrappedComponent {...props} tracking={tracking} />;
  };

  WithTrackingComponent.displayName = `withTracking(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithTrackingComponent;
}

// ============ 页面追踪高阶组件 ============
interface TrackPageViewOptions {
  trackOnMount?: boolean;
  trackOnUpdate?: boolean;
  getPageName?: () => string;
  getPageTitle?: () => string;
}

export function withPageTracking<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: TrackPageViewOptions = {}
): React.ComponentType<P> {
  const {
    trackOnMount = true,
    trackOnUpdate = false,
    getPageName = () => window.location.pathname,
    getPageTitle = () => document.title,
  } = options;

  const WithPageTrackingComponent = (props: P) => {
    const tracking = useTracking();

    useEffect(() => {
      if (trackOnMount) {
        const pageName = getPageName();
        const pageTitle = getPageTitle();
        tracking.trackPageView(pageName, pageTitle);
      }
    }, [tracking]);

    useEffect(() => {
      if (trackOnUpdate) {
        const pageName = getPageName();
        const pageTitle = getPageTitle();
        tracking.trackPageView(pageName, pageTitle);
      }
    }, [tracking, props]);

    return <WrappedComponent {...props} />;
  };

  WithPageTrackingComponent.displayName = `withPageTracking(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithPageTrackingComponent;
}

// ============ 点击追踪组件 ============
interface TrackingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  trackingData?: Record<string, any>;
  trackingEventName?: string;
  children: React.ReactNode;
}

export const TrackingButton: React.FC<TrackingButtonProps> = ({
  children,
  trackingData,
  trackingEventName = 'button_click',
  onClick,
  ...props
}) => {
  const tracking = useTracking();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // 追踪点击事件
    tracking.trackClick(event.currentTarget, trackingData);
    
    // 如果提供了自定义事件名，也记录自定义事件
    if (trackingEventName !== 'button_click') {
      tracking.trackCustomEvent(trackingEventName, trackingData);
    }

    // 调用原始点击处理函数
    onClick?.(event);
  };

  return (
    <button {...props} onClick={handleClick}>
      {children}
    </button>
  );
};

// ============ 链接追踪组件 ============
interface TrackingLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  trackingData?: Record<string, any>;
  trackingEventName?: string;
  children: React.ReactNode;
}

export const TrackingLink: React.FC<TrackingLinkProps> = ({
  children,
  trackingData,
  trackingEventName = 'link_click',
  onClick,
  ...props
}) => {
  const tracking = useTracking();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    // 追踪点击事件
    tracking.trackClick(event.currentTarget, trackingData);
    
    // 如果提供了自定义事件名，也记录自定义事件
    if (trackingEventName !== 'link_click') {
      tracking.trackCustomEvent(trackingEventName, trackingData);
    }

    // 调用原始点击处理函数
    onClick?.(event);
  };

  return (
    <a {...props} onClick={handleClick}>
      {children}
    </a>
  );
};
