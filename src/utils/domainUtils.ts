export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.toLowerCase();
  } catch (error) {
    throw new Error('Invalid URL format');
  }
}

export function isThirdPartyDomain(domain: string, pageDomain: string): boolean {
  const normalizedDomain = domain.toLowerCase();
  const normalizedPageDomain = pageDomain.toLowerCase();
  
  return !normalizedDomain.endsWith(normalizedPageDomain) && 
         !normalizedPageDomain.endsWith(normalizedDomain);
}

export function normalizeDomain(domain: string): string {
  return domain.toLowerCase().replace(/^www\./, '');
}