import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { MetaTag } from "@shared/schema";

interface CodePreviewProps {
  tags: MetaTag[];
}

export function CodePreview({ tags }: CodePreviewProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const formatTag = (tag: MetaTag): string => {
    if (tag.property) {
      return `<meta property="${tag.property}" content="${tag.content || ""}" />`;
    }
    if (tag.name === "title") {
      return `<title>${tag.content || ""}</title>`;
    }
    if (tag.name === "charset") {
      return `<meta charset="${tag.content || "UTF-8"}" />`;
    }
    return `<meta name="${tag.name}" content="${tag.content || ""}" />`;
  };

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAllTags = async () => {
    const allTags = tags.map(formatTag).join("\n");
    await navigator.clipboard.writeText(allTags);
    setCopiedIndex(-1);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <Card data-testid="card-code-preview">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="text-lg">Meta Tags Code</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={copyAllTags}
            data-testid="button-copy-all"
          >
            {copiedIndex === -1 ? (
              <Check className="h-3 w-3 mr-1.5" />
            ) : (
              <Copy className="h-3 w-3 mr-1.5" />
            )}
            Copy All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded border bg-muted/30">
          <div className="p-4 space-y-1">
            {tags.map((tag, index) => {
              const formattedTag = formatTag(tag);
              return (
                <div
                  key={index}
                  className="group flex items-start gap-2 font-mono text-xs hover-elevate rounded px-2 py-1.5"
                  data-testid={`code-tag-${index}`}
                >
                  <span className="text-muted-foreground w-6 text-right shrink-0">
                    {index + 1}
                  </span>
                  <code className="flex-1 break-all">
                    <span className="text-blue-600 dark:text-blue-400">&lt;</span>
                    <span className="text-green-600 dark:text-green-400">
                      {tag.name === "title" ? "title" : "meta"}
                    </span>
                    {tag.property && (
                      <>
                        <span className="text-purple-600 dark:text-purple-400"> property</span>
                        <span className="text-foreground">=</span>
                        <span className="text-orange-600 dark:text-orange-400">"{tag.property}"</span>
                      </>
                    )}
                    {!tag.property && tag.name !== "title" && tag.name !== "charset" && (
                      <>
                        <span className="text-purple-600 dark:text-purple-400"> name</span>
                        <span className="text-foreground">=</span>
                        <span className="text-orange-600 dark:text-orange-400">"{tag.name}"</span>
                      </>
                    )}
                    {tag.name === "charset" ? (
                      <>
                        <span className="text-purple-600 dark:text-purple-400"> charset</span>
                        <span className="text-foreground">=</span>
                        <span className="text-orange-600 dark:text-orange-400">"{tag.content || "UTF-8"}"</span>
                      </>
                    ) : tag.name !== "title" && (
                      <>
                        <span className="text-purple-600 dark:text-purple-400"> content</span>
                        <span className="text-foreground">=</span>
                        <span className="text-orange-600 dark:text-orange-400">"{tag.content || ""}"</span>
                      </>
                    )}
                    {tag.name === "title" ? (
                      <>
                        <span className="text-blue-600 dark:text-blue-400">&gt;</span>
                        <span className="text-foreground">{tag.content}</span>
                        <span className="text-blue-600 dark:text-blue-400">&lt;/title&gt;</span>
                      </>
                    ) : (
                      <span className="text-blue-600 dark:text-blue-400"> /&gt;</span>
                    )}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    onClick={() => copyToClipboard(formattedTag, index)}
                    data-testid={`button-copy-tag-${index}`}
                  >
                    {copiedIndex === index ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
