// Proxy service configuration
const PROXY_CONFIG = {
  baseUrl: "https://api.allorigins.win/get",
  params: {
    url: "",
    raw: false,
  },
};

export interface ProxyResponse {
  status: {
    http_code: number;
    content_type: string;
  };
  contents: string;
  headers?: Record<string, string>;
}

export async function fetchWithProxy(url: string): Promise<ProxyResponse> {
  const proxyUrl = new URL(PROXY_CONFIG.baseUrl);
  proxyUrl.searchParams.append("url", url);

  try {
    const response = await fetch(proxyUrl.toString());
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Proxy fetch error:", error);
    throw new Error("Failed to fetch website content");
  }
}
