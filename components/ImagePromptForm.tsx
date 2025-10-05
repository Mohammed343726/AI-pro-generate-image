import React, { useState } from 'react';
import type { AspectRatio } from '../types';
import { XCircleIcon } from './icons/XCircleIcon';

interface ImagePromptFormProps {
  onGenerate: (prompt: string, numberOfImages: number, aspectRatio: AspectRatio, imageFiles?: File[] | null) => void;
  isLoading: boolean;
}

const aspectRatios: { value: AspectRatio; label: string }[] = [
  { value: '1:1', label: 'Square' },
  { value: '16:9', label: 'Widescreen' },
  { value: '9:16', label: 'Portrait' },
  { value: '4:3', label: 'Landscape' },
  { value: '3:4', label: 'Vertical' },
];

export const ImagePromptForm: React.FC<ImagePromptFormProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [numberOfImages, setNumberOfImages] = useState<number>(1);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setImageFiles(prev => [...prev, ...newFiles]);

      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    const input = document.getElementById('image-upload') as HTMLInputElement;
    if (input && imageFiles.length === 1) {
      input.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt, numberOfImages, aspectRatio, imageFiles);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800/50 p-6 rounded-xl border border-gray-700">
      <div>
        <label htmlFor="prompt" className="block text-lg font-medium text-gray-300 mb-2">
          Describe the image you want to create or edit
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A cinematic photo of a robot reading a book in a futuristic library, detailed, 8k resolution"
          rows={4}
          className="w-full bg-gray-900/70 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 placeholder-gray-500"
          required
        />
      </div>

      <div>
        <label htmlFor="image-upload" className="block text-sm font-medium text-gray-400 mb-2">
          Optional: Upload one or more images to edit
        </label>
        <div
          className={`mt-2 ${
            imagePreviews.length > 0 ? 'block' : 'hidden'
          }`}
        >
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative aspect-square">
                <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover rounded-lg border-2 border-gray-600" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-gray-800 rounded-full text-gray-400 hover:text-white hover:bg-red-600 transition-all duration-200"
                  aria-label="Remove image"
                >
                  <XCircleIcon className="w-7 h-7" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className={`flex items-center justify-center w-full mt-2 ${
            imagePreviews.length > 0 ? 'hidden' : 'flex'
          }`}>
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-900/50 hover:bg-gray-800/60 transition"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/></svg>
              <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-gray-500">PNG, JPG, or WEBP</p>
            </div>
            <input id="image-upload" type="file" className="hidden" onChange={handleImageChange} accept="image/png, image/jpeg, image/webp" multiple />
          </label>
        </div>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity duration-300 ${imageFiles.length > 0 ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
        <div>
          <label className="block text-base font-medium text-gray-300 mb-3">
            Aspect Ratio {imageFiles.length > 0 && <span className="text-xs text-gray-500">(Disabled)</span>}
          </label>
          <div className="flex flex-wrap gap-2">
            {aspectRatios.map((ratio) => (
              <button
                key={ratio.value}
                type="button"
                onClick={() => setAspectRatio(ratio.value)}
                disabled={imageFiles.length > 0}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${
                  aspectRatio === ratio.value && imageFiles.length === 0
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                } disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed`}
              >
                {ratio.label} ({ratio.value})
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="numImages" className="block text-base font-medium text-gray-300 mb-2">
            Number of Images: <span className="font-bold text-blue-400">{numberOfImages}</span> {imageFiles.length > 0 && <span className="text-xs text-gray-500">(Disabled)</span>}
          </label>
          <input
            id="numImages"
            type="range"
            min="1"
            max="4"
            value={numberOfImages}
            onChange={(e) => setNumberOfImages(parseInt(e.target.value, 10))}
            disabled={imageFiles.length > 0}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:accent-gray-600 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !prompt.trim()}
        className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-lg"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {imageFiles.length > 0 ? 'Editing...' : 'Generating...'}
          </>
        ) : (
          imageFiles.length > 0 ? 'Edit Image(s)' : 'Generate Images'
        )}
      </button>
    </form>
  );
};