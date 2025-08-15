import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from './login-form';
import { DataTable } from './data-table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export interface JobData {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  experience: string;
  education: string;
  publishDate: string;
  description: string;
}

export interface LoginState {
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
}

const apps = [
  { id: 'zhipin', name: 'BOSS直聘', description: '获取BOSS直聘的招聘数据' },
  { id: 'lagou', name: '拉勾网', description: '获取拉勾网的招聘数据' },
  { id: 'liepin', name: '猎聘网', description: '获取猎聘网的招聘数据' },
  { id: '51job', name: '前程无忧', description: '获取前程无忧的招聘数据' },
];

export function RecruitmentDashboard() {
  const [loginStates, setLoginStates] = useState<Record<string, LoginState>>(
    {}
  );
  const [jobData, setJobData] = useState<Record<string, JobData[]>>({});
  const [activeTab, setActiveTab] = useState('zhipin');

  const handleLogin = async (
    appId: string,
    username: string,
    password: string
  ) => {
    setLoginStates((prev) => ({
      ...prev,
      [appId]: { isLoggedIn: false, isLoading: true, error: null },
    }));

    try {
      // 模拟登录API调用
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 模拟登录成功/失败
      const isSuccess = Math.random() > 0.3; // 70% 成功率

      if (isSuccess) {
        setLoginStates((prev) => ({
          ...prev,
          [appId]: { isLoggedIn: true, isLoading: false, error: null },
        }));

        // 登录成功后自动获取数据
        await fetchJobData(appId);
      } else {
        throw new Error('用户名或密码错误');
      }
    } catch (error) {
      setLoginStates((prev) => ({
        ...prev,
        [appId]: {
          isLoggedIn: false,
          isLoading: false,
          error: error instanceof Error ? error.message : '登录失败',
        },
      }));
    }
  };

  const fetchJobData = async (appId: string) => {
    try {
      // 模拟数据获取
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // 生成模拟数据
      const mockData: JobData[] = Array.from({ length: 50 }, (_, i) => ({
        id: `${appId}-${i + 1}`,
        title: `${['前端工程师', '后端工程师', '全栈工程师', '产品经理', 'UI设计师'][i % 5]}`,
        company: `${['腾讯', '阿里巴巴', '字节跳动', '美团', '滴滴'][i % 5]}科技有限公司`,
        location: `${['北京', '上海', '深圳', '杭州', '广州'][i % 5]}`,
        salary: `${15 + (i % 20)}K-${25 + (i % 30)}K`,
        experience: `${1 + (i % 5)}-${3 + (i % 5)}年`,
        education: ['本科', '硕士', '不限'][i % 3],
        publishDate: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        )
          .toISOString()
          .split('T')[0],
        description: `负责${['Web前端', '服务端', '移动端', '数据分析', '用户体验'][i % 5]}相关工作，要求熟练掌握相关技术栈...`,
      }));

      setJobData((prev) => ({
        ...prev,
        [appId]: mockData,
      }));
    } catch (error) {
      console.error('获取数据失败:', error);
    }
  };

  const handleLogout = (appId: string) => {
    setLoginStates((prev) => ({
      ...prev,
      [appId]: { isLoggedIn: false, isLoading: false, error: null },
    }));
    setJobData((prev) => {
      const newData = { ...prev };
      delete newData[appId];
      return newData;
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {apps.map((app) => (
            <TabsTrigger key={app.id} value={app.id} className="text-sm">
              {app.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {apps.map((app) => (
          <TabsContent key={app.id} value={app.id} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{app.name}</CardTitle>
                <CardDescription>{app.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {!loginStates[app.id]?.isLoggedIn ? (
                  <LoginForm
                    appId={app.id}
                    appName={app.name}
                    onLogin={handleLogin}
                    loginState={loginStates[app.id]}
                  />
                ) : (
                  <DataTable
                    data={jobData[app.id] || []}
                    appName={app.name}
                    onLogout={() => handleLogout(app.id)}
                    isLoading={!jobData[app.id]}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
