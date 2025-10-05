
import React from 'react';
import { DownloadIcon } from './icons/DownloadIcon';

interface ImageCardProps {
  imageUrl: string;
}

export const ImageCard: React.FC<ImageCardProps> = ({ imageUrl }) => {
  return (
    <div className="group relative overflow-hidden rounded-lg shadow-lg aspect-square bg-gray-800 border border-gray-700">
      <img
        src={imageUrl}
        alt="AI generated"
        className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <a
          href={imageUrl}
          download={`ai-generated-image-${Date.now()}.jpeg`}
          className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-semibold py-2 px-4 rounded-full hover:bg-white/30 transition-colors"
          title="Download Image"
        >
          <DownloadIcon className="w-5 h-5" />
          <span>Download</span>
        </a>
      </div>
    </div>
  );
};
