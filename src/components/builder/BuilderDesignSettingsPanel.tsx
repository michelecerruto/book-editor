/**
 * Design Settings Panel component for managing book design settings
 */

import React from 'react';
import { DesignSettings, TypographySettings, LayoutSettings, ColorSettings } from '@/types/book';
import { Type, Layout, Palette, BookOpen } from 'lucide-react';

interface BuilderDesignSettingsPanelProps {
  /** Current design settings */
  designSettings: DesignSettings;
  /** Callback when design settings are updated */
  onSettingsUpdate: (settings: DesignSettings) => void;
}

/**
 * Renders the design settings panel
 * @param props - Component props
 * @returns DesignSettingsPanel component
 */
export function BuilderDesignSettingsPanel({
  designSettings,
  onSettingsUpdate
}: BuilderDesignSettingsPanelProps) {
  
  const updateTypographySettings = (updates: Partial<TypographySettings>) => {
    onSettingsUpdate({
      ...designSettings,
      typography: {
        ...designSettings.typography,
        ...updates
      }
    });
  };

  const updateLayoutSettings = (updates: Partial<LayoutSettings>) => {
    onSettingsUpdate({
      ...designSettings,
      layout: {
        ...designSettings.layout,
        ...updates
      }
    });
  };

  const updateColorSettings = (updates: Partial<ColorSettings>) => {
    onSettingsUpdate({
      ...designSettings,
      colors: {
        ...designSettings.colors,
        ...updates
      }
    });
  };

  const updateBookStyle = (style: string) => {
    onSettingsUpdate({
      ...designSettings,
      bookStyle: style
    });
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="space-y-6">
        {/* Typography Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Type className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">Typography</h3>
          </div>
          
          <div className="space-y-4">
            {/* Primary Font Family */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Font Family
              </label>
              <select 
                value={designSettings.typography.fontFamily}
                onChange={(e) => updateTypographySettings({ fontFamily: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white"
              >
                <option value="system">System Default</option>
                <option value="serif">Serif (Times, Georgia)</option>
                <option value="sans">Sans Serif (Arial, Helvetica)</option>
                <option value="crimson">Crimson Text (Book Serif)</option>
                <option value="libre">Libre Baskerville</option>
                <option value="playfair">Playfair Display</option>
                <option value="inter">Inter (Modern Sans)</option>
                <option value="lora">Lora (Reading Font)</option>
                <option value="merriweather">Merriweather</option>
              </select>
            </div>

            {/* Base Font Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Font Size
              </label>
              <select 
                value={designSettings.typography.baseFontSize}
                onChange={(e) => updateTypographySettings({ baseFontSize: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white"
              >
                <option value="14px">Small (14px)</option>
                <option value="16px">Medium (16px)</option>
                <option value="18px">Large (18px)</option>
                <option value="20px">Extra Large (20px)</option>
              </select>
            </div>

            {/* Line Height */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Line Height
              </label>
              <select 
                value={designSettings.typography.lineHeight}
                onChange={(e) => updateTypographySettings({ lineHeight: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white"
              >
                <option value="1.4">Tight (1.4)</option>
                <option value="1.6">Normal (1.6)</option>
                <option value="1.7">Relaxed (1.7)</option>
                <option value="1.8">Loose (1.8)</option>
              </select>
            </div>

            {/* Paragraph Spacing */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paragraph Spacing
              </label>
              <select 
                value={designSettings.typography.paragraphSpacing}
                onChange={(e) => updateTypographySettings({ paragraphSpacing: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white"
              >
                <option value="12px">Tight (12px)</option>
                <option value="16px">Normal (16px)</option>
                <option value="20px">Relaxed (20px)</option>
                <option value="24px">Wide (24px)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Layout className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">Layout</h3>
          </div>
          
          <div className="space-y-4">
            {/* Page Width */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Width
              </label>
              <select 
                value={designSettings.layout.pageWidth}
                onChange={(e) => updateLayoutSettings({ pageWidth: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white"
              >
                <option value="full">Full Width</option>
                <option value="1200px">Standard (1200px)</option>
                <option value="800px">Book Width (800px)</option>
                <option value="600px">Narrow (600px)</option>
              </select>
            </div>

            {/* Page Margins (this affects content padding, different from book margins) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Padding
              </label>
              <select 
                value={designSettings.layout.pageMargins}
                onChange={(e) => updateLayoutSettings({ pageMargins: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white"
              >
                <option value="16px">Minimal (16px)</option>
                <option value="24px">Small (24px)</option>
                <option value="32px">Normal (32px)</option>
                <option value="48px">Large (48px)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Colors Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">Colors</h3>
          </div>
          
          <div className="space-y-4">
            {/* Background Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { color: '#ffffff', name: 'White' },
                  { color: '#fefefe', name: 'Off White' },
                  { color: '#f9fafb', name: 'Light Gray' },
                  { color: '#f3f4f6', name: 'Gray' }
                ].map((bg) => (
                  <button
                    key={bg.color}
                    onClick={() => updateColorSettings({ backgroundColor: bg.color })}
                    className={`w-12 h-8 rounded border-2 transition-colors ${
                      designSettings.colors.backgroundColor === bg.color
                        ? 'border-orange-500'
                        : 'border-gray-300 hover:border-orange-400'
                    }`}
                    style={{ backgroundColor: bg.color }}
                    title={bg.name}
                  />
                ))}
              </div>
            </div>

            {/* Text Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Color
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { color: '#111827', name: 'Black' },
                  { color: '#1f2937', name: 'Dark Gray' },
                  { color: '#374151', name: 'Medium Gray' },
                  { color: '#4b5563', name: 'Light Gray' }
                ].map((text) => (
                  <button
                    key={text.color}
                    onClick={() => updateColorSettings({ textColor: text.color })}
                    className={`w-12 h-8 rounded border-2 transition-colors ${
                      designSettings.colors.textColor === text.color
                        ? 'border-orange-500'
                        : 'border-gray-300 hover:border-orange-400'
                    }`}
                    style={{ backgroundColor: text.color }}
                    title={text.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Book Styles Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">Book Styles</h3>
          </div>
          
          <div className="space-y-2">
            {[
              'Academic',
              'Fiction Novel',
              'Technical Manual',
              'Poetry Collection',
              'Children\'s Book',
              'Magazine Layout'
            ].map((style) => (
              <button
                key={style}
                onClick={() => updateBookStyle(style)}
                className={`w-full px-3 py-2 text-left text-sm border rounded-lg transition-colors ${
                  designSettings.bookStyle === style
                    ? 'bg-orange-50 border-orange-300 text-orange-700'
                    : 'border-gray-200 hover:bg-orange-50 hover:border-orange-300'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 