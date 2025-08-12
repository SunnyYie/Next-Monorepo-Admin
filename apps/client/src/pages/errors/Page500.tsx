import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Page500 = () => {
  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="max-w-md w-full p-8 text-center">
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
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">500</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">服务器错误</h2>
        <p className="text-gray-600 mb-6">
          很抱歉，服务器遇到了内部错误，请稍后再试。
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={handleReload} variant="outline">
            重新加载
          </Button>
          <Button onClick={handleGoHome} variant="default">
            返回首页
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Page500;
