import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const PageError = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="max-w-2xl w-full p-8">
        <div className="text-center">
          {/* 错误图标 */}
          <div className="mb-6">
            <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>

          {/* 错误标题 */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            页面出现错误
          </h1>

          <p className="text-gray-600 mb-6">
            很抱歉，页面遇到了意外错误。请尝试刷新页面或返回首页。
          </p>

          {/* 错误信息 (仅在开发环境显示) */}
          {isDevelopment && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg text-left">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                错误详情 (仅开发环境显示)
              </h3>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleReload} variant="outline">
              刷新页面
            </Button>
            <Button onClick={handleGoHome} variant="outline">
              返回首页
            </Button>
          </div>

          {/* 错误ID (方便技术支持) */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 mt-1">
              如需技术支持，请提供此错误ID
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PageError;
