import { useTracking, TrackingButton, TrackingLink } from '@next-admin/tracking-sdk';
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function TrackingDemo() {
  const tracking = useTracking();

  useEffect(() => {
    // 手动追踪页面访问
    tracking.trackPageView('/tracking-demo', 'Tracking Demo Page');
  }, [tracking]);

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // 手动追踪点击事件
    tracking.trackClick(event.currentTarget, {
      section: 'demo',
      action: 'button_click',
      label: 'demo_button',
    });
  };

  const handleCustomEvent = () => {
    // 追踪自定义事件
    tracking.trackCustomEvent('demo_action', {
      action: 'custom_event_triggered',
      timestamp: Date.now(),
      userAction: 'manual_trigger',
    });
  };

  const handleApiTest = async () => {
    try {
      // 这个请求会被自动追踪
      const response = await fetch('http://localhost:3001/api/user-events/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // 追踪成功事件
      tracking.trackCustomEvent('api_success', {
        endpoint: '/api/user-events/stats',
        responseTime: Date.now(),
        dataCount: data?.summary?.totalEvents || 0,
      });
    } catch (error) {
      // 错误会被自动追踪，但也可以手动添加更多信息
      tracking.trackCustomEvent('api_error', {
        endpoint: '/api/user-events/stats',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const handleErrorTest = () => {
    try {
      // 故意抛出错误来测试错误追踪
      throw new Error('这是一个测试错误');
    } catch (error) {
      // 手动追踪错误
      tracking.trackError(error as Error);
    }
  };

  const handleUpdateUser = () => {
    // 更新用户信息
    tracking.setUserId('updated_user_456');
    tracking.setUserName('Updated User');

    tracking.trackCustomEvent('user_updated', {
      newUserId: 'updated_user_456',
      newUserName: 'Updated User',
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>埋点SDK测试页面</CardTitle>
          <CardDescription>
            测试用户行为追踪和错误监控功能
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* 普通按钮测试 */}
            <Button onClick={handleButtonClick} variant="default">
              手动追踪点击
            </Button>

            {/* 使用SDK提供的追踪按钮 */}
            <TrackingButton
              trackingData={{
                section: 'demo',
                type: 'tracking_button'
              }}
              trackingEventName="tracking_button_click"
              className="px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md"
            >
              自动追踪按钮
            </TrackingButton>

            {/* 自定义事件测试 */}
            <Button onClick={handleCustomEvent} variant="outline">
              触发自定义事件
            </Button>

            {/* API请求测试 */}
            <Button onClick={handleApiTest} variant="outline">
              测试API请求追踪
            </Button>

            {/* 错误测试 */}
            <Button onClick={handleErrorTest} variant="destructive">
              测试错误追踪
            </Button>

            {/* 用户更新测试 */}
            <Button onClick={handleUpdateUser} variant="ghost">
              更新用户信息
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">追踪链接测试</h3>
            <div className="flex gap-4">
              <TrackingLink
                href="/dashboard"
                trackingData={{
                  section: 'demo',
                  target: 'dashboard',
                  linkType: 'internal'
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                内部链接
              </TrackingLink>

              <TrackingLink
                href="https://example.com"
                target="_blank"
                trackingData={{
                  section: 'demo',
                  target: 'external',
                  linkType: 'external'
                }}
                className="text-green-600 hover:text-green-800"
              >
                外部链接
              </TrackingLink>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">当前会话信息</h3>
            <p className="text-sm text-gray-600">
              Session ID: {tracking.getSessionId()}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              所有的页面访问、点击、API请求和错误都会被自动追踪并发送到后端。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

