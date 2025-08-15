import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import type { LoginState } from './recruitment-dashboard';

interface LoginFormProps {
  appId: string;
  appName: string;
  onLogin: (appId: string, username: string, password: string) => void;
  loginState?: LoginState;
}

export function LoginForm({
  appId,
  appName,
  onLogin,
  loginState,
}: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      onLogin(appId, username, password);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold">登录 {appName}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          请输入您的账号和密码以获取招聘数据
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`username-${appId}`}>用户名</Label>
          <Input
            id={`username-${appId}`}
            type="text"
            placeholder="请输入用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loginState?.isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`password-${appId}`}>密码</Label>
          <Input
            id={`password-${appId}`}
            type="password"
            placeholder="请输入密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loginState?.isLoading}
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loginState?.isLoading || !username || !password}
        >
          {loginState?.isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              登录中...
            </>
          ) : (
            '登录'
          )}
        </Button>
      </form>

      {loginState?.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{loginState.error}</AlertDescription>
        </Alert>
      )}

      {loginState?.isLoggedIn && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>登录成功！正在获取招聘数据...</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
