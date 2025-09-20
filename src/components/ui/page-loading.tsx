import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type PageType =
  | "products"
  | "categories"
  | "suppliers"
  | "orders"
  | "dashboard";

interface PageSkeletonProps {
  type: PageType;
}

export function PageSkeleton({ type }: PageSkeletonProps) {
  const renderHeader = () => (
    <div className="flex justify-between items-start mb-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      {(type === "products" ||
        type === "categories" ||
        type === "suppliers") && <Skeleton className="h-10 w-32" />}
    </div>
  );

  const renderStatsCards = () => {
    if (type === "orders") {
      // Orders page has 5 specific status cards in a horizontal layout
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-8 mb-1" />
                <Skeleton className="h-3 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (type === "dashboard") {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-7 w-16 mb-1" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    // Categories page has 3 stats cards
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-16 mb-1" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderSearchBar = () => (
    <div className="flex items-center space-x-2 mb-6">
      <div className="relative flex-1 max-w-sm">
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );

  const renderDataTable = () => {
    const columnConfig = {
      products: 8,
      categories: 5,
      suppliers: 8,
      orders: 8,
      dashboard: 6,
    };

    const columns = columnConfig[type];
    const rows = type === "categories" ? 4 : type === "dashboard" ? 3 : type === "orders" ? 6 : 5;

    return (
      <div className="space-y-6">
        <Card className="bg-card">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-32" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="border-b border-border">
                <div className="flex items-center px-4 py-3 space-x-4">
                  {Array.from({ length: columns }).map((_, i) => (
                    <div key={i} className="flex-1">
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                {Array.from({ length: rows }).map((_, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="border-b border-border last:border-b-0"
                  >
                    <div className="flex items-center px-4 py-4 space-x-4">
                      {Array.from({ length: columns }).map((_, colIndex) => (
                        <div key={colIndex} className="flex-1">
                          {type === "orders" && colIndex === columns - 3 ? (
                            // Status column for orders
                            <Skeleton className="h-6 w-20 rounded-full" />
                          ) : type === "orders" && colIndex === columns - 2 ? (
                            // Payment column for orders
                            <Skeleton className="h-6 w-12 rounded-full" />
                          ) : colIndex === columns - 1 ? (
                            // Actions column
                            <div className="flex space-x-2">
                              <Skeleton className="h-8 w-8 rounded" />
                            </div>
                          ) : colIndex === columns - 2 && type !== "orders" ? (
                            // Status column for other pages
                            <Skeleton className="h-6 w-16 rounded-full" />
                          ) : (
                            <Skeleton className="h-4 w-full max-w-[120px]" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderDashboardCharts = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mb-6">
      <Card className="col-span-4">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="pl-2">
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
      <Card className="col-span-3">
        <CardHeader>
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderLowStockAlert = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-40" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {renderHeader()}

      {(type === "categories" || type === "orders" || type === "dashboard") &&
        renderStatsCards()}

      {(type === "products" || type === "orders") && renderSearchBar()}

      {type === "dashboard" && renderDashboardCharts()}

      {type !== "dashboard" && renderDataTable()}

      {type === "dashboard" && renderLowStockAlert()}
    </div>
  );
}
