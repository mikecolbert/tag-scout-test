import { CheckCircle2, AlertCircle, XCircle, MinusCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { TagAnalysis, TagStatus } from "@shared/schema";

interface TagCardProps {
  tag: TagAnalysis;
}

const statusConfig: Record<TagStatus, { icon: React.ReactNode; color: string; bgColor: string }> = {
  success: {
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/30",
  },
  warning: {
    icon: <AlertCircle className="h-4 w-4" />,
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
  },
  error: {
    icon: <XCircle className="h-4 w-4" />,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/30",
  },
  missing: {
    icon: <MinusCircle className="h-4 w-4" />,
    color: "text-muted-foreground",
    bgColor: "bg-muted/50",
  },
};

export function TagCard({ tag }: TagCardProps) {
  const config = statusConfig[tag.status];

  const getProgressValue = () => {
    if (!tag.optimalMax) return 100;
    return Math.min((tag.characterCount / tag.optimalMax) * 100, 100);
  };

  const getProgressColor = () => {
    if (tag.status === "success") return "bg-green-500";
    if (tag.status === "warning") return "bg-yellow-500";
    if (tag.status === "error") return "bg-red-500";
    return "bg-muted";
  };

  return (
    <Card className={`${config.bgColor} border-0`} data-testid={`card-tag-${tag.name}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className={config.color}>{config.icon}</span>
            <span className="font-medium text-sm">{tag.label}</span>
          </div>
          <div className="flex items-center gap-2">
            {tag.required ? (
              <Badge variant="secondary" className="text-xs">Required</Badge>
            ) : (
              <Badge variant="outline" className="text-xs">Recommended</Badge>
            )}
          </div>
        </div>

        {tag.content ? (
          <p className="text-sm text-foreground/80 mb-3 line-clamp-2 font-mono text-xs bg-background/50 p-2 rounded">
            {tag.content}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic mb-3">Not set</p>
        )}

        <div className="space-y-2">
          {tag.optimalMax && (
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-background/50 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${getProgressColor()}`}
                  style={{ width: `${getProgressValue()}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {tag.characterCount}/{tag.optimalMax}
              </span>
            </div>
          )}
          <p className={`text-xs ${config.color}`}>{tag.message}</p>
        </div>
      </CardContent>
    </Card>
  );
}
