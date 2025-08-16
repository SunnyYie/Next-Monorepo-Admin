import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

const presetThemes = [
  {
    name: 'light',
    displayName: '浅色',
    preview: {
      primary: '#3b82f6',
      secondary: '#64748b',
      background: '#ffffff',
      foreground: '#0f172a',
    },
  },
  {
    name: 'dark',
    displayName: '深色',
    preview: {
      primary: '#3b82f6',
      secondary: '#64748b',
      background: '#0f172a',
      foreground: '#f8fafc',
    },
  },
  {
    name: 'cupcake',
    displayName: '纸杯蛋糕',
    preview: {
      primary: '#65c3c8',
      secondary: '#ef9fbc',
      background: '#faf7f5',
      foreground: '#291334',
    },
  },
  {
    name: 'bumblebee',
    displayName: '大黄蜂',
    preview: {
      primary: '#e11d48',
      secondary: '#f59e0b',
      background: '#fffbeb',
      foreground: '#1c1917',
    },
  },
  {
    name: 'emerald',
    displayName: '翡翠',
    preview: {
      primary: '#059669',
      secondary: '#1f2937',
      background: '#ecfdf5',
      foreground: '#064e3b',
    },
  },
  {
    name: 'corporate',
    displayName: '商务',
    preview: {
      primary: '#4f46e5',
      secondary: '#7c3aed',
      background: '#f8fafc',
      foreground: '#1e293b',
    },
  },
  {
    name: 'synthwave',
    displayName: '合成波',
    preview: {
      primary: '#e11d48',
      secondary: '#1e40af',
      background: '#190b28',
      foreground: '#f472b6',
    },
  },
  {
    name: 'retro',
    displayName: '复古',
    preview: {
      primary: '#ef4444',
      secondary: '#a3a3a3',
      background: '#ede8dc',
      foreground: '#282425',
    },
  },
  {
    name: 'cyberpunk',
    displayName: '赛博朋克',
    preview: {
      primary: '#ff7598',
      secondary: '#75d1f0',
      background: '#ffee00',
      foreground: '#1a103d',
    },
  },
  {
    name: 'valentine',
    displayName: '情人节',
    preview: {
      primary: '#e11d48',
      secondary: '#be185d',
      background: '#fdf2f8',
      foreground: '#831843',
    },
  },
  {
    name: 'halloween',
    displayName: '万圣节',
    preview: {
      primary: '#f97316',
      secondary: '#1f2937',
      background: '#1a1625',
      foreground: '#f8fafc',
    },
  },
  {
    name: 'garden',
    displayName: '花园',
    preview: {
      primary: '#5eead4',
      secondary: '#9ca3af',
      background: '#e7f5e8',
      foreground: '#1f2937',
    },
  },
];

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onThemeChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">选择预设主题</h3>
      <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
        {presetThemes.map((theme) => (
          <Card
            key={theme.name}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              currentTheme === theme.name
                ? 'ring-2 ring-primary ring-offset-2'
                : 'hover:border-primary/50'
            }`}
            onClick={() => onThemeChange(theme.name)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* 主题预览色块 */}
                  <div className="flex space-x-1">
                    <div
                      className="w-4 h-4 rounded-full border border-gray-200"
                      style={{ backgroundColor: theme.preview.primary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-gray-200"
                      style={{ backgroundColor: theme.preview.secondary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-gray-200"
                      style={{ backgroundColor: theme.preview.background }}
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-gray-200"
                      style={{ backgroundColor: theme.preview.foreground }}
                    />
                  </div>

                  <div>
                    <p className="font-medium">{theme.displayName}</p>
                    <p className="text-sm text-muted-foreground">
                      {theme.name}
                    </p>
                  </div>
                </div>

                {currentTheme === theme.name && (
                  <div className="flex items-center space-x-2">
                    <Badge variant="default">当前</Badge>
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
