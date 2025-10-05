
export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export interface ImageGenerationConfig {
  numberOfImages: number;
  aspectRatio: AspectRatio;
}

export interface ImageData {
  data: string; // base64 encoded string
  mimeType: string;
}
