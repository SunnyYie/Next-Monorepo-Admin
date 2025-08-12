import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';

// 验证手机号的正则表达式
const phoneRegex = /^1[3-9]\d{9}$/;

// 登录表单验证schema
const loginSchema = z.object({
  account: z
    .string()
    .min(1, '请输入手机号或邮箱')
    .refine((value) => {
      // 检查是否为有效的邮箱或手机号
      const isEmail = z.string().email().safeParse(value).success;
      const isPhone = phoneRegex.test(value);
      return isEmail || isPhone;
    }, '请输入有效的手机号或邮箱地址'),
  password: z.string().min(6, '密码至少6位').max(50, '密码不能超过50位'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
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
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 这里应该调用实际的登录API
      console.log('登录数据:', data);

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
