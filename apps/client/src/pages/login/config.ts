import * as z from 'zod';

// 验证手机号的正则表达式
export const phoneRegex = /^1[3-9]\d{9}$/;

// 登录表单验证schema
export const loginSchema = z.object({
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

export type LoginFormData = z.infer<typeof loginSchema>;

// 注册表单验证schema
export const registerSchema = z
  .object({
    phone: z
      .string()
      .min(11, '手机号至少11位')
      .max(11, '手机号不能超过11位')
      .regex(phoneRegex, '请输入有效的手机号'),
    email: z
      .string()
      .min(1, '请输入邮箱')
      .refine((value) => {
        const isEmail = z.email().safeParse(value).success;
        return isEmail;
      }, '请输入邮箱地址'),
    password: z.string().min(6, '密码至少6位').max(50, '密码不能超过50位'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
