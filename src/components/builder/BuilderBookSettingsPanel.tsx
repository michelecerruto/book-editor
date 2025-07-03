/**
 * Book Settings Panel component for managing global book settings
 */

import React from 'react';
import { BookSettings, PageNumberSettings, MarginSettings } from '@/types/book';
import { Hash, Ruler } from 'lucide-react';

interface BuilderBookSettingsPanelProps {
  /** Current book settings */
  bookSettings: BookSettings;
  /** Callback when book settings are updated */
  onSettingsUpdate: (settings: BookSettings) => void;
}

/**
 * Renders the book settings panel
 * @param props - Component props
 * @returns BookSettingsPanel component
 */
export function BuilderBookSettingsPanel({
  bookSettings,
  onSettingsUpdate
}: BuilderBookSettingsPanelProps) {
  
  const updatePageNumberSettings = (updates: Partial<PageNumberSettings>) => {
    onSettingsUpdate({
      ...bookSettings,
      pageNumbers: {
        ...bookSettings.pageNumbers,
        ...updates
      }
    });
  };

  const updateMarginSettings = (updates: Partial<MarginSettings>) => {
    onSettingsUpdate({
      ...bookSettings,
      margins: {
        ...bookSettings.margins,
        ...updates
      }
    });
  };

  const formatPageNumber = (pageNum: number, format: PageNumberSettings['format']): string => {
    switch (format) {
      case 'roman-lower':
        return toRoman(pageNum).toLowerCase();
      case 'roman-upper':
        return toRoman(pageNum);
      case 'alpha-lower':
        return toAlpha(pageNum).toLowerCase();
      case 'alpha-upper':
        return toAlpha(pageNum);
      case 'numeric':
      default:
        return pageNum.toString();
    }
  };

  const toRoman = (num: number): string => {
    const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const symbols = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
    let result = '';
    for (let i = 0; i < values.length; i++) {
      while (num >= values[i]) {
        result += symbols[i];
        num -= values[i];
      }
    }
    return result;
  };

  const toAlpha = (num: number): string => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    while (num > 0) {
      num--;
      result = letters[num % 26] + result;
      num = Math.floor(num / 26);
    }
    return result;
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .slider::-webkit-slider-track {
          background: #e5e7eb;
          border-radius: 8px;
        }
        
        .slider::-moz-range-track {
          background: #e5e7eb;
          border-radius: 8px;
        }
      `}</style>
      <div className="space-y-6">
        {/* Page Numbers Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Hash className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">Page Numbers</h3>
          </div>
          
          <div className="space-y-4">
            {/* Enable/Disable Page Numbers */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Show Page Numbers</label>
              <input
                type="checkbox"
                checked={bookSettings.pageNumbers.enabled}
                onChange={(e) => updatePageNumberSettings({ enabled: e.target.checked })}
                className="rounded border-gray-300 text-orange-500 focus:ring-orange-500 focus:ring-2"
              />
            </div>

            {bookSettings.pageNumbers.enabled && (
              <>
                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                  <select
                    value={bookSettings.pageNumbers.position}
                    onChange={(e) => updatePageNumberSettings({ position: e.target.value as PageNumberSettings['position'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                  >
                    <option value="top-left">Top Left</option>
                    <option value="top-center">Top Center</option>
                    <option value="top-right">Top Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="bottom-center">Bottom Center</option>
                    <option value="bottom-right">Bottom Right</option>
                  </select>
                </div>

                {/* Format */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                  <select
                    value={bookSettings.pageNumbers.format}
                    onChange={(e) => updatePageNumberSettings({ format: e.target.value as PageNumberSettings['format'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                  >
                    <option value="numeric">1, 2, 3...</option>
                    <option value="roman-lower">i, ii, iii...</option>
                    <option value="roman-upper">I, II, III...</option>
                    <option value="alpha-lower">a, b, c...</option>
                    <option value="alpha-upper">A, B, C...</option>
                  </select>
                                     <div className="mt-2 text-xs text-gray-700 font-medium">
                     Preview: {formatPageNumber(1, bookSettings.pageNumbers.format)}
                   </div>
                </div>

                {/* Font Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                  <input
                    type="range"
                    min="10"
                    max="24"
                    value={bookSettings.pageNumbers.fontSize}
                    onChange={(e) => updatePageNumberSettings({ fontSize: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                                     <div className="flex justify-between text-xs text-gray-700 font-medium">
                     <span>10px</span>
                     <span>{bookSettings.pageNumbers.fontSize}px</span>
                     <span>24px</span>
                   </div>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bookSettings.pageNumbers.color}
                      onChange={(e) => updatePageNumberSettings({ color: e.target.value })}
                      className="w-12 h-8 rounded border border-gray-300 cursor-pointer bg-white"
                    />
                    <input
                      type="text"
                      value={bookSettings.pageNumbers.color}
                      onChange={(e) => updatePageNumberSettings({ color: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-700"
                      placeholder="#000000"
                    />
                  </div>
                </div>

                {/* Prefix and Suffix */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prefix</label>
                    <input
                      type="text"
                      value={bookSettings.pageNumbers.prefix || ''}
                      onChange={(e) => updatePageNumberSettings({ prefix: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-700"
                      placeholder="Page "
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Suffix</label>
                    <input
                      type="text"
                      value={bookSettings.pageNumbers.suffix || ''}
                      onChange={(e) => updatePageNumberSettings({ suffix: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-700"
                      placeholder=""
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Margins Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Ruler className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">Page Margins</h3>
          </div>
          
          <div className="space-y-4">
            {/* Individual Margins */}
            {[
              { key: 'top' as keyof MarginSettings, label: 'Top' },
              { key: 'bottom' as keyof MarginSettings, label: 'Bottom' },
              { key: 'left' as keyof MarginSettings, label: 'Left' },
              { key: 'right' as keyof MarginSettings, label: 'Right' }
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{label} Margin</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={bookSettings.margins[key]}
                    onChange={(e) => updateMarginSettings({ [key]: parseInt(e.target.value) })}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <input
                    type="number"
                    value={bookSettings.margins[key]}
                    onChange={(e) => updateMarginSettings({ [key]: parseInt(e.target.value) || 0 })}
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-700"
                    min="0"
                    max="100"
                  />
                                     <span className="text-sm text-gray-700 font-medium">px</span>
                </div>
              </div>
            ))}
            
            {/* Quick Presets */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quick Presets</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'None', values: { top: 0, bottom: 0, left: 0, right: 0 } },
                  { label: 'Narrow', values: { top: 16, bottom: 16, left: 16, right: 16 } },
                  { label: 'Normal', values: { top: 32, bottom: 32, left: 32, right: 32 } },
                  { label: 'Wide', values: { top: 48, bottom: 48, left: 48, right: 48 } }
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => updateMarginSettings(preset.values)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 