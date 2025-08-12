import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Page403 = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg
              className="h-8 w-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m0 0v2m0-2h2m-2 0H9.5"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">403</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">访问被拒绝</h2>
        <p className="text-gray-600 mb-6">很抱歉，您没有权限访问此页面。</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={handleGoBack} variant="outline">
            返回上页
          </Button>
          <Button onClick={handleGoHome} variant="default">
            返回首页
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Page403;
