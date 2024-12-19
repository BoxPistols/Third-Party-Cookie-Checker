// src/types/types.ts

// Cookie関連の型定義
export interface CookieInfo {
  domain: string;
  isThirdParty: boolean;
  raw: string;
  source: "header" | "script"; // Cookieの出所を明確に
  type: "tracking" | "analytics" | "advertising" | "functional" | "unknown";
}

// スクリプトによるCookie設定の検出用
export interface CookieScript {
  domain: string;
  url: string;
  content: string;
  cookieOperations: {
    type: "set" | "get" | "remove";
    pattern: string;
  }[];
}

// Cookie設定を行う可能性のある外部リソース
export interface CookieResource {
  domain: string;
  url: string;
  type: "script" | "iframe"; // Cookie設定可能なリソースタイプのみに限定
  isThirdParty: boolean;
  purpose: {
    type: "analytics" | "advertising" | "social" | "functional" | "unknown";
    description: string;
  };
}

// 検査結果
// types.ts
export interface CookieCheckResult {
  url: string;
  thirdPartyResources: ResourceInfo[];
  cookies: CookieInfo[];
  hasThirdPartyCookies: boolean;
}

export interface ResourceInfo {
  domain: string;
  type: string;
  url: string;
  isThirdParty: boolean;
}

export interface CookieInfo {
  domain: string;
  raw: string;
  isThirdParty: boolean;
}

// UI関連の型定義
export interface CheckerFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export interface CheckerError {
  code: "FETCH_ERROR" | "PARSE_ERROR" | "INVALID_URL" | "TIMEOUT" | "UNKNOWN";
  message: string;
  details?: unknown;
}

// ResourceInfo
export interface ResourceInfo {
  domain: string;
  type: string;
  url: string;
  isThirdParty: boolean;
  category: unknown;
}
