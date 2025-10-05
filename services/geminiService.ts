
import { GoogleGenAI, Modality } from '@google/genai';
import type { ImageGenerationConfig, ImageData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateImagesFromApi = async (
  prompt: string,
  config: ImageGenerationConfig
): Promise<string[]> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: config.numberOfImages,
        aspectRatio: config.aspectRatio,
        outputMimeType: 'image/jpeg',
      },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
      throw new Error("The API did not return any images. The prompt might be too restrictive or violate safety policies.");
    }

    const imageUrls = response.generatedImages.map(
      (img) => `data:image/jpeg;base64,${img.image.imageBytes}`
    );
    return imageUrls;
  } catch (error) {
    console.error('Error generating images:', error);
    throw new Error(`Failed to generate images. Please check your prompt and API key. Details: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const editImageWithPrompt = async (
  prompt: string,
  image: ImageData,
): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: image.data,
              mimeType: image.mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    if (!response.candidates?.[0]?.content?.parts) {
      throw new Error("The API did not return any content. The prompt might be too restrictive or violate safety policies.");
    }
    
    const imageUrls = response.candidates[0].content.parts
      .filter(part => part.inlineData)
      .map(part => `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);

    if (imageUrls.length === 0) {
      throw new Error("The API did not return any images in the response.");
    }

    return imageUrls;
  } catch (error) {
    console.error('Error editing image:', error);
    throw new Error(`Failed to edit image. Please check your prompt and API key. Details: ${error instanceof Error ? error.message : String(error)}`);
  }
};
