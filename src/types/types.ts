// types.ts
export interface ResourceInfo {
  domain: string;
  type: string;
  url: string;
  isThirdParty: boolean;
  category?: {
    type:
      | "essential"
      | "functional"
      | "analytics"
      | "advertising"
      | "social"
      | "other";
    description: string;
  };
}

export interface CookieInfo {
  domain: string;
  isThirdParty: boolean;
  raw: string;
}

export interface CookieDetail {
  domain: string;
  purpose: string;
  description: string;
}

export interface CookieCheckResult {
  url: string;
  hasThirdPartyCookies: boolean;
  cookies: CookieInfo[];
  thirdPartyResources: ResourceInfo[];
}

export interface CheckerFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}
