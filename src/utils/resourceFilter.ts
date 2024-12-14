import { ResourceInfo } from '../types/types';
import { essentialResources, resourceCategories } from './resourceCategories';
import { extractDomain } from './domainUtils';

export function filterThirdPartyResources(
  resources: ResourceInfo[],
  pageDomain: string
): ResourceInfo[] {
  return resources.filter(resource => {
    const domain = extractDomain(resource.url);
    
    // Essential resources are not considered third-party
    if (essentialResources.has(domain)) {
      return false;
    }

    // Static resources (images, fonts, etc.) are not considered tracking
    if (isStaticResource(resource.url)) {
      return false;
    }

    // Check if the resource is under site owner's control
    if (isFirstPartyResource(domain, pageDomain)) {
      return false;
    }

    // Categorize remaining resources
    const category = resourceCategories.get(domain);
    if (category) {
      resource.category = category;
    }

    return true;
  });
}

function isStaticResource(url: string): boolean {
  const staticExtensions = [
    '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico',
    '.woff', '.woff2', '.ttf', '.eot',
    '.css'
  ];
  
  return staticExtensions.some(ext => url.toLowerCase().endsWith(ext));
}

function isFirstPartyResource(resourceDomain: string, pageDomain: string): boolean {
  // Google Analytics and Tag Manager are considered first-party
  if (resourceDomain === 'google-analytics.com' || 
      resourceDomain === 'googletagmanager.com') {
    return true;
  }

  // Check if domain is a subdomain or same domain
  return resourceDomain === pageDomain || 
         resourceDomain.endsWith(`.${pageDomain}`) || 
         pageDomain.endsWith(`.${resourceDomain}`);
}