import { useState } from "react";
import { Search, Loader2, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UrlInputProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

const exampleUrls = [
  "https://github.com",
  "https://vercel.com",
  "https://stripe.com",
];

export function UrlInput({ onAnalyze, isLoading }: UrlInputProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      let finalUrl = url.trim();
      if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
        finalUrl = "https://" + finalUrl;
      }
      onAnalyze(finalUrl);
    }
  };

  const handleExampleClick = (exampleUrl: string) => {
    setUrl(exampleUrl);
    onAnalyze(exampleUrl);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter website URL (e.g., example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="pl-10 h-12 text-base"
            data-testid="input-url"
          />
        </div>
        <Button
          type="submit"
          disabled={!url.trim() || isLoading}
          className="h-12 px-6"
          data-testid="button-analyze"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Search className="h-4 w-4 mr-2" />
          )}
          Analyze
        </Button>
      </form>

      <div className="flex flex-wrap items-center gap-2 justify-center">
        <span className="text-sm text-muted-foreground">Try:</span>
        {exampleUrls.map((exampleUrl) => (
          <Button
            key={exampleUrl}
            variant="outline"
            size="sm"
            onClick={() => handleExampleClick(exampleUrl)}
            disabled={isLoading}
            data-testid={`button-example-${exampleUrl.replace(/https?:\/\//, "").replace(/\./g, "-")}`}
          >
            {exampleUrl.replace("https://", "")}
          </Button>
        ))}
      </div>
    </div>
  );
}
