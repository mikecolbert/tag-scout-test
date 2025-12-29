import type { Express } from "express";
import { createServer, type Server } from "http";
import { analyzeRequestSchema } from "@shared/schema";
import type {
  SeoAnalysisResult,
  TagAnalysis,
  SeoRecommendation,
  MetaTag,
} from "@shared/schema";

const MAX_CONTENT_LENGTH = 5 * 1024 * 1024; // 5MB limit
const FETCH_TIMEOUT = 15000; // 15 second timeout

async function fetchAndParseHtml(url: string): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; SEOMetaChecker/1.0; +https://seo-checker.app)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      redirect: "follow",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }

    const contentLength = response.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_CONTENT_LENGTH) {
      throw new Error("Page content is too large to analyze");
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      throw new Error("URL does not return HTML content");
    }

    const text = await response.text();
    
    if (text.length > MAX_CONTENT_LENGTH) {
      throw new Error("Page content is too large to analyze");
    }

    return text;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out. The website took too long to respond.");
    }
    throw error;
  }
}

function extractMetaContent(html: string, selectors: { name?: string; property?: string }): string | null {
  const { name, property } = selectors;

  if (property) {
    const propertyRegex = new RegExp(
      `<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["'][^>]*>|<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${property}["'][^>]*>`,
      "i"
    );
    const match = html.match(propertyRegex);
    if (match) return match[1] || match[2] || null;
  }

  if (name) {
    const nameRegex = new RegExp(
      `<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["'][^>]*>|<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${name}["'][^>]*>`,
      "i"
    );
    const match = html.match(nameRegex);
    if (match) return match[1] || match[2] || null;
  }

  return null;
}

function extractTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return match ? match[1].trim() : null;
}

function extractCharset(html: string): string | null {
  const charsetMatch = html.match(/<meta[^>]*charset=["']?([^"'\s>]+)["']?[^>]*>/i);
  if (charsetMatch) return charsetMatch[1];

  const contentTypeMatch = html.match(
    /<meta[^>]*http-equiv=["']Content-Type["'][^>]*content=["'][^"']*charset=([^"'\s;]+)[^"']*["'][^>]*>/i
  );
  return contentTypeMatch ? contentTypeMatch[1] : null;
}

function analyzeTag(
  name: string,
  label: string,
  content: string | null,
  options: {
    required?: boolean;
    optimalMin?: number;
    optimalMax?: number;
  } = {}
): TagAnalysis {
  const { required = false, optimalMin, optimalMax } = options;
  const characterCount = content?.length || 0;

  let status: TagAnalysis["status"] = "success";
  let message = "";

  if (!content) {
    status = required ? "error" : "missing";
    message = required ? "This tag is required but missing" : "This tag is not set";
  } else if (optimalMin && characterCount < optimalMin) {
    status = "warning";
    message = `Too short. Recommended: ${optimalMin}-${optimalMax} characters`;
  } else if (optimalMax && characterCount > optimalMax) {
    status = "warning";
    message = `Too long. May be truncated. Recommended: ${optimalMin}-${optimalMax} characters`;
  } else {
    message = optimalMax
      ? `Good length (${characterCount}/${optimalMax} characters)`
      : "Properly configured";
  }

  return {
    name,
    label,
    content,
    status,
    characterCount,
    optimalMin,
    optimalMax,
    message,
    required,
  };
}

function generateRecommendations(tags: SeoAnalysisResult["tags"]): SeoRecommendation[] {
  const recommendations: SeoRecommendation[] = [];

  if (!tags.title.content) {
    recommendations.push({
      id: "missing-title",
      severity: "critical",
      title: "Missing page title",
      description:
        "The title tag is essential for SEO and social sharing. It appears in search results and browser tabs.",
      suggestedValue: "<title>Your Page Title | Brand Name</title>",
    });
  } else if (tags.title.characterCount > 60) {
    recommendations.push({
      id: "title-too-long",
      severity: "warning",
      title: "Title may be truncated",
      description:
        "Search engines typically display 50-60 characters. Consider shortening your title.",
      currentValue: tags.title.content,
      suggestedValue: tags.title.content.substring(0, 57) + "...",
    });
  }

  if (!tags.description.content) {
    recommendations.push({
      id: "missing-description",
      severity: "critical",
      title: "Missing meta description",
      description:
        "Meta descriptions provide a summary for search engines. They influence click-through rates from search results.",
      suggestedValue:
        '<meta name="description" content="A compelling description of your page in 150-160 characters." />',
    });
  } else if (tags.description.characterCount > 160) {
    recommendations.push({
      id: "description-too-long",
      severity: "warning",
      title: "Description may be truncated",
      description:
        "Search engines typically display 150-160 characters. Consider shortening your description.",
      currentValue: tags.description.content,
    });
  }

  if (!tags.ogTitle.content && !tags.ogDescription.content && !tags.ogImage.content) {
    recommendations.push({
      id: "missing-og-tags",
      severity: "warning",
      title: "Missing Open Graph tags",
      description:
        "Open Graph tags control how your content appears when shared on Facebook, LinkedIn, and other platforms.",
      suggestedValue: `<meta property="og:title" content="Your Title" />
<meta property="og:description" content="Your description" />
<meta property="og:image" content="https://example.com/image.jpg" />`,
    });
  }

  if (!tags.ogImage.content) {
    recommendations.push({
      id: "missing-og-image",
      severity: "suggestion",
      title: "No Open Graph image set",
      description:
        "Adding an og:image makes your content more visually appealing when shared on social media. Recommended size: 1200x630 pixels.",
      suggestedValue:
        '<meta property="og:image" content="https://example.com/og-image.jpg" />',
    });
  }

  if (!tags.twitterCard.content) {
    recommendations.push({
      id: "missing-twitter-card",
      severity: "suggestion",
      title: "Missing Twitter Card meta tag",
      description:
        "Twitter Cards enhance how your content appears when shared on Twitter/X. Use 'summary_large_image' for maximum impact.",
      suggestedValue: '<meta name="twitter:card" content="summary_large_image" />',
    });
  }

  if (!tags.canonical.content) {
    recommendations.push({
      id: "missing-canonical",
      severity: "suggestion",
      title: "No canonical URL specified",
      description:
        "A canonical URL helps prevent duplicate content issues by specifying the preferred version of a page.",
      suggestedValue: '<link rel="canonical" href="https://example.com/your-page" />',
    });
  }

  if (!tags.viewport.content) {
    recommendations.push({
      id: "missing-viewport",
      severity: "warning",
      title: "Missing viewport meta tag",
      description:
        "The viewport tag is essential for responsive design and mobile-friendliness.",
      suggestedValue:
        '<meta name="viewport" content="width=device-width, initial-scale=1" />',
    });
  }

  return recommendations;
}

function calculateScore(tags: SeoAnalysisResult["tags"]): number {
  let score = 100;

  const tagWeights: Record<string, { weight: number; penalty: number }> = {
    title: { weight: 15, penalty: 5 },
    description: { weight: 15, penalty: 5 },
    canonical: { weight: 5, penalty: 0 },
    robots: { weight: 3, penalty: 0 },
    viewport: { weight: 8, penalty: 3 },
    charset: { weight: 4, penalty: 0 },
    ogTitle: { weight: 8, penalty: 2 },
    ogDescription: { weight: 8, penalty: 2 },
    ogImage: { weight: 10, penalty: 3 },
    ogUrl: { weight: 4, penalty: 0 },
    ogType: { weight: 3, penalty: 0 },
    ogSiteName: { weight: 3, penalty: 0 },
    twitterCard: { weight: 5, penalty: 0 },
    twitterTitle: { weight: 3, penalty: 0 },
    twitterDescription: { weight: 3, penalty: 0 },
    twitterImage: { weight: 3, penalty: 0 },
    twitterSite: { weight: 2, penalty: 0 },
  };

  for (const [key, tag] of Object.entries(tags)) {
    const weights = tagWeights[key];
    if (!weights) continue;

    if (tag.status === "error" || tag.status === "missing") {
      score -= weights.weight;
    } else if (tag.status === "warning") {
      score -= weights.penalty;
    }
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

function extractAllMetaTags(html: string, url: string): MetaTag[] {
  const tags: MetaTag[] = [];

  const title = extractTitle(html);
  if (title) {
    tags.push({ name: "title", content: title });
  }

  const charset = extractCharset(html);
  if (charset) {
    tags.push({ name: "charset", content: charset });
  }

  const metaRegex = /<meta[^>]+>/gi;
  const metas = html.match(metaRegex) || [];

  for (const meta of metas) {
    const nameMatch = meta.match(/name=["']([^"']+)["']/i);
    const propertyMatch = meta.match(/property=["']([^"']+)["']/i);
    const contentMatch = meta.match(/content=["']([^"']*)["']/i);

    if (nameMatch && contentMatch) {
      tags.push({ name: nameMatch[1], content: contentMatch[1] });
    } else if (propertyMatch && contentMatch) {
      tags.push({
        name: propertyMatch[1],
        content: contentMatch[1],
        property: propertyMatch[1],
      });
    }
  }

  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i);
  if (canonicalMatch) {
    tags.push({ name: "canonical", content: canonicalMatch[1] });
  }

  return tags;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/analyze", async (req, res) => {
    try {
      const parsed = analyzeRequestSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          error: "Invalid request",
          details: parsed.error.issues,
        });
      }

      const { url } = parsed.data;

      const html = await fetchAndParseHtml(url);

      const title = extractTitle(html);
      const description = extractMetaContent(html, { name: "description" });
      const canonical =
        html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)?.[1] ||
        null;
      const robots = extractMetaContent(html, { name: "robots" });
      const viewport = extractMetaContent(html, { name: "viewport" });
      const charset = extractCharset(html);

      const ogTitle = extractMetaContent(html, { property: "og:title" });
      const ogDescription = extractMetaContent(html, { property: "og:description" });
      const ogImage = extractMetaContent(html, { property: "og:image" });
      const ogUrl = extractMetaContent(html, { property: "og:url" });
      const ogType = extractMetaContent(html, { property: "og:type" });
      const ogSiteName = extractMetaContent(html, { property: "og:site_name" });

      const twitterCard = extractMetaContent(html, { name: "twitter:card" });
      const twitterTitle = extractMetaContent(html, { name: "twitter:title" });
      const twitterDescription = extractMetaContent(html, { name: "twitter:description" });
      const twitterImage = extractMetaContent(html, { name: "twitter:image" });
      const twitterSite = extractMetaContent(html, { name: "twitter:site" });

      const tags: SeoAnalysisResult["tags"] = {
        title: analyzeTag("title", "Title", title, {
          required: true,
          optimalMin: 30,
          optimalMax: 60,
        }),
        description: analyzeTag("description", "Meta Description", description, {
          required: true,
          optimalMin: 120,
          optimalMax: 160,
        }),
        canonical: analyzeTag("canonical", "Canonical URL", canonical),
        robots: analyzeTag("robots", "Robots", robots),
        viewport: analyzeTag("viewport", "Viewport", viewport, { required: true }),
        charset: analyzeTag("charset", "Character Set", charset || "UTF-8"),
        ogTitle: analyzeTag("ogTitle", "OG Title", ogTitle, {
          optimalMin: 30,
          optimalMax: 60,
        }),
        ogDescription: analyzeTag("ogDescription", "OG Description", ogDescription, {
          optimalMin: 80,
          optimalMax: 200,
        }),
        ogImage: analyzeTag("ogImage", "OG Image", ogImage),
        ogUrl: analyzeTag("ogUrl", "OG URL", ogUrl),
        ogType: analyzeTag("ogType", "OG Type", ogType),
        ogSiteName: analyzeTag("ogSiteName", "OG Site Name", ogSiteName),
        twitterCard: analyzeTag("twitterCard", "Twitter Card", twitterCard),
        twitterTitle: analyzeTag("twitterTitle", "Twitter Title", twitterTitle),
        twitterDescription: analyzeTag(
          "twitterDescription",
          "Twitter Description",
          twitterDescription
        ),
        twitterImage: analyzeTag("twitterImage", "Twitter Image", twitterImage),
        twitterSite: analyzeTag("twitterSite", "Twitter Site", twitterSite),
      };

      const recommendations = generateRecommendations(tags);
      const score = calculateScore(tags);
      const rawTags = extractAllMetaTags(html, url);

      const urlObj = new URL(url);
      const domain = urlObj.hostname;

      const result: SeoAnalysisResult = {
        url,
        fetchedAt: new Date().toISOString(),
        score,
        tags,
        recommendations,
        googlePreview: {
          title: title || ogTitle || "No title",
          url: url,
          description: description || ogDescription || "No description available",
        },
        facebookPreview: {
          title: ogTitle || title || "No title",
          description: ogDescription || description || "No description",
          image: ogImage,
          url,
          siteName: ogSiteName || domain,
          type: ogType || "website",
        },
        twitterPreview: {
          card: (twitterCard as any) || "summary_large_image",
          title: twitterTitle || ogTitle || title || "No title",
          description: twitterDescription || ogDescription || description || "No description",
          image: twitterImage || ogImage,
          site: twitterSite,
        },
        linkedinPreview: {
          title: ogTitle || title || "No title",
          description: ogDescription || description || "No description",
          image: ogImage,
          url,
          siteName: ogSiteName || domain,
        },
        rawTags,
      };

      res.json(result);
    } catch (error) {
      console.error("Analysis error:", error);
      const message =
        error instanceof Error ? error.message : "Failed to analyze URL";
      res.status(500).json({ error: message });
    }
  });

  return httpServer;
}
