import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Tags, AlertCircle, Share2, Code2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { UrlInput } from "@/components/url-input";
import { EmptyState } from "@/components/empty-state";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { TagCard } from "@/components/tag-card";
import { SeoScore } from "@/components/seo-score";
import { Recommendations } from "@/components/recommendations";
import { CodePreview } from "@/components/code-preview";
import { SocialPreviews } from "@/components/social-previews";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { SeoAnalysisResult } from "@shared/schema";

export default function Home() {
  const [result, setResult] = useState<SeoAnalysisResult | null>(null);
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest("POST", "/api/analyze", { url });
      return response.json() as Promise<SeoAnalysisResult>;
    },
    onSuccess: (data) => {
      setResult(data);
      toast({
        title: "Analysis complete",
        description: `Successfully analyzed ${data.url}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Analysis failed",
        description: error.message || "Failed to analyze the URL. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = (url: string) => {
    analyzeMutation.mutate(url);
  };

  const basicTags = result
    ? [
        result.tags.title,
        result.tags.description,
        result.tags.canonical,
        result.tags.robots,
        result.tags.viewport,
        result.tags.charset,
      ]
    : [];

  const ogTags = result
    ? [
        result.tags.ogTitle,
        result.tags.ogDescription,
        result.tags.ogImage,
        result.tags.ogUrl,
        result.tags.ogType,
        result.tags.ogSiteName,
      ]
    : [];

  const twitterTags = result
    ? [
        result.tags.twitterCard,
        result.tags.twitterTitle,
        result.tags.twitterDescription,
        result.tags.twitterImage,
        result.tags.twitterSite,
      ]
    : [];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <Tags className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">SEO Meta Checker</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Analyze meta tags & preview social cards
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <UrlInput onAnalyze={handleAnalyze} isLoading={analyzeMutation.isPending} />
        </div>

        {analyzeMutation.isError && (
          <Alert variant="destructive" className="mb-8" data-testid="alert-error">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {analyzeMutation.error?.message || "Failed to analyze the URL. Please check if the URL is valid and try again."}
            </AlertDescription>
          </Alert>
        )}

        {analyzeMutation.isPending && <LoadingSkeleton />}

        {!analyzeMutation.isPending && !result && !analyzeMutation.isError && (
          <EmptyState />
        )}

        {!analyzeMutation.isPending && result && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Analyzed:</span>
              <code className="bg-muted px-2 py-0.5 rounded text-foreground" data-testid="text-analyzed-url">
                {result.url}
              </code>
              <span className="text-xs">
                at {new Date(result.fetchedAt).toLocaleTimeString()}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <section>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Code2 className="h-5 w-5 text-muted-foreground" />
                    Basic Meta Tags
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {basicTags.map((tag) => (
                      <TagCard key={tag.name} tag={tag} />
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-muted-foreground" />
                    Open Graph Tags
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {ogTags.map((tag) => (
                      <TagCard key={tag.name} tag={tag} />
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <svg className="h-5 w-5 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    Twitter Card Tags
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {twitterTags.map((tag) => (
                      <TagCard key={tag.name} tag={tag} />
                    ))}
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <SeoScore score={result.score} />
                <Recommendations recommendations={result.recommendations} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CodePreview tags={result.rawTags} />
              <SocialPreviews result={result} />
            </div>
          </div>
        )}
      </main>

      <footer className="border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-muted-foreground">
            SEO Meta Tag Checker - Analyze and optimize your website's meta tags
          </p>
        </div>
      </footer>
    </div>
  );
}
