import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ColorSwatch {
  color: string;
  label?: string;
}

export function ColorPicker() {
  const [oklchValue, setOklchValue] = useState('oklch(96% 0.007 247.896)');
  const [selectedPreset, setSelectedPreset] = useState('slate-100');

  // Generate color palette - 9 rows with different lightness levels
  const generateColorPalette = (): ColorSwatch[][] => {
    // Row 1: Very light colors with special labels
    const row1: ColorSwatch[] = [
      { color: '#1f2937', label: 'B1+' },
      { color: '#f8fafc' },
      { color: '#f1f5f9' },
      { color: '#e2e8f0' },
      { color: '#cbd5e1' },
      { color: '#fef2f2', label: 'ERR' },
      { color: '#fef7ed' },
      { color: '#fffbeb' },
      { color: '#f0fdf4', label: 'WAC' },
      { color: '#ecfdf5' },
      { color: '#f0fdfa' },
      { color: '#ecfeff', label: 'SUC' },
      { color: '#f0f9ff' },
      { color: '#eff6ff' },
      { color: '#eef2ff', label: 'INC' },
      { color: '#f5f3ff' },
      { color: '#faf5ff' },
      { color: '#fdf4ff' },
      { color: '#fdf2f8' },
      { color: '#fff1f2' },
      { color: '#000000', label: 'A' },
    ];

    // Row 2: Light colors
    const row2: ColorSwatch[] = [
      { color: '#374151', label: 'B2' },
      { color: '#e2e8f0' },
      { color: '#cbd5e1' },
      { color: '#94a3b8' },
      { color: '#64748b' },
      { color: '#fecaca' },
      { color: '#fed7aa' },
      { color: '#fde68a' },
      { color: '#bef264' },
      { color: '#86efac' },
      { color: '#67e8f9' },
      { color: '#7dd3fc' },
      { color: '#93c5fd' },
      { color: '#a5b4fc' },
      { color: '#c4b5fd' },
      { color: '#ddd6fe' },
      { color: '#f3e8ff' },
      { color: '#fce7f3' },
      { color: '#fbcfe8' },
      { color: '#fda4af' },
    ];

    // Row 3: Medium-light colors
    const row3: ColorSwatch[] = [
      { color: '#4b5563', label: 'B3' },
      { color: '#cbd5e1' },
      { color: '#94a3b8' },
      { color: '#64748b' },
      { color: '#475569' },
      { color: '#f87171' },
      { color: '#fb923c' },
      { color: '#facc15' },
      { color: '#a3e635' },
      { color: '#4ade80' },
      { color: '#22d3ee' },
      { color: '#38bdf8' },
      { color: '#60a5fa' },
      { color: '#818cf8' },
      { color: '#a78bfa' },
      { color: '#c084fc' },
      { color: '#e879f9' },
      { color: '#f472b6' },
      { color: '#fb7185' },
      { color: '#f43f5e' },
    ];

    // Row 4: Medium colors
    const row4: ColorSwatch[] = [
      { color: '#6b7280' },
      { color: '#9ca3af' },
      { color: '#6b7280' },
      { color: '#4b5563' },
      { color: '#374151' },
      { color: '#ef4444' },
      { color: '#f97316' },
      { color: '#eab308' },
      { color: '#84cc16', label: 'P' },
      { color: '#22c55e' },
      { color: '#06b6d4' },
      { color: '#0ea5e9' },
      { color: '#3b82f6' },
      { color: '#6366f1' },
      { color: '#8b5cf6' },
      { color: '#a855f7' },
      { color: '#d946ef' },
      { color: '#ec4899' },
      { color: '#f43f5e' },
    ];

    // Row 5: Medium-dark colors
    const row5: ColorSwatch[] = [
      { color: '#9ca3af' },
      { color: '#6b7280' },
      { color: '#4b5563' },
      { color: '#374151' },
      { color: '#1f2937' },
      { color: '#dc2626', label: 'ER' },
      { color: '#ea580c' },
      { color: '#d97706' },
      { color: '#65a30d', label: 'WA' },
      { color: '#16a34a', label: 'SU' },
      { color: '#0891b2' },
      { color: '#0284c7', label: 'IN' },
      { color: '#2563eb' },
      { color: '#4f46e5' },
      { color: '#7c3aed' },
      { color: '#9333ea' },
      { color: '#c026d3' },
      { color: '#db2777' },
      { color: '#e11d48' },
    ];

    // Row 6: Dark colors
    const row6: ColorSwatch[] = [
      { color: '#6b7280' },
      { color: '#4b5563' },
      { color: '#374151' },
      { color: '#1f2937' },
      { color: '#111827' },
      { color: '#b91c1c' },
      { color: '#c2410c' },
      { color: '#b45309' },
      { color: '#4d7c0f' },
      { color: '#15803d' },
      { color: '#0e7490' },
      { color: '#1d4ed8' },
      { color: '#1e40af' },
      { color: '#3730a3' },
      { color: '#581c87' },
      { color: '#6b21a8' },
      { color: '#a21caf' },
      { color: '#be185d' },
      { color: '#be123c' },
    ];

    // Row 7: Very dark colors
    const row7: ColorSwatch[] = [
      { color: '#4b5563' },
      { color: '#374151' },
      { color: '#1f2937' },
      { color: '#111827' },
      { color: '#030712' },
      { color: '#991b1b' },
      { color: '#9a3412' },
      { color: '#92400e' },
      { color: '#365314' },
      { color: '#14532d' },
      { color: '#164e63' },
      { color: '#1e3a8a' },
      { color: '#1e40af' },
      { color: '#312e81' },
      { color: '#4c1d95' },
      { color: '#581c87' },
      { color: '#86198f' },
      { color: '#9d174d' },
      { color: '#9f1239' },
    ];

    // Row 8: Darker colors
    const row8: ColorSwatch[] = [
      { color: '#1f2937', label: 'BC+' },
      { color: '#111827' },
      { color: '#030712' },
      { color: '#000000' },
      { color: '#000000' },
      { color: '#7f1d1d' },
      { color: '#7c2d12' },
      { color: '#713f12', label: 'PC' },
      { color: '#1a2e05' },
      { color: '#052e16' },
      { color: '#083344' },
      { color: '#1e3a8a', label: 'SC' },
      { color: '#1e1b4b' },
      { color: '#2e1065' },
      { color: '#581c87' },
      { color: '#701a75' },
      { color: '#831843' },
    ];

    return [row1, row2, row3, row4, row5, row6, row7, row8];
  };

  const colorPalette = generateColorPalette();

  const handleColorSelect = (color: string) => {
    // Convert hex to approximate OKLCH (simplified)
    const r = Number.parseInt(color.slice(1, 3), 16) / 255;
    const g = Number.parseInt(color.slice(3, 5), 16) / 255;
    const b = Number.parseInt(color.slice(5, 7), 16) / 255;
    const lightness = Math.round((0.299 * r + 0.587 * g + 0.114 * b) * 100);
    setOklchValue(`oklch(${lightness}% 0.007 247.896)`);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-white text-black px-3 py-1 rounded font-bold text-lg">
          A
        </div>
        <span className="text-gray-300 text-lg">
          Pick a color for{' '}
          <span className="text-white font-semibold">base 200</span>
        </span>
      </div>

      {/* Color Grid */}
      <div className="space-y-2 mb-6">
        {colorPalette.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2">
            {row.map((swatch, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                className="relative w-8 h-8 rounded-full border-2 border-gray-600 hover:border-white transition-colors group"
                style={{ backgroundColor: swatch.color }}
                onClick={() => handleColorSelect(swatch.color)}
                title={swatch.label || swatch.color}
              >
                {swatch.label && (
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white mix-blend-difference">
                    {swatch.label}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <label className="text-gray-300 text-sm mb-2 block">
            Adjust Lightness, Chroma, Hue:
          </label>
          <div className="flex gap-2">
            <Input
              value={oklchValue}
              onChange={(e) => setOklchValue(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white flex-1"
            />
            <Select value={selectedPreset} onValueChange={setSelectedPreset}>
              <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="slate-100">slate-100</SelectItem>
                <SelectItem value="slate-200">slate-200</SelectItem>
                <SelectItem value="slate-300">slate-300</SelectItem>
                <SelectItem value="gray-100">gray-100</SelectItem>
                <SelectItem value="gray-200">gray-200</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Accessibility Indicator */}
        <div className="ml-6 flex flex-col items-center">
          <div className="bg-slate-700 px-3 py-1 rounded text-white font-bold text-sm mb-1">
            AAA
          </div>
          <div className="w-16 h-2 bg-gradient-to-r from-gray-400 to-white rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
