import { CookieCheckResult } from "../types/types";
import { analyzeCookies } from "./cookieAnalyzer";
import { analyzeExternalResources } from "./resourceAnalyzer";

// cookieChecker.ts
export async function checkThirdPartyCookies(
  url: string
): Promise<CookieCheckResult> {
  try {
    const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;

    const [cookies, thirdPartyResources] = await Promise.all([
      analyzeCookies(normalizedUrl).catch((error) => {
        console.warn("Cookie analysis failed:", error);
        return []; // エラー時は空配列を返す
      }),
      analyzeExternalResources(normalizedUrl).catch((error) => {
        console.warn("Resource analysis failed:", error);
        return []; // エラー時は空配列を返す
      }),
    ]);

    return {
      url: normalizedUrl,
      hasThirdPartyCookies:
        cookies.length > 0 || thirdPartyResources.length > 0,
      cookies: cookies || [],
      thirdPartyResources: thirdPartyResources || [],
    };
  } catch (error) {
    console.error("Cookie check failed:", error);
    throw new Error(
      `Failed to analyze website: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
