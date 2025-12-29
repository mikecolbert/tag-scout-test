import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiGoogle, SiFacebook, SiLinkedin } from "react-icons/si";
import { Image as ImageIcon } from "lucide-react";
import type { SeoAnalysisResult } from "@shared/schema";

interface SocialPreviewsProps {
  result: SeoAnalysisResult;
}

function GooglePreview({ preview }: { preview: SeoAnalysisResult["googlePreview"] }) {
  const displayUrl = preview.url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <div className="max-w-2xl bg-background rounded-lg p-4" data-testid="preview-google">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
            <span className="text-xs font-medium">
              {displayUrl.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{displayUrl}</p>
            <p className="text-xs text-muted-foreground truncate max-w-md">
              {preview.url}
            </p>
          </div>
        </div>
        <h3 className="text-xl text-blue-600 dark:text-blue-400 hover:underline cursor-pointer line-clamp-1">
          {preview.title || "No title set"}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {preview.description || "No description set"}
        </p>
      </div>
    </div>
  );
}

function FacebookPreview({ preview }: { preview: SeoAnalysisResult["facebookPreview"] }) {
  return (
    <div className="max-w-lg" data-testid="preview-facebook">
      <div className="border rounded-lg overflow-hidden bg-card">
        <div className="aspect-[1.91/1] bg-muted flex items-center justify-center">
          {preview.image ? (
            <img
              src={preview.image}
              alt="OG Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                (e.target as HTMLImageElement).parentElement!.innerHTML =
                  '<div class="flex flex-col items-center justify-center h-full text-muted-foreground"><svg class="h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><span class="text-sm">No image set</span></div>';
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <ImageIcon className="h-12 w-12 mb-2" />
              <span className="text-sm">No image set</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-card-foreground/5">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            {preview.url.replace(/^https?:\/\//, "").split("/")[0]}
          </p>
          <h3 className="font-semibold text-foreground line-clamp-2 mt-1">
            {preview.title || "No title set"}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
            {preview.description || "No description set"}
          </p>
        </div>
      </div>
    </div>
  );
}

function TwitterPreview({ preview }: { preview: SeoAnalysisResult["twitterPreview"] }) {
  const isLargeCard = preview.card === "summary_large_image";

  return (
    <div className="max-w-lg" data-testid="preview-twitter">
      <div className="border rounded-2xl overflow-hidden bg-card">
        {isLargeCard ? (
          <>
            <div className="aspect-[2/1] bg-muted flex items-center justify-center">
              {preview.image ? (
                <img
                  src={preview.image}
                  alt="Twitter Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mb-2" />
                  <span className="text-sm">No image set</span>
                </div>
              )}
            </div>
            <div className="p-3">
              <h3 className="font-medium text-foreground line-clamp-1">
                {preview.title || "No title set"}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                {preview.description || "No description set"}
              </p>
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656L13.07 5.274" />
                </svg>
                {preview.site?.replace("@", "") || "website.com"}
              </p>
            </div>
          </>
        ) : (
          <div className="flex">
            <div className="w-32 h-32 shrink-0 bg-muted flex items-center justify-center">
              {preview.image ? (
                <img
                  src={preview.image}
                  alt="Twitter Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="p-3 flex flex-col justify-center">
              <h3 className="font-medium text-foreground line-clamp-1 text-sm">
                {preview.title || "No title set"}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                {preview.description || "No description set"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {preview.site?.replace("@", "") || "website.com"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LinkedInPreview({ preview }: { preview: SeoAnalysisResult["linkedinPreview"] }) {
  return (
    <div className="max-w-lg" data-testid="preview-linkedin">
      <div className="border rounded-lg overflow-hidden bg-card">
        <div className="aspect-[1.91/1] bg-muted flex items-center justify-center">
          {preview.image ? (
            <img
              src={preview.image}
              alt="LinkedIn Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <ImageIcon className="h-12 w-12 mb-2" />
              <span className="text-sm">No image set</span>
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-foreground line-clamp-2">
            {preview.title || "No title set"}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {preview.url.replace(/^https?:\/\//, "").split("/")[0]}
          </p>
        </div>
      </div>
    </div>
  );
}

export function SocialPreviews({ result }: SocialPreviewsProps) {
  return (
    <Card data-testid="card-social-previews">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Social & Search Previews</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="google" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="google" className="gap-2" data-testid="tab-google">
              <SiGoogle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Google</span>
            </TabsTrigger>
            <TabsTrigger value="facebook" className="gap-2" data-testid="tab-facebook">
              <SiFacebook className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Facebook</span>
            </TabsTrigger>
            <TabsTrigger value="twitter" className="gap-2" data-testid="tab-twitter">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="hidden sm:inline">X/Twitter</span>
            </TabsTrigger>
            <TabsTrigger value="linkedin" className="gap-2" data-testid="tab-linkedin">
              <SiLinkedin className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">LinkedIn</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="google" className="mt-0">
            <div className="bg-muted/30 rounded-lg p-6">
              <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wide">
                How it appears in Google Search results
              </p>
              <GooglePreview preview={result.googlePreview} />
            </div>
          </TabsContent>

          <TabsContent value="facebook" className="mt-0">
            <div className="bg-muted/30 rounded-lg p-6">
              <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wide">
                How it appears when shared on Facebook
              </p>
              <FacebookPreview preview={result.facebookPreview} />
            </div>
          </TabsContent>

          <TabsContent value="twitter" className="mt-0">
            <div className="bg-muted/30 rounded-lg p-6">
              <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wide">
                How it appears when shared on X (Twitter)
              </p>
              <TwitterPreview preview={result.twitterPreview} />
            </div>
          </TabsContent>

          <TabsContent value="linkedin" className="mt-0">
            <div className="bg-muted/30 rounded-lg p-6">
              <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wide">
                How it appears when shared on LinkedIn
              </p>
              <LinkedInPreview preview={result.linkedinPreview} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
