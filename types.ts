
export interface Channel {
  id: string;
  number: number;
  name: string;
  logo: string;
  url: string;
  group: string;
  isFavorite: boolean;
  epgCurrent?: string;
  epgNext?: string;
}

export enum AppState {
  SPLASH = 'SPLASH',
  PLAYER = 'PLAYER',
  GUIDE = 'GUIDE',
  SETTINGS = 'SETTINGS'
}

export interface PlayerSettings {
  aspectRatio: 'fit' | 'fill';
  bufferSize: 'low' | 'medium' | 'high';
  quality: 'auto' | 'high' | 'low';
}
