import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Heart,
  MessageCircle,
  Share2,
  ShoppingCart,
  User,
  Plus,
  CheckCircle,
  AlertCircle,
  Info,
  X,
} from 'lucide-react';
export const ComponentPreview: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* 按钮组件预览 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">按钮组件</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              按钮变体
            </h4>
            <div className="flex flex-wrap gap-2">
              <Button variant="default">默认按钮</Button>
              <Button variant="secondary">次要按钮</Button>
              <Button variant="outline">边框按钮</Button>
              <Button variant="ghost">幽灵按钮</Button>
              <Button variant="destructive">危险按钮</Button>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              按钮尺寸
            </h4>
            <div className="flex flex-wrap gap-2 items-center">
              <Button size="sm">小按钮</Button>
              <Button size="default">默认</Button>
              <Button size="lg">大按钮</Button>
              <Button size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* 卡片组件预览 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">卡片组件</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>用户信息</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">张三</p>
                  <p className="text-xs text-muted-foreground">
                    zhangsan@example.com
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>统计数据</span>
                <Badge variant="secondary">新</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">总用户数</span>
                  <span className="font-medium">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">活跃用户</span>
                  <span className="font-medium">987</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">增长率</span>
                  <span className="font-medium text-green-600">+12%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      {/* 表单组件预览 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">表单组件</h3>
        <Card>
          <CardHeader>
            <CardTitle>用户设置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">姓名</Label>
                <Input id="name" placeholder="请输入姓名" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input id="email" type="email" placeholder="请输入邮箱" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">角色</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="选择角色" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">管理员</SelectItem>
                  <SelectItem value="user">普通用户</SelectItem>
                  <SelectItem value="guest">访客</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline">取消</Button>
              <Button>保存</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* 标签和状态组件 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">标签和状态</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              徽章标签
            </h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">默认</Badge>
              <Badge variant="secondary">次要</Badge>
              <Badge variant="outline">边框</Badge>
              <Badge variant="destructive">危险</Badge>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              状态指示
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">操作成功</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">警告信息</span>
              </div>
              <div className="flex items-center space-x-2">
                <X className="h-4 w-4 text-red-500" />
                <span className="text-sm">操作失败</span>
              </div>
              <div className="flex items-center space-x-2">
                <Info className="h-4 w-4 text-blue-500" />
                <span className="text-sm">提示信息</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* 选项卡组件 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">选项卡组件</h3>
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">概览</TabsTrigger>
                <TabsTrigger value="analytics">分析</TabsTrigger>
                <TabsTrigger value="reports">报告</TabsTrigger>
                <TabsTrigger value="notifications">通知</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="text-center py-8">
                  <h4 className="text-lg font-medium">概览页面</h4>
                  <p className="text-muted-foreground">这里显示系统概览信息</p>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <div className="text-center py-8">
                  <h4 className="text-lg font-medium">分析页面</h4>
                  <p className="text-muted-foreground">这里显示数据分析结果</p>
                </div>
              </TabsContent>

              <TabsContent value="reports" className="space-y-4">
                <div className="text-center py-8">
                  <h4 className="text-lg font-medium">报告页面</h4>
                  <p className="text-muted-foreground">这里显示各类报告</p>
                </div>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-4">
                <div className="text-center py-8">
                  <h4 className="text-lg font-medium">通知页面</h4>
                  <p className="text-muted-foreground">这里显示系统通知</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* 交互元素 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">交互元素</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5" />
                <span>社交互动</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4 mr-2" />
                  点赞
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  评论
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  分享
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>购物操作</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  加入购物车
                </Button>
                <Button variant="outline" className="w-full">
                  立即购买
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
