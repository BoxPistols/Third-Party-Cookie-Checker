import { knownTrackingDomains } from "./cookiePatterns";
import { extractDomain } from "./domainUtils";
import { CookieDetail } from "../types/types";

export async function analyzeExternalScripts(
  url: string
): Promise<CookieDetail[]> {
  try {
    // Use CORS proxy to fetch the page content
    const html = await fetchWithCorsProxy(url);

    // Extract all script sources and link tags
    const scriptPattern = /<script[^>]*src=["']([^"']+)["'][^>]*>/gi;
    const linkPattern = /<link[^>]*href=["']([^"']+)["'][^>]*>/gi;

    const matches = [
      ...html.matchAll(scriptPattern),
      ...html.matchAll(linkPattern),
    ];

    const cookieDetails: CookieDetail[] = [];
    const processedDomains = new Set<string>();

    matches.forEach((match) => {
      const resourceUrl = match[1];
      try {
        const fullUrl = resourceUrl.startsWith("http")
          ? resourceUrl
          : new URL(resourceUrl, url).toString();

        const resourceDomain = extractDomain(fullUrl);
        const pageDomain = extractDomain(url);

        // Check if it's a third-party domain
        if (resourceDomain !== pageDomain) {
          const domainParts = resourceDomain.split(".").slice(-2);

          domainParts.forEach((part) => {
            if (knownTrackingDomains.has(part) && !processedDomains.has(part)) {
              const trackingInfo = knownTrackingDomains.get(part)!;
              cookieDetails.push({
                domain: part,
                purpose: trackingInfo.purpose,
                description: trackingInfo.description,
              });
              processedDomains.add(part);
            }
          });
        }
      } catch {
        console.warn("Error processing resource URL:", resourceUrl);
      }
    });

    return cookieDetails;
  } catch (error) {
    console.error("Analysis error:", error);
    throw new Error("Failed to analyze the webpage. Please try again later.");
  }
}
async function fetchWithCorsProxy(url: string): Promise<string> {
  const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  if (!response.ok) {
    throw new Error("Failed to fetch the page content.");
  }
  return await response.text();
}
