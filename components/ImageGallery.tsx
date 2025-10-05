
import React from 'react';
import { ImageCard } from './ImageCard';
import { Spinner } from './Spinner';

interface ImageGalleryProps {
  isLoading: boolean;
  images: string[];
  error: string | null;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ isLoading, images, error }) => {
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <Spinner />
        <p className="mt-4 text-lg text-gray-400">Generating your masterpiece, please wait...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 bg-red-900/20 border border-red-500/50 rounded-lg">
        <p className="text-xl font-semibold text-red-400">An Error Occurred</p>
        <p className="mt-2 text-red-300">{error}</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed border-gray-700 rounded-xl">
        <h2 className="text-2xl font-semibold text-gray-400">Your Generated Images Will Appear Here</h2>
        <p className="text-gray-500 mt-2">Fill out the form above to start creating.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {images.map((imageUrl, index) => (
        <ImageCard key={index} imageUrl={imageUrl} />
      ))}
    </div>
  );
};
