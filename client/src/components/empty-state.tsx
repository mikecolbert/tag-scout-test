import { Search, Code2, Eye, CheckCircle } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center" data-testid="empty-state">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <Search className="h-10 w-10 text-primary" />
        </div>
        <div className="absolute -right-2 -top-2 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-2">Enter a URL to analyze</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        Get instant feedback on your website's SEO meta tags and see how they appear on Google and social media platforms.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl">
        <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Code2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-medium text-sm">Tag Analysis</h3>
          <p className="text-xs text-muted-foreground text-center">
            Check all meta tags with status indicators
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card">
          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Eye className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="font-medium text-sm">Live Previews</h3>
          <p className="text-xs text-muted-foreground text-center">
            See how your site appears on social platforms
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card">
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="font-medium text-sm">SEO Score</h3>
          <p className="text-xs text-muted-foreground text-center">
            Get actionable recommendations
          </p>
        </div>
      </div>
    </div>
  );
}
