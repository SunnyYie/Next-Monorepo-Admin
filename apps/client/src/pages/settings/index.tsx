import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Download,
  Upload,
  Palette,
  Settings as SettingsIcon,
} from 'lucide-react';
import { ThemeSelector } from './components/ThemeSelector';
import { CustomThemeEditor } from './components/CustomThemeEditor';
import { ComponentPreview } from './components/ComponentPreview';
import { ColorPalette } from './components/ColorPalette';
import { useTheme } from 'next-themes';

interface ThemeConfig {
  [key: string]: string;
}

const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [customTheme, setCustomTheme] = useState<ThemeConfig>({
    primary: '#3b82f6',
    secondary: '#64748b',
    accent: '#8b5cf6',
    neutral: '#1f2937',
    'base-100': '#ffffff',
    'base-200': '#f8fafc',
    'base-300': '#e2e8f0',
    info: '#0ea5e9',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
  });

  const [activeTheme, setActiveTheme] = useState('light');

  // 应用自定义主题到 CSS 变量
  const applyCustomTheme = (themeConfig: ThemeConfig) => {
    const root = document.documentElement;
    Object.entries(themeConfig).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  };

  // 导出主题配置
  const exportTheme = () => {
    const themeData = {
      name: 'custom-theme',
      config: customTheme,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(themeData, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'theme-config.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 导入主题配置
  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const themeData = JSON.parse(e.target?.result as string);
        if (themeData.config) {
          setCustomTheme(themeData.config);
          applyCustomTheme(themeData.config);
        }
      } catch (error) {
        console.error('Failed to import theme:', error);
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    if (activeTheme === 'custom') {
      applyCustomTheme(customTheme);
    }
  }, [customTheme, activeTheme]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <SettingsIcon className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">主题配置器</h1>
            <p className="text-muted-foreground">自定义你的应用主题和外观</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={exportTheme}>
            <Download className="h-4 w-4 mr-2" />
            导出主题
          </Button>
          <label htmlFor="import-theme">
            <Button variant="outline" asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                导入主题
              </span>
            </Button>
          </label>
          <input
            id="import-theme"
            type="file"
            accept=".json"
            className="hidden"
            onChange={importTheme}
          />
        </div>
      </div>

      <Separator />

      {/* 主要内容区域 */}
      <div className="grid grid-cols-12 gap-6">
        {/* 左侧配置面板 */}
        <div className="col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>主题设置</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTheme}
                onValueChange={setActiveTheme}
                className="space-y-4"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="preset">预设主题</TabsTrigger>
                  <TabsTrigger value="custom">自定义</TabsTrigger>
                </TabsList>

                <TabsContent value="preset" className="space-y-4">
                  <ThemeSelector
                    currentTheme={theme || 'light'}
                    onThemeChange={setTheme}
                  />
                </TabsContent>

                <TabsContent value="custom" className="space-y-4">
                  <CustomThemeEditor
                    theme={customTheme}
                    onChange={setCustomTheme}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* 颜色调色板 */}
          <Card>
            <CardHeader>
              <CardTitle>颜色调色板</CardTitle>
            </CardHeader>
            <CardContent>
              <ColorPalette
                theme={activeTheme === 'custom' ? customTheme : {}}
              />
            </CardContent>
          </Card>
        </div>

        {/* 右侧预览区域 */}
        <div className="col-span-8">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>组件预览</CardTitle>
                <Badge variant="secondary">
                  当前主题: {activeTheme === 'custom' ? '自定义' : theme}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="h-[calc(100vh-300px)] overflow-auto">
              <ComponentPreview />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
