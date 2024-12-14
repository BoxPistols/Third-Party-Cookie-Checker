export interface ResourceCategory {
  type: 'essential' | 'functional' | 'analytics' | 'advertising' | 'social' | 'other';
  description: string;
}

// Essential resources that should not be considered as third-party tracking
export const essentialResources = new Set([
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'cdn.jsdelivr.net',
  'unpkg.com',
  'cdnjs.cloudflare.com'
]);

// Resource categorization based on Japanese privacy laws
export const resourceCategories = new Map<string, ResourceCategory>([
  ['google-analytics.com', {
    type: 'analytics',
    description: 'ファーストパーティ分析ツール（サイト所有者の管理下）'
  }],
  ['googletagmanager.com', {
    type: 'analytics',
    description: 'ファーストパーティタグ管理（サイト所有者の管理下）'
  }],
  ['doubleclick.net', {
    type: 'advertising',
    description: 'サードパーティ広告配信'
  }],
  ['facebook.com', {
    type: 'social',
    description: 'サードパーティSNS連携'
  }],
  ['adlpo.com', {
    type: 'advertising',
    description: 'サードパーティ広告トラッキング'
  }]
]);