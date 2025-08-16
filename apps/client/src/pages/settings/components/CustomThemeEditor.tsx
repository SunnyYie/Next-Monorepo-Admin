import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RotateCcw, Copy } from 'lucide-react';
import { AdvancedColorPicker } from './AdvancedColorPicker';

interface ThemeConfig {
  [key: string]: string;
}

interface CustomThemeEditorProps {
  theme: ThemeConfig;
  onChange: (theme: ThemeConfig) => void;
}

const colorCategories = [
  {
    name: '主要颜色',
    colors: [
      { key: 'primary', label: '主色', description: '按钮、链接等主要元素' },
      { key: 'secondary', label: '辅助色', description: '次要按钮、辅助元素' },
      { key: 'accent', label: '强调色', description: '突出显示、高亮元素' },
      { key: 'neutral', label: '中性色', description: '文本、边框等中性元素' },
    ],
  },
  {
    name: '背景颜色',
    colors: [
      { key: 'base-100', label: '主背景', description: '页面主要背景色' },
      { key: 'base-200', label: '次背景', description: '卡片、面板背景色' },
      { key: 'base-300', label: '三级背景', description: '输入框、分割线等' },
    ],
  },
  {
    name: '状态颜色',
    colors: [
      { key: 'info', label: '信息色', description: '信息提示、通知' },
      { key: 'success', label: '成功色', description: '成功状态、确认操作' },
      { key: 'warning', label: '警告色', description: '警告提示、注意事项' },
      { key: 'error', label: '错误色', description: '错误状态、危险操作' },
    ],
  },
];

const defaultTheme: ThemeConfig = {
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
};

export const CustomThemeEditor: React.FC<CustomThemeEditorProps> = ({
  theme,
  onChange,
}) => {
  const handleColorChange = (key: string, value: string) => {
    onChange({
      ...theme,
      [key]: value,
    });
  };

  const resetToDefault = () => {
    onChange(defaultTheme);
  };

  const copyThemeConfig = async () => {
    const config = JSON.stringify(theme, null, 2);
    try {
      await navigator.clipboard.writeText(config);
      // 这里可以添加一个 toast 通知
    } catch (err) {
      console.error('Failed to copy theme config:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">自定义主题</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={copyThemeConfig}>
            <Copy className="h-4 w-4 mr-2" />
            复制配置
          </Button>
          <Button variant="outline" size="sm" onClick={resetToDefault}>
            <RotateCcw className="h-4 w-4 mr-2" />
            重置
          </Button>
        </div>
      </div>

      <div className="space-y-6 max-h-96 overflow-y-auto">
        {colorCategories.map((category) => (
          <div key={category.name} className="space-y-4">
            <div>
              <h4 className="font-medium text-foreground">{category.name}</h4>
              <Separator className="mt-2" />
            </div>

            <div className="space-y-3">
              {category.colors.map((color) => (
                <Card key={color.key} className="p-4">
                  <AdvancedColorPicker
                    value={theme[color.key] || defaultTheme[color.key]}
                    onChange={(value) => handleColorChange(color.key, value)}
                    label={color.label}
                    description={color.description}
                  />
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
