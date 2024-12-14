import { knownTrackingDomains } from './cookiePatterns';
import { extractDomain, getDomainParts } from './domainUtils';
import { fetchWithCorsProxy } from './proxyUtils';
import { CookieDetail } from '../types/types';

export async function analyzeExternalScripts(url: string): Promise<CookieDetail[]> {
  try {
    // Use CORS proxy to fetch the page content
    const html = await fetchWithCorsProxy(url);
    
    // Extract all script sources and link tags
    const scriptPattern = /<script[^>]*src=["']([^"']+)["'][^>]*>/gi;
    const linkPattern = /<link[^>]*href=["']([^"']+)["'][^>]*>/gi;
    
    const matches = [
      ...html.matchAll(scriptPattern),
      ...html.matchAll(linkPattern)
    ];
    
    const cookieDetails: CookieDetail[] = [];
    const processedDomains = new Set<string>();

    matches.forEach(match => {
      const resourceUrl = match[1];
      try {
        const fullUrl = resourceUrl.startsWith('http') ? 
          resourceUrl : 
          new URL(resourceUrl, url).toString();
        
        const resourceDomain = extractDomain(fullUrl);
        const pageDomain = extractDomain(url);
        
        // Check if it's a third-party domain
        if (resourceDomain !== pageDomain) {
          const domainParts = getDomainParts(resourceDomain);

          domainParts.forEach(part => {
            if (knownTrackingDomains.has(part) && !processedDomains.has(part)) {
              const trackingInfo = knownTrackingDomains.get(part)!;
              cookieDetails.push({
                domain: part,
                purpose: trackingInfo.purpose,
                description: trackingInfo.description
              });
              processedDomains.add(part);
            }
          });
        }
      } catch (error) {
        console.warn('Error processing resource URL:', resourceUrl);
      }
    });

    return cookieDetails;
  } catch (error) {
    console.error('Analysis error:', error);
    throw new Error('Failed to analyze the webpage. Please try again later.');
  }
}