/**
 * Book settings panel for Builder
 * Handles global book-level settings like page numbering and margins
 */

import React from 'react';
import { BookSettings } from '@/types/book';

interface BuilderBookPanelProps {
  /** Current book settings */
  bookSettings: BookSettings;
  /** Callback when book settings are updated */
  onSettingsUpdate: (settings: BookSettings) => void;
}

/**
 * Renders the book settings panel with page numbering and margin controls
 * @param props - Component props
 * @returns Book settings panel component
 */
export function BuilderBookPanel({
  bookSettings,
  onSettingsUpdate
}: BuilderBookPanelProps) {
  
  /**
   * Updates page numbering settings
   */
  const updatePageNumbering = (updates: Partial<BookSettings['pageNumbering']>) => {
    onSettingsUpdate({
      ...bookSettings,
      pageNumbering: {
        ...bookSettings.pageNumbering,
        ...updates
      }
    });
  };

  /**
   * Updates margin settings
   */
  const updateMargins = (updates: Partial<BookSettings['margins']>) => {
    onSettingsUpdate({
      ...bookSettings,
      margins: {
        ...bookSettings.margins,
        ...updates
      }
    });
  };

  /**
   * Formats a number as Roman numerals
   */
  const toRoman = (num: number): string => {
    const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const numerals = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
    let result = '';
    
    for (let i = 0; i < values.length; i++) {
      while (num >= values[i]) {
        result += numerals[i];
        num -= values[i];
      }
    }
    return result;
  };

  /**
   * Formats page number according to current settings
   */
  const formatPageNumber = (pageNum: number): string => {
    const { format, prefix, suffix } = bookSettings.pageNumbering;
    let formattedNumber = '';
    
    switch (format) {
      case 'roman':
        formattedNumber = toRoman(pageNum).toLowerCase();
        break;
      case 'text':
        const pageWords = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
        formattedNumber = pageWords[pageNum - 1] || pageNum.toString();
        break;
      default:
        formattedNumber = pageNum.toString();
    }
    
    return `${prefix}${formattedNumber}${suffix}`;
  };

  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      <div className="p-4">
        <div className="space-y-6">
          
          {/* Page Numbering Section */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4" style={{ color: '#111827' }}>Page Numbering</h4>
            
            <div className="space-y-4">
              {/* Enable/Disable Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium" style={{ color: '#374151' }}>
                  Show Page Numbers
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bookSettings.pageNumbering.enabled}
                    onChange={(e) => updatePageNumbering({ enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>

              {bookSettings.pageNumbering.enabled && (
                <>
                  {/* Position */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                      Position
                    </label>
                                         <select 
                       value={bookSettings.pageNumbering.position}
                       onChange={(e) => updatePageNumbering({ position: e.target.value as BookSettings['pageNumbering']['position'] })}
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                       style={{ color: '#111827', backgroundColor: '#ffffff' }}
                     >
                      <option value="top-left" style={{ color: '#111827' }}>Top Left</option>
                      <option value="top-center" style={{ color: '#111827' }}>Top Center</option>
                      <option value="top-right" style={{ color: '#111827' }}>Top Right</option>
                      <option value="bottom-left" style={{ color: '#111827' }}>Bottom Left</option>
                      <option value="bottom-center" style={{ color: '#111827' }}>Bottom Center</option>
                      <option value="bottom-right" style={{ color: '#111827' }}>Bottom Right</option>
                    </select>
                  </div>

                  {/* Format */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                      Format
                    </label>
                                         <select 
                       value={bookSettings.pageNumbering.format}
                       onChange={(e) => updatePageNumbering({ format: e.target.value as BookSettings['pageNumbering']['format'] })}
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                       style={{ color: '#111827', backgroundColor: '#ffffff' }}
                     >
                      <option value="number" style={{ color: '#111827' }}>Numbers (1, 2, 3...)</option>
                      <option value="roman" style={{ color: '#111827' }}>Roman (i, ii, iii...)</option>
                      <option value="text" style={{ color: '#111827' }}>Text (one, two, three...)</option>
                    </select>
                  </div>

                  {/* Prefix and Suffix */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                        Prefix
                      </label>
                      <input
                        type="text"
                        value={bookSettings.pageNumbering.prefix}
                        onChange={(e) => updatePageNumbering({ prefix: e.target.value })}
                        placeholder="Page "
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        style={{ color: '#111827', backgroundColor: '#ffffff' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                        Suffix
                      </label>
                      <input
                        type="text"
                        value={bookSettings.pageNumbering.suffix}
                        onChange={(e) => updatePageNumbering({ suffix: e.target.value })}
                        placeholder=" of 10"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        style={{ color: '#111827', backgroundColor: '#ffffff' }}
                      />
                    </div>
                  </div>

                  {/* Font Size */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                      Font Size: {bookSettings.pageNumbering.fontSize}px
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="24"
                      value={bookSettings.pageNumbering.fontSize}
                      onChange={(e) => updatePageNumbering({ fontSize: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs mt-1" style={{ color: '#6b7280' }}>
                      <span>10px</span>
                      <span>24px</span>
                    </div>
                  </div>

                  {/* Color and Weight */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                        Color
                      </label>
                      <input
                        type="color"
                        value={bookSettings.pageNumbering.color}
                        onChange={(e) => updatePageNumbering({ color: e.target.value })}
                        className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                        Weight
                      </label>
                                             <select 
                         value={bookSettings.pageNumbering.fontWeight}
                         onChange={(e) => updatePageNumbering({ fontWeight: e.target.value as BookSettings['pageNumbering']['fontWeight'] })}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                         style={{ color: '#111827', backgroundColor: '#ffffff' }}
                       >
                        <option value="normal" style={{ color: '#111827' }}>Normal</option>
                        <option value="bold" style={{ color: '#111827' }}>Bold</option>
                      </select>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs mb-1" style={{ color: '#4b5563' }}>Preview:</div>
                    <div 
                      style={{
                        fontSize: `${bookSettings.pageNumbering.fontSize}px`,
                        color: bookSettings.pageNumbering.color,
                        fontWeight: bookSettings.pageNumbering.fontWeight
                      }}
                    >
                      {formatPageNumber(5)}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Book Margins Section */}
          <div>
            <h4 className="font-medium mb-4" style={{ color: '#111827' }}>Book Margins</h4>
            
            <div className="space-y-4">
              {/* Unit Selection */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                  Unit
                </label>
                                 <select 
                   value={bookSettings.margins.unit}
                   onChange={(e) => updateMargins({ unit: e.target.value as BookSettings['margins']['unit'] })}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                   style={{ color: '#111827', backgroundColor: '#ffffff' }}
                 >
                  <option value="px" style={{ color: '#111827' }}>Pixels (px)</option>
                  <option value="mm" style={{ color: '#111827' }}>Millimeters (mm)</option>
                  <option value="in" style={{ color: '#111827' }}>Inches (in)</option>
                </select>
              </div>

              {/* Margin Controls */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                    Top: {bookSettings.margins.top}{bookSettings.margins.unit}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={bookSettings.margins.unit === 'px' ? 200 : bookSettings.margins.unit === 'mm' ? 50 : 2}
                    step={bookSettings.margins.unit === 'px' ? 5 : bookSettings.margins.unit === 'mm' ? 1 : 0.1}
                    value={bookSettings.margins.top}
                    onChange={(e) => updateMargins({ top: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                    Bottom: {bookSettings.margins.bottom}{bookSettings.margins.unit}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={bookSettings.margins.unit === 'px' ? 200 : bookSettings.margins.unit === 'mm' ? 50 : 2}
                    step={bookSettings.margins.unit === 'px' ? 5 : bookSettings.margins.unit === 'mm' ? 1 : 0.1}
                    value={bookSettings.margins.bottom}
                    onChange={(e) => updateMargins({ bottom: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                    Left: {bookSettings.margins.left}{bookSettings.margins.unit}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={bookSettings.margins.unit === 'px' ? 200 : bookSettings.margins.unit === 'mm' ? 50 : 2}
                    step={bookSettings.margins.unit === 'px' ? 5 : bookSettings.margins.unit === 'mm' ? 1 : 0.1}
                    value={bookSettings.margins.left}
                    onChange={(e) => updateMargins({ left: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                    Right: {bookSettings.margins.right}{bookSettings.margins.unit}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={bookSettings.margins.unit === 'px' ? 200 : bookSettings.margins.unit === 'mm' ? 50 : 2}
                    step={bookSettings.margins.unit === 'px' ? 5 : bookSettings.margins.unit === 'mm' ? 1 : 0.1}
                    value={bookSettings.margins.right}
                    onChange={(e) => updateMargins({ right: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Visual Margin Preview */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-xs mb-2" style={{ color: '#4b5563' }}>Margin Preview:</div>
                <div className="relative bg-white border-2 border-gray-300 w-full h-32">
                  <div 
                    className="absolute bg-blue-100 border border-blue-300"
                    style={{
                      top: `${(bookSettings.margins.top / (bookSettings.margins.unit === 'px' ? 200 : bookSettings.margins.unit === 'mm' ? 50 : 2)) * 40}%`,
                      bottom: `${(bookSettings.margins.bottom / (bookSettings.margins.unit === 'px' ? 200 : bookSettings.margins.unit === 'mm' ? 50 : 2)) * 40}%`,
                      left: `${(bookSettings.margins.left / (bookSettings.margins.unit === 'px' ? 200 : bookSettings.margins.unit === 'mm' ? 50 : 2)) * 40}%`,
                      right: `${(bookSettings.margins.right / (bookSettings.margins.unit === 'px' ? 200 : bookSettings.margins.unit === 'mm' ? 50 : 2)) * 40}%`
                    }}
                  >
                    <div className="flex items-center justify-center h-full text-xs text-blue-600">
                      Content Area
                    </div>
                  </div>
                </div>
              </div>

              {/* Preset Margins */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                  Preset Margins
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'None', values: { top: 0, bottom: 0, left: 0, right: 0 } },
                    { name: 'Narrow', values: { top: 20, bottom: 20, left: 20, right: 20 } },
                    { name: 'Normal', values: { top: 40, bottom: 40, left: 40, right: 40 } },
                    { name: 'Wide', values: { top: 60, bottom: 60, left: 60, right: 60 } }
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => updateMargins(preset.values)}
                      className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 