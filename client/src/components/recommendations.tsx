import { AlertTriangle, AlertCircle, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { SeoRecommendation } from "@shared/schema";

interface RecommendationsProps {
  recommendations: SeoRecommendation[];
}

const severityConfig = {
  critical: {
    icon: <AlertTriangle className="h-4 w-4" />,
    label: "Critical",
    variant: "destructive" as const,
  },
  warning: {
    icon: <AlertCircle className="h-4 w-4" />,
    label: "Warning",
    variant: "secondary" as const,
  },
  suggestion: {
    icon: <Lightbulb className="h-4 w-4" />,
    label: "Suggestion",
    variant: "outline" as const,
  },
};

export function Recommendations({ recommendations }: RecommendationsProps) {
  if (recommendations.length === 0) {
    return (
      <Card data-testid="card-recommendations">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-6 text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
              <Lightbulb className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm text-muted-foreground">
              Great job! No recommendations at this time.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const criticalCount = recommendations.filter((r) => r.severity === "critical").length;
  const warningCount = recommendations.filter((r) => r.severity === "warning").length;
  const suggestionCount = recommendations.filter((r) => r.severity === "suggestion").length;

  return (
    <Card data-testid="card-recommendations">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between gap-2 flex-wrap">
          Recommendations
          <div className="flex items-center gap-1.5">
            {criticalCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {criticalCount} Critical
              </Badge>
            )}
            {warningCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {warningCount} Warning
              </Badge>
            )}
            {suggestionCount > 0 && (
              <Badge variant="outline" className="text-xs">
                {suggestionCount} Tips
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Accordion type="multiple" className="w-full">
          {recommendations.map((rec) => {
            const config = severityConfig[rec.severity];
            return (
              <AccordionItem
                key={rec.id}
                value={rec.id}
                data-testid={`accordion-recommendation-${rec.id}`}
              >
                <AccordionTrigger className="text-sm hover:no-underline py-3">
                  <div className="flex items-center gap-2 text-left">
                    <Badge variant={config.variant} className="gap-1">
                      {config.icon}
                      {config.label}
                    </Badge>
                    <span>{rec.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm space-y-3">
                  <p className="text-muted-foreground">{rec.description}</p>
                  {rec.currentValue && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Current:
                      </p>
                      <code className="block text-xs bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 p-2 rounded font-mono">
                        {rec.currentValue}
                      </code>
                    </div>
                  )}
                  {rec.suggestedValue && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Suggested:
                      </p>
                      <code className="block text-xs bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 p-2 rounded font-mono">
                        {rec.suggestedValue}
                      </code>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}
