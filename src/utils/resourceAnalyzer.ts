import { ResourceInfo } from '../types/types';
import { fetchWithProxy } from './proxyUtils';
import { extractDomain } from './domainUtils';

export async function analyzeExternalResources(url: string): Promise<ResourceInfo[]> {
  try {
    const proxyResponse = await fetchWithProxy(url);
    const pageDomain = extractDomain(url);
    
    const resources: ResourceInfo[] = [];
    const processedUrls = new Set<string>();

    // Extract resources from HTML content
    const resourceTypes = [
      { tag: 'script', attr: 'src' },
      { tag: 'link', attr: 'href' },
      { tag: 'iframe', attr: 'src' },
      { tag: 'img', attr: 'src' }
    ];

    resourceTypes.forEach(({ tag, attr }) => {
      const extracted = extractResources(proxyResponse.contents, tag, attr, url, pageDomain);
      extracted.forEach(resource => {
        if (!processedUrls.has(resource.url)) {
          resources.push(resource);
          processedUrls.add(resource.url);
        }
      });
    });

    return resources;
  } catch (error) {
    console.error('Resource analysis error:', error);
    throw new Error('Failed to analyze external resources');
  }
}

function extractResources(
  html: string,
  tag: string,
  attribute: string,
  baseUrl: string,
  pageDomain: string
): ResourceInfo[] {
  const pattern = new RegExp(`<${tag}[^>]*${attribute}=["']([^"']+)["'][^>]*>`, 'gi');
  const matches = [...html.matchAll(pattern)];
  
  return matches
    .map(match => {
      try {
        const resourceUrl = match[1];
        const fullUrl = resourceUrl.startsWith('http') ? 
          resourceUrl : 
          new URL(resourceUrl, baseUrl).toString();
        
        const resourceDomain = extractDomain(fullUrl);
        const isThirdParty = !resourceDomain.endsWith(pageDomain) && 
                            !pageDomain.endsWith(resourceDomain);

        return isThirdParty ? {
          domain: resourceDomain,
          type: tag,
          url: fullUrl,
          isThirdParty: true
        } : null;
      } catch {
        return null;
      }
    })
    .filter((resource): resource is ResourceInfo => resource !== null);
}