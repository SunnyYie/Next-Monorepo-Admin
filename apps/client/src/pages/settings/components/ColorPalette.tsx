import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ThemeConfig {
  [key: string]: string;
}

interface ColorPaletteProps {
  theme: ThemeConfig;
}

const colorGroups = [
  {
    name: '主要颜色',
    colors: [
      { key: 'primary', label: '主色', defaultValue: '#3b82f6' },
      { key: 'secondary', label: '辅助色', defaultValue: '#64748b' },
      { key: 'accent', label: '强调色', defaultValue: '#8b5cf6' },
      { key: 'neutral', label: '中性色', defaultValue: '#1f2937' },
    ],
  },
  {
    name: '背景颜色',
    colors: [
      { key: 'base-100', label: '主背景', defaultValue: '#ffffff' },
      { key: 'base-200', label: '次背景', defaultValue: '#f8fafc' },
      { key: 'base-300', label: '三级背景', defaultValue: '#e2e8f0' },
    ],
  },
  {
    name: '状态颜色',
    colors: [
      { key: 'info', label: '信息', defaultValue: '#0ea5e9' },
      { key: 'success', label: '成功', defaultValue: '#22c55e' },
      { key: 'warning', label: '警告', defaultValue: '#f59e0b' },
      { key: 'error', label: '错误', defaultValue: '#ef4444' },
    ],
  },
];

// 辅助函数：将十六进制颜色转换为 RGB
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

// 辅助函数：计算颜色的明度
const getLuminance = (hex: string) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const { r, g, b } = rgb;
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

// 辅助函数：判断是否应该使用深色文字
const shouldUseDarkText = (backgroundColor: string) => {
  const luminance = getLuminance(backgroundColor);
  return luminance > 0.5;
};

export const ColorPalette: React.FC<ColorPaletteProps> = ({ theme }) => {
  const getColorValue = (key: string, defaultValue: string) => {
    return theme[key] || defaultValue;
  };

  return (
    <div className="space-y-6">
      {colorGroups.map((group) => (
        <div key={group.name} className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-foreground">
              {group.name}
            </h4>
            <Separator className="mt-1" />
          </div>

          <div className="grid grid-cols-1 gap-3">
            {group.colors.map((color) => {
              const colorValue = getColorValue(color.key, color.defaultValue);
              const isDark = shouldUseDarkText(colorValue);

              return (
                <Card
                  key={color.key}
                  className="overflow-hidden border-0 shadow-sm"
                >
                  <div
                    className="h-16 flex items-center justify-between px-4"
                    style={{
                      backgroundColor: colorValue,
                      color: isDark ? '#000000' : '#ffffff',
                    }}
                  >
                    <div>
                      <p className="font-medium text-sm">{color.label}</p>
                      <p className="text-xs opacity-80">{color.key}</p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`text-xs font-mono ${
                        isDark
                          ? 'bg-black/10 text-black'
                          : 'bg-white/20 text-white'
                      }`}
                    >
                      {colorValue.toUpperCase()}
                    </Badge>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ))}

      {/* 颜色对比度展示 */}
      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-foreground">颜色搭配预览</h4>
          <Separator className="mt-1" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* 主色与背景的搭配 */}
          <Card className="overflow-hidden">
            <div
              className="p-4 space-y-2"
              style={{
                backgroundColor: getColorValue('base-100', '#ffffff'),
                color: getColorValue('primary', '#3b82f6'),
              }}
            >
              <p className="font-medium text-sm">主色与背景</p>
              <div
                className="px-3 py-1 rounded text-xs"
                style={{
                  backgroundColor: getColorValue('primary', '#3b82f6'),
                  color: shouldUseDarkText(getColorValue('primary', '#3b82f6'))
                    ? '#000000'
                    : '#ffffff',
                }}
              >
                主要按钮
              </div>
            </div>
          </Card>

          {/* 辅助色与背景的搭配 */}
          <Card className="overflow-hidden">
            <div
              className="p-4 space-y-2"
              style={{
                backgroundColor: getColorValue('base-200', '#f8fafc'),
                color: getColorValue('secondary', '#64748b'),
              }}
            >
              <p className="font-medium text-sm">辅助色与背景</p>
              <div
                className="px-3 py-1 rounded text-xs"
                style={{
                  backgroundColor: getColorValue('secondary', '#64748b'),
                  color: shouldUseDarkText(
                    getColorValue('secondary', '#64748b')
                  )
                    ? '#000000'
                    : '#ffffff',
                }}
              >
                次要按钮
              </div>
            </div>
          </Card>

          {/* 状态色展示 */}
          <Card className="overflow-hidden col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">状态色应用</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'success', label: '成功状态' },
                  { key: 'warning', label: '警告状态' },
                  { key: 'error', label: '错误状态' },
                  { key: 'info', label: '信息状态' },
                ].map((status) => {
                  const statusColor = getColorValue(
                    status.key,
                    colorGroups[2].colors.find((c) => c.key === status.key)
                      ?.defaultValue || '#000000'
                  );
                  return (
                    <div
                      key={status.key}
                      className="px-3 py-2 rounded text-xs text-center font-medium"
                      style={{
                        backgroundColor: statusColor,
                        color: shouldUseDarkText(statusColor)
                          ? '#000000'
                          : '#ffffff',
                      }}
                    >
                      {status.label}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
