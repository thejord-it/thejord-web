import { useState, useEffect } from 'react';

interface ColorFormats {
  hex: string;
  rgb: string;
  hsl: string;
  rgba: string;
  hsla: string;
  cmyk: string;
}

export default function ColorConverter() {
  const [color, setColor] = useState('#3B82F6');
  const [formats, setFormats] = useState<ColorFormats>({
    hex: '#3B82F6',
    rgb: 'rgb(59, 130, 246)',
    hsl: 'hsl(217, 91%, 60%)',
    rgba: 'rgba(59, 130, 246, 1)',
    hsla: 'hsla(217, 91%, 60%, 1)',
    cmyk: 'cmyk(76%, 47%, 0%, 4%)'
  });

  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  };

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const rgbToCmyk = (r: number, g: number, b: number): { c: number; m: number; y: number; k: number } => {
    let c = 1 - r / 255;
    let m = 1 - g / 255;
    let y = 1 - b / 255;
    const k = Math.min(c, m, y);

    c = k === 1 ? 0 : ((c - k) / (1 - k)) * 100;
    m = k === 1 ? 0 : ((m - k) / (1 - k)) * 100;
    y = k === 1 ? 0 : ((y - k) / (1 - k)) * 100;

    return {
      c: Math.round(c),
      m: Math.round(m),
      y: Math.round(y),
      k: Math.round(k * 100)
    };
  };

  const updateFormats = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return;

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

    setFormats({
      hex: hex.toUpperCase(),
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      rgba: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`,
      hsla: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)`,
      cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`
    });
  };

  useEffect(() => {
    updateFormats(color);
  }, [color]);

  const copyFormat = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  const presetColors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#FFA07A',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#85C1E2',
    '#F8B739',
    '#52B788',
    '#E76F51',
    '#2A9D8F'
  ];

  return (
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
            Color Picker & Converter
          </h1>
          <p className="text-gray-400 text-lg">
            Pick colors and convert between HEX, RGB, HSL, and CMYK formats
          </p>
        </div>

        {/* Color Picker */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8 mb-6 shadow-2xl">
          <div className="flex flex-col items-center gap-6">
            {/* Color Preview */}
            <div
              className="w-full h-48 rounded-lg shadow-2xl border-4 border-white"
              style={{ backgroundColor: color }}
            />

            {/* Color Input */}
            <div className="flex items-center gap-4 w-full max-w-md">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-20 h-20 cursor-pointer rounded-lg border-2 border-gray-600"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="flex-1 bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-3 font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>

        {/* Color Formats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {Object.entries(formats).map(([format, value]) => (
            <div
              key={format}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 font-semibold uppercase text-sm">
                  {format}
                </span>
                <button
                  onClick={() => copyFormat(value)}
                  className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors text-xs"
                >
                  Copy
                </button>
              </div>
              <code className="text-white font-mono text-sm block bg-gray-900 px-3 py-2 rounded">
                {value}
              </code>
            </div>
          ))}
        </div>

        {/* Preset Colors */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 shadow-2xl">
          <h3 className="text-lg font-semibold text-white mb-4">Preset Colors</h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3">
            {presetColors.map((presetColor) => (
              <button
                key={presetColor}
                onClick={() => setColor(presetColor)}
                className="w-full aspect-square rounded-lg shadow-lg hover:scale-110 transition-transform border-2 border-transparent hover:border-white"
                style={{ backgroundColor: presetColor }}
                title={presetColor}
              />
            ))}
          </div>
        </div>

        {/* Color Info */}
        <div className="mt-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-3">Color Format Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <strong className="text-blue-400">HEX:</strong> Hexadecimal notation (#RRGGBB)
              <br />
              Used in: CSS, HTML, design tools
            </div>
            <div>
              <strong className="text-green-400">RGB:</strong> Red, Green, Blue (0-255)
              <br />
              Used in: Screen displays, web development
            </div>
            <div>
              <strong className="text-purple-400">HSL:</strong> Hue, Saturation, Lightness
              <br />
              Used in: Color manipulation, CSS
            </div>
            <div>
              <strong className="text-pink-400">CMYK:</strong> Cyan, Magenta, Yellow, Black
              <br />
              Used in: Printing, graphic design
            </div>
          </div>
        </div>
      </div>
  );
}
