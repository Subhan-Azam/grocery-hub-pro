import { StatsCards } from "@/components/stats-cards";
import { RecentSales } from "@/components/recent-sales";
import { SalesChart } from "@/components/sales-chart";

const Index = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">Dashboard Overview</h2>
        <p className="text-muted-foreground">
          Monitor your grocery store operations and key metrics
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Charts and Tables */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-1 md:col-span-2 lg:col-span-4">
          <SalesChart />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <RecentSales />
        </div>
      </div>
    </div>
  );
};

export default Index;
