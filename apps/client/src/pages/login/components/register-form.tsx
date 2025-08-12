'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Phone, User } from 'lucide-react';
import { toast } from 'sonner';

// 验证手机号的正则表达式
const phoneRegex = /^1[3-9]\d{9}$/;

// 注册表单验证schema
const registerSchema = z
  .object({
    username: z
      .string()
      .min(2, '用户名至少2位')
      .max(20, '用户名不能超过20位')
      .regex(
        /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
        '用户名只能包含字母、数字、下划线和中文'
      ),
    account: z
      .string()
      .min(1, '请输入手机号或邮箱')
      .refine((value) => {
        // 检查是否为有效的邮箱或手机号
        const isEmail = z.string().email().safeParse(value).success;
        const isPhone = phoneRegex.test(value);
        return isEmail || isPhone;
      }, '请输入有效的手机号或邮箱地址'),
    password: z
      .string()
      .min(6, '密码至少6位')
      .max(50, '密码不能超过50位')
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, '密码必须包含字母和数字'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // 判断输入的是手机号还是邮箱
  const accountValue = watch('account');
  const isPhone = accountValue && phoneRegex.test(accountValue);

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError('');

    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 这里应该调用实际的注册API
      console.log('注册数据:', {
        username: data.username,
        account: data.account,
        password: data.password,
        accountType: isPhone ? 'phone' : 'email',
      });

      toast.success('注册成功', {
        description: `账户创建成功！使用${isPhone ? '手机号' : '邮箱'}注册完成。`,
      });
    } catch (err) {
      setError('注册失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          用户名
        </Label>
        <Input
          id="username"
          type="text"
          placeholder="请输入用户名"
          {...register('username')}
          className={errors.username ? 'border-red-500' : ''}
        />
        {errors.username && (
          <p className="text-sm text-red-500">{errors.username.message}</p>
        )}
      </div>

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
          placeholder="请输入密码（包含字母和数字）"
          {...register('password')}
          className={errors.password ? 'border-red-500' : ''}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">确认密码</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="请再次输入密码"
          {...register('confirmPassword')}
          className={errors.confirmPassword ? 'border-red-500' : ''}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? '注册中...' : '创建账户'}
      </Button>
    </form>
  );
}
