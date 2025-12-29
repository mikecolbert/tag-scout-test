import { z } from "zod";

// SEO Analysis Request Schema
export const analyzeRequestSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;

// Meta Tag Types
export interface MetaTag {
  name: string;
  content: string | null;
  property?: string;
}

export type TagStatus = "success" | "warning" | "error" | "missing";

export interface TagAnalysis {
  name: string;
  label: string;
  content: string | null;
  status: TagStatus;
  characterCount: number;
  optimalMin?: number;
  optimalMax?: number;
  message: string;
  required: boolean;
}

export interface SeoRecommendation {
  id: string;
  severity: "critical" | "warning" | "suggestion";
  title: string;
  description: string;
  currentValue?: string;
  suggestedValue?: string;
}

export interface SocialPreview {
  title: string;
  description: string;
  image: string | null;
  url: string;
  siteName?: string;
  type?: string;
}

export interface TwitterPreview {
  card: "summary" | "summary_large_image" | "app" | "player";
  title: string;
  description: string;
  image: string | null;
  site?: string;
  creator?: string;
}

export interface SeoAnalysisResult {
  url: string;
  fetchedAt: string;
  score: number;
  tags: {
    title: TagAnalysis;
    description: TagAnalysis;
    canonical: TagAnalysis;
    robots: TagAnalysis;
    viewport: TagAnalysis;
    charset: TagAnalysis;
    ogTitle: TagAnalysis;
    ogDescription: TagAnalysis;
    ogImage: TagAnalysis;
    ogUrl: TagAnalysis;
    ogType: TagAnalysis;
    ogSiteName: TagAnalysis;
    twitterCard: TagAnalysis;
    twitterTitle: TagAnalysis;
    twitterDescription: TagAnalysis;
    twitterImage: TagAnalysis;
    twitterSite: TagAnalysis;
  };
  recommendations: SeoRecommendation[];
  googlePreview: {
    title: string;
    url: string;
    description: string;
  };
  facebookPreview: SocialPreview;
  twitterPreview: TwitterPreview;
  linkedinPreview: SocialPreview;
  rawTags: MetaTag[];
}
