import { CookieCheckResult } from "../types/types";
import { analyzeCookies } from "./cookieAnalyzer";
import { analyzeExternalResources } from "./resourceAnalyzer";

export async function checkThirdPartyCookies(
  url: string
): Promise<CookieCheckResult> {
  try {
    const [cookies, thirdPartyResources] = await Promise.all([
      analyzeCookies(url),
      analyzeExternalResources(url),
    ]);

    return {
      url,
      hasThirdPartyCookies:
        cookies.length > 0 || thirdPartyResources.length > 0,
      cookies,
      thirdPartyResources,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to check third-party cookies");
  }
}
