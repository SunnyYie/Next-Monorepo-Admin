import { AuthTabs } from './components/auth-tabs';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            欢迎使用我们的服务
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            请登录您的账户或创建新账户
          </p>
        </div>
        <AuthTabs />
      </div>
    </div>
  );
}
