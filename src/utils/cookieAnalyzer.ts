import { CookieInfo } from "../types/types";
import { fetchWithProxy } from "./proxyUtils";
import { extractDomain } from "./domainUtils";

export async function analyzeCookies(url: string): Promise<CookieInfo[]> {
  try {
    const proxyResponse = await fetchWithProxy(url);
    const cookies: CookieInfo[] = [];
    const pageDomain = extractDomain(url);

    // Parse Set-Cookie headers from the proxy response
    if (proxyResponse.headers) {
      Object.entries(proxyResponse.headers)
        .filter(([key]) => key.toLowerCase() === "set-cookie")
        .forEach(([, value]) => {
          const parsedCookies = parseCookies(value, pageDomain);
          cookies.push(...parsedCookies);
        });
    }

    // Also check for cookie-setting scripts in the content
    const scriptCookies = analyzeScriptCookies(
      proxyResponse.contents,
      pageDomain
    );
    cookies.push(...scriptCookies);

    return cookies;
  } catch (error) {
    console.error("Cookie analysis error:", error);
    throw new Error("Failed to analyze cookies");
  }
}

function parseCookies(cookieHeader: string, pageDomain: string): CookieInfo[] {
  return cookieHeader
    .split(/,(?=[^ ])/g)
    .map((cookie) => {
      const [, ...options] = cookie.split(";");
      const domain =
        options
          .find((opt) => opt.trim().toLowerCase().startsWith("domain="))
          ?.split("=")[1]
          ?.trim() || pageDomain;

      const isThirdParty =
        !domain.endsWith(pageDomain) && !pageDomain.endsWith(domain);

      return {
        domain,
        isThirdParty,
        raw: cookie.trim(),
      };
    })
    .filter((cookie) => cookie.isThirdParty);
}

function analyzeScriptCookies(html: string, pageDomain: string): CookieInfo[] {
  const cookies: CookieInfo[] = [];
  const scriptPattern = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  const cookiePattern = /document\.cookie\s*=\s*['"]([^'"]+)['"]/g;

  let match;
  while ((match = scriptPattern.exec(html)) !== null) {
    const scriptContent = match[1];
    let cookieMatch;

    while ((cookieMatch = cookiePattern.exec(scriptContent)) !== null) {
      const cookieStr = cookieMatch[1];
      const parsedCookies = parseCookies(cookieStr, pageDomain);
      cookies.push(...parsedCookies);
    }
  }

  return cookies;
}
