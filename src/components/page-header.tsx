import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  categoryFilter?: {
    name: string;
    onClear: () => void;
  };
  children?: React.ReactNode;
}

export const PageHeader = ({
  title,
  subtitle,
  categoryFilter,
  children,
}: PageHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 className="text-3xl font-bold text-foreground">{title}</h2>
        <p className="text-muted-foreground">{subtitle}</p>
        {categoryFilter && (
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="flex items-center gap-1">
              Category: {categoryFilter.name}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={categoryFilter.onClear}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          </div>
        )}
      </div>
      {children}
    </div>
  );
};
