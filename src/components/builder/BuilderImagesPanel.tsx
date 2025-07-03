/**
 * Images panel component for Builder
 * Provides image upload and AI generation functionality
 */

import React, { useRef, useState } from 'react';
import { Upload, Wand2, Image, AlertCircle } from 'lucide-react';
import { BookSettings } from '@/types/book';

interface BuilderImagesPanelProps {
  /** Callback when drag starts from an image */
  onImageDragStart: (e: React.DragEvent, imageUrl: string) => void;
  /** Callback when drag ends */
  onDragEnd: () => void;
  /** Current book settings */
  bookSettings: BookSettings;
  /** Callback when book settings are updated */
  onBookSettingsUpdate: (settings: BookSettings) => void;
}

/**
 * Renders the images panel with upload and AI generation
 * @param props - Component props
 * @returns Images panel component
 */
export function BuilderImagesPanel({
  onImageDragStart,
  onDragEnd,
  bookSettings,
  onBookSettingsUpdate
}: BuilderImagesPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Use book settings as the single source of truth for uploaded images
  const uploadedImages = bookSettings.uploadedImages || [];
  
  // Helper function to update images in book settings
  const updateUploadedImages = (newImages: string[]) => {
    const updatedSettings = {
      ...bookSettings,
      uploadedImages: newImages
    };
    onBookSettingsUpdate(updatedSettings);
  };



  /**
   * Handles file upload via input
   */
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          updateUploadedImages([...uploadedImages, imageUrl]);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  /**
   * Handles drag and drop upload
   */
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          updateUploadedImages([...uploadedImages, imageUrl]);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  /**
   * Handles drag over for upload area
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  /**
   * Handles drag leave for upload area
   */
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  /**
   * Handles image drag start for adding to canvas
   */
  const handleImageDragStart = (e: React.DragEvent, imageUrl: string) => {
    onImageDragStart(e, imageUrl);
  };

  /**
   * Removes an uploaded image
   */
  const removeImage = (index: number) => {
    updateUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 flex flex-col h-full">
      {/* Upload Section */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
          Upload Images
        </h3>
        
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragOver 
              ? 'border-orange-400 bg-orange-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop images here, or click to browse
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-orange-600 bg-orange-100 rounded-md hover:bg-orange-200 transition-colors"
          >
            Choose Files
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* AI Generation Section */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
          AI Generation
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <p className="text-xs text-gray-600">
              AI image generation is coming soon
            </p>
          </div>
          
          <div className="space-y-2">
            <textarea
              placeholder="Describe the image you want to generate..."
              className="w-full p-3 text-sm border border-gray-300 rounded-lg resize-none bg-gray-50"
              rows={3}
              disabled
            />
            <button
              disabled
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed"
            >
              <Wand2 className="w-4 h-4" />
              Generate Image
            </button>
          </div>
        </div>
      </div>

      {/* Uploaded Images */}
      {uploadedImages.length > 0 && (
        <div className="flex-1 min-h-0">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
            Your Images
          </h3>
          
          <div className="grid grid-cols-2 gap-3 overflow-y-auto">
            {uploadedImages.map((imageUrl, index) => (
              <div
                key={index}
                className="relative group cursor-move"
                draggable
                onDragStart={(e) => handleImageDragStart(e, imageUrl)}
                onDragEnd={onDragEnd}
                title="Drag to add to document"
              >
                <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-orange-400 transition-colors bg-gray-100">
                  <img
                    src={imageUrl}
                    alt={`Uploaded image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                
                {/* Remove button */}
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs hover:bg-red-600"
                  title="Remove image"
                >
                  ×
                </button>
                
                {/* Image icon overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                  <Image className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 