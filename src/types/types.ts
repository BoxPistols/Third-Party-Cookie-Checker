export interface ResourceInfo {
  domain: string;
  type: string;
  url: string;
  isThirdParty: boolean;
  category?: {
    type: 'essential' | 'functional' | 'analytics' | 'advertising' | 'social' | 'other';
    description: string;
  };
}