export interface SearchTalk {
  company: string;
  createdAt: Date;
  id: string;
  speaker: string;
  speakerAvatar: string | null;
  title: string;
  updatedAt: Date;
  url: string;
}

export interface SearchResponse {
  count: number;
  data: SearchTalk[];
  isRecent: boolean;
  limit: number;
  query: string;
  success: boolean;
}

export interface SearchErrorResponse {
  details?: any;
  error: string;
}
