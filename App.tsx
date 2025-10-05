
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImagePromptForm } from './components/ImagePromptForm';
import { ImageGallery } from './components/ImageGallery';
import { generateImagesFromApi, editImageWithPrompt } from './services/geminiService';
import type { AspectRatio } from './types';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // remove the "data:mime/type;base64," part
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(
    async (prompt: string, numberOfImages: number, aspectRatio: AspectRatio, imageFiles?: File[] | null) => {
      setIsLoading(true);
      setError(null);
      setGeneratedImages([]);
      try {
        if (imageFiles && imageFiles.length > 0) {
          // Handle image editing for multiple images
          const imageEditingPromises = imageFiles.map(async (file) => {
            const base64Data = await fileToBase64(file);
            return editImageWithPrompt(prompt, {
              data: base64Data,
              mimeType: file.type,
            });
          });

          const results = await Promise.all(imageEditingPromises);
          const allImages = results.flat(); // Flatten the array of arrays of strings
          setGeneratedImages(allImages);
        } else {
          // Handle image generation
          const images = await generateImagesFromApi(prompt, {
            numberOfImages,
            aspectRatio,
          });
          setGeneratedImages(images);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <ImagePromptForm onGenerate={handleGenerate} isLoading={isLoading} />
          <div className="mt-12">
            <ImageGallery isLoading={isLoading} images={generatedImages} error={error} />
          </div>
        </div>
      </main>
      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>Powered by Google Gemini. Built for professionals.</p>
      </footer>
    </div>
  );
};

export default App;