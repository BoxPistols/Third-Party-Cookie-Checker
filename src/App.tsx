import { useState } from "react";
import { Globe } from "lucide-react";
import { CheckerForm } from "./components/CheckerForm";
import { ResultDisplay } from "./components/ResultDisplay";
import { checkThirdPartyCookies } from "./utils/cookieChecker";
import { CookieCheckResult } from "./types/types";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CookieCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (url: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const checkResult = await checkThirdPartyCookies(url);
      setResult(checkResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Globe className="w-16 h-16 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Third-Party Cookie Checker
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter a website URL to check if it uses third-party cookies and get
            detailed information about their usage.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <CheckerForm onSubmit={handleSubmit} isLoading={isLoading} />

          {isLoading && (
            <div className="text-gray-600">
              Checking for third-party cookies...
            </div>
          )}

          {error && (
            <div className="text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>
          )}

          <ResultDisplay result={result} />
        </div>
      </div>
    </div>
  );
}

export default App;
