import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Copy, Check } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  description?: string;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

// 颜色转换工具函数
const hexToRgb = (hex: string): RGB | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

const rgbToHsl = (r: number, g: number, b: number): HSL => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
};

const hslToRgb = (h: number, s: number, l: number): RGB => {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
};

// OKLCH 色彩空间预设颜色（类似截图中的调色板）
const colorPalette = [
  // 黑白灰系列
  ['#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b', '#475569', '#334155', '#1e293b', '#0f172a', '#000000'],
  // 红色系列
  ['#fef2f2', '#fee2e2', '#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d', '#450a0a'],
  // 橙色系列
  ['#fff7ed', '#ffedd5', '#fed7aa', '#fdba74', '#fb923c', '#f97316', '#ea580c', '#c2410c', '#9a3412', '#7c2d12', '#431407'],
  // 黄色系列
  ['#fefce8', '#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f', '#451a03'],
  // 绿色系列
  ['#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d', '#052e16'],
  // 青色系列
  ['#f0fdfa', '#ccfbf1', '#99f6e4', '#5eead4', '#2dd4bf', '#14b8a6', '#0d9488', '#0f766e', '#115e59', '#134e4a', '#042f2e'],
  // 蓝色系列
  ['#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a', '#172554'],
  // 紫色系列
  ['#faf5ff', '#f3e8ff', '#e9d5ff', '#d8b4fe', '#c084fc', '#a855f7', '#9333ea', '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95'],
  // 粉色系列
  ['#fdf2f8', '#fce7f3', '#fbcfe8', '#f9a8d4', '#f472b6', '#ec4899', '#db2777', '#be185d', '#9d174d', '#831843', '#500724']
];

// 预设色相值（更接近截图中的标签）
const huePresets = [
  { name: 'R', hue: 0, color: '#ff0000' },      // 红
  { name: 'YR', hue: 30, color: '#ff8000' },    // 黄红
  { name: 'Y', hue: 60, color: '#ffff00' },     // 黄
  { name: 'GY', hue: 90, color: '#80ff00' },    // 绿黄
  { name: 'G', hue: 120, color: '#00ff00' },    // 绿
  { name: 'BG', hue: 150, color: '#00ff80' },   // 蓝绿
  { name: 'B', hue: 180, color: '#00ffff' },    // 蓝（青）
  { name: 'PB', hue: 210, color: '#0080ff' },   // 紫蓝
  { name: 'P', hue: 240, color: '#0000ff' },    // 紫（蓝）
  { name: 'RP', hue: 270, color: '#8000ff' },   // 红紫
  { name: 'M', hue: 300, color: '#ff00ff' },    // 品红
  { name: 'YM', hue: 330, color: '#ff0080' },   // 黄品红
];

export const AdvancedColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  label,
  description
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('palette');
  const [copied, setCopied] = useState(false);
  
  // HSL 状态
  const [hsl, setHsl] = useState<HSL>({ h: 240, s: 100, l: 50 });
  const [oklch, setOklch] = useState({ l: 96, c: 0.007, h: 247.896 });

  // 更新颜色时同步 HSL
  useEffect(() => {
    const rgb = hexToRgb(value);
    if (rgb) {
      const newHsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setHsl(newHsl);
    }
  }, [value]);

  const handleColorSelect = (color: string) => {
    onChange(color);
  };

  const handleHslChange = (newHsl: Partial<HSL>) => {
    const updatedHsl = { ...hsl, ...newHsl };
    setHsl(updatedHsl);
    
    const rgb = hslToRgb(updatedHsl.h, updatedHsl.s, updatedHsl.l);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    onChange(hex);
  };

  const handleOklchChange = (newOklch: Partial<typeof oklch>) => {
    const updatedOklch = { ...oklch, ...newOklch };
    setOklch(updatedOklch);
    
    // 简化的 OKLCH 到 HSL 转换（近似）
    // 在实际项目中，建议使用专门的颜色库如 culori 或 d3-color
    const hue = updatedOklch.h;
    const saturation = Math.min(100, updatedOklch.c * 200); // 近似转换
    const lightness = updatedOklch.l;
    
    const rgb = hslToRgb(hue, saturation, lightness);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    onChange(hex);
  };

  const copyColor = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy color:', err);
    }
  };

  const ColorPaletteGrid: React.FC = () => (
    <div className="space-y-1">
      {/* 黑白灰渐变行 */}
      <div className="flex gap-1 mb-2">
        {['#000000', '#1a1a1a', '#333333', '#4d4d4d', '#666666', '#808080', '#999999', '#b3b3b3', '#cccccc', '#e6e6e6', '#f5f5f5', '#ffffff'].map((color, index) => (
          <button
            key={`bw-${index}`}
            className={`w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform ${
              value.toLowerCase() === color.toLowerCase() ? 'ring-2 ring-blue-500' : ''
            }`}
            style={{ backgroundColor: color }}
            onClick={() => handleColorSelect(color)}
            title={color}
          />
        ))}
      </div>
      
      {/* 彩色调色板 */}
      {colorPalette.slice(1).map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1">
          {row.map((color, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={`w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform ${
                value.toLowerCase() === color.toLowerCase() ? 'ring-2 ring-blue-500' : ''
              }`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorSelect(color)}
              title={color}
            />
          ))}
        </div>
      ))}
    </div>
  );

  const HSLPicker: React.FC = () => (
    <div className="space-y-4">
      {/* 2D 颜色选择器 */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">颜色选择</Label>
        <div 
          className="relative w-full h-48 rounded-lg cursor-crosshair border border-gray-200"
          style={{
            background: `
              linear-gradient(to right, #ffffff, hsl(${hsl.h}, 100%, 50%)),
              linear-gradient(to top, #000000, transparent)
            `,
            backgroundBlendMode: 'multiply'
          }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = 1 - (e.clientY - rect.top) / rect.height;
            
            const newSaturation = x * 100;
            const newLightness = y * 100;
            
            handleHslChange({ s: newSaturation, l: newLightness });
          }}
        >
          {/* 选择指示器 */}
          <div
            className="absolute w-3 h-3 border-2 border-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              left: `${hsl.s}%`,
              bottom: `${hsl.l}%`
            }}
          />
        </div>
      </div>

      {/* 色相选择器 */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">色相 (Hue)</Label>
        <div className="flex items-center gap-2 mb-2">
          {huePresets.map((preset) => (
            <button
              key={preset.name}
              className={`w-8 h-8 rounded border-2 text-xs font-medium transition-all ${
                Math.abs(hsl.h - preset.hue) < 15 
                  ? 'border-white ring-2 ring-blue-500' 
                  : 'border-gray-300 hover:border-white'
              }`}
              style={{ 
                backgroundColor: preset.color,
                color: preset.hue === 60 || preset.hue === 90 ? '#000' : '#fff'
              }}
              onClick={() => handleHslChange({ h: preset.hue })}
              title={`${preset.name} (${preset.hue}°)`}
            >
              {preset.name}
            </button>
          ))}
        </div>
        <input
          type="range"
          min="0"
          max="360"
          value={hsl.h}
          onChange={(e) => handleHslChange({ h: parseInt(e.target.value) })}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, 
              hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), 
              hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), 
              hsl(360, 100%, 50%)
            )`
          }}
        />
        <div className="text-xs text-gray-500">{Math.round(hsl.h)}°</div>
      </div>

      {/* 颜色预览和值 */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        <div
          className="w-12 h-12 rounded-lg border-2 border-gray-200"
          style={{ backgroundColor: value }}
        />
        <div className="flex-1">
          <div className="text-sm font-medium">{value.toUpperCase()}</div>
          <div className="text-xs text-gray-500">
            HSL({Math.round(hsl.h)}, {Math.round(hsl.s)}%, {Math.round(hsl.l)}%)
          </div>
        </div>
      </div>
    </div>
  );

  const OKLCHPicker: React.FC = () => (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 p-3 bg-blue-50 rounded-lg">
        OKLCH 是一个感知上更均匀的色彩空间，提供更好的颜色插值和调整效果。
      </div>
      
      {/* 亮度 */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">亮度 (Lightness)</Label>
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={oklch.l}
          onChange={(e) => handleOklchChange({ l: parseFloat(e.target.value) })}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-black to-white"
        />
        <div className="text-xs text-gray-500">{oklch.l.toFixed(1)}%</div>
      </div>

      {/* 色度 */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">色度 (Chroma)</Label>
        <input
          type="range"
          min="0"
          max="0.5"
          step="0.001"
          value={oklch.c}
          onChange={(e) => handleOklchChange({ c: parseFloat(e.target.value) })}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-gray-300 to-red-500"
        />
        <div className="text-xs text-gray-500">{oklch.c.toFixed(3)}</div>
      </div>

      {/* 色相 */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">色相 (Hue)</Label>
        <input
          type="range"
          min="0"
          max="360"
          step="0.1"
          value={oklch.h}
          onChange={(e) => handleOklchChange({ h: parseFloat(e.target.value) })}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, 
              hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), 
              hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), 
              hsl(360, 100%, 50%)
            )`
          }}
        />
        <div className="text-xs text-gray-500">{oklch.h.toFixed(1)}°</div>
      </div>

      {/* OKLCH 输入框 - 模拟截图效果 */}
      <div className="p-4 bg-gray-50 rounded-lg border">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium">OKLCH 值</div>
          <div className="text-xs text-gray-500">
            Pick a color for base-200
          </div>
        </div>
        
        <div className="flex items-center gap-2 p-2 bg-gray-700 rounded text-white font-mono text-sm">
          <span className="text-gray-300">oklch(</span>
          <span className="text-blue-300">{oklch.l.toFixed(0)}%</span>
          <span className="text-blue-300">{oklch.c.toFixed(3)}</span>
          <span className="text-blue-300">{oklch.h.toFixed(3)}</span>
          <span className="text-gray-300">)</span>
          <div className="flex items-center gap-1 ml-auto">
            <div className="flex gap-1">
              {['A', 'A', 'A'].map((letter, i) => (
                <span 
                  key={i} 
                  className={`w-6 h-6 rounded text-xs flex items-center justify-center ${
                    i === 0 ? 'bg-white text-black' : 'bg-gray-500 text-white'
                  }`}
                >
                  {letter}
                </span>
              ))}
            </div>
            <div className="w-8 h-6 bg-gray-600 rounded flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer hover:scale-105 transition-transform"
          style={{ backgroundColor: value }}
          onClick={() => setIsOpen(!isOpen)}
        />
        <div className="flex-1">
          {label && <Label className="text-sm font-medium">{label}</Label>}
          {description && <p className="text-xs text-gray-500">{description}</p>}
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="font-mono text-sm h-8"
              placeholder="#000000"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={copyColor}
              className="h-8 w-8 p-0"
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <Card className="border shadow-lg max-w-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Palette className="h-4 w-4" />
              颜色选择器
              <Badge variant="secondary" className="ml-auto font-mono text-xs">
                {value.toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="palette">调色板</TabsTrigger>
                <TabsTrigger value="hsl">HSL</TabsTrigger>
                <TabsTrigger value="oklch">OKLCH</TabsTrigger>
              </TabsList>
              
              <TabsContent value="palette" className="space-y-4">
                <ColorPaletteGrid />
              </TabsContent>
              
              <TabsContent value="hsl" className="space-y-4">
                <HSLPicker />
              </TabsContent>
              
              <TabsContent value="oklch" className="space-y-4">
                <OKLCHPicker />
              </TabsContent>
            </Tabs>

            <Separator />
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyColor}
                  className="h-8"
                >
                  {copied ? (
                    <Check className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <Copy className="h-3 w-3 mr-1" />
                  )}
                  {copied ? '已复制' : '复制'}
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                确定
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
