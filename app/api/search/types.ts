export interface SearchTalk {
  id: string;
  title: string;
  speaker: string;
  speakerAvatar: string | null;
  company: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchResponse {
  success: boolean;
  data: SearchTalk[];
  count: number;
  query: string;
  limit: number;
  isRecent: boolean;
}

export interface SearchErrorResponse {
  error: string;
  details?: any;
}
