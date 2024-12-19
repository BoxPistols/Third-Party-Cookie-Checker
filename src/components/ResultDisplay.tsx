import { AlertCircle, CheckCircle, ExternalLink } from "lucide-react";
import { CookieCheckResult } from "../types/types";

interface ResultDisplayProps {
  result: CookieCheckResult | null;
}

function isImageUrl(url: string): boolean {
  const imageExtensions = [
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".ico",
    ".webp",
    ".avif",
    ".bmp",
  ];

  const lowerUrl = url.toLowerCase();
  return imageExtensions.some(
    (ext) => lowerUrl.endsWith(ext) || lowerUrl.includes(ext + "?")
  );
}

// 除外すべきCDNドメインの判定
function isExcludedDomain(domain: string): boolean {
  const excludedDomains = [
    "fonts.googleapis.com",
    "fonts.gstatic.com",
    "ajax.googleapis.com",
    "cdnjs.cloudflare.com",
    "cdn.jsdelivr.net",
    "unpkg.com",
  ];

  return excludedDomains.some((excludedDomain) =>
    domain.toLowerCase().includes(excludedDomain)
  );
}

export function ResultDisplay({ result }: ResultDisplayProps) {
  if (!result) return null;

  // リソースのフィルタリング - 画像とCDNを除外
  const filteredResources = result.thirdPartyResources.filter(
    (resource) =>
      !isImageUrl(resource.url) && !isExcludedDomain(resource.domain)
  );

  const totalThirdParty = result.cookies.length + filteredResources.length;

  return (
    <div className="w-full max-w-2xl mt-8 bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        {totalThirdParty > 0 ? (
          <AlertCircle className="w-6 h-6 text-red-500" />
        ) : (
          <CheckCircle className="w-6 h-6 text-green-500" />
        )}
        <h2 className="text-xl font-semibold">
          {totalThirdParty > 0
            ? `${totalThirdParty} Third-Party Source${
                totalThirdParty > 1 ? "s" : ""
              } Detected`
            : "No Third-Party Sources Detected"}
        </h2>
      </div>

      <div className="flex items-center gap-2 text-gray-600 mb-4">
        <span>URL checked:</span>
        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          {result.url}
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {result.cookies.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-3">Third-Party Cookies:</h3>
          <div className="space-y-4">
            {result.cookies.map((cookie, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-lg border border-gray-100"
              >
                <p className="font-medium text-gray-800">
                  Domain: <span className="text-blue-600">{cookie.domain}</span>
                </p>
                <pre className="mt-2 text-sm text-gray-600 overflow-x-auto">
                  {cookie.raw}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredResources.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-3">Third-Party Resources:</h3>
          <div className="space-y-4">
            {filteredResources.map((resource, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-lg border border-gray-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-800">
                    Domain:{" "}
                    <span className="text-blue-600">{resource.domain}</span>
                  </p>
                  <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                    {resource.type}
                  </span>
                </div>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  {resource.url}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
