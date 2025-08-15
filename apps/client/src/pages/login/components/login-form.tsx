import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';
import userService from '@/api/services/auth';
import { useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { useUserActions } from '@/store/user-store';
import { LoginFormData, loginSchema, phoneRegex } from '../config';

export function LoginForm() {
  const { setUserToken, setUserInfo } = useUserActions();
  const navigate = useNavigate();

  const signInMutation = useMutation({
    mutationFn: userService.signin,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // 判断输入的是手机号还是邮箱
  const accountValue = watch('account');
  const isPhone = accountValue && phoneRegex.test(accountValue);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const res = await signInMutation.mutateAsync({
        email: isPhone ? '' : data.account,
        phone: isPhone ? data.account : '',
        password: data.password,
      });
      const { user, accessToken } = res;

      setUserToken({ accessToken });
      setUserInfo(user);
      navigate('/dashboard/workbench');

      toast.success('登录成功', {
        description: `欢迎回来！使用${isPhone ? '手机号' : '邮箱'}登录成功。`,
      });
    } catch (err) {
      setError('登录失败，请检查您的账号和密码');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="account" className="flex items-center gap-2">
          {isPhone ? (
            <Phone className="h-4 w-4" />
          ) : (
            <Mail className="h-4 w-4" />
          )}
          手机号或邮箱
        </Label>
        <Input
          id="account"
          type="text"
          placeholder="请输入手机号或邮箱"
          {...register('account')}
          className={errors.account ? 'border-red-500' : ''}
        />
        {errors.account && (
          <p className="text-sm text-red-500">{errors.account.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">密码</Label>
        <Input
          id="password"
          type="password"
          placeholder="请输入密码"
          {...register('password')}
          className={errors.password ? 'border-red-500' : ''}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? '登录中...' : '登录'}
      </Button>
    </form>
  );
}
