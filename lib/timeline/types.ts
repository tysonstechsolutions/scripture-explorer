export interface Era {
  id: string;
  order: number;
  name: string;
  dateRange: string;
  tldr: string;
  bibleBooks: string[];
  color: string;
}

export interface EraDetail extends Era {
  keyFigures: string[];
  keyEvents: string[];
  worldEvents: string[];
  modernConnections: string[];
}
