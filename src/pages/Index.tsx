import { StatsCards } from "@/components/stats-cards";
import { SalesChart } from "@/components/sales-chart";
import { RecentSales } from "@/components/recent-sales";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Package, ShoppingCart, TrendingUp, Loader2 } from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { useOrders } from "@/hooks/use-orders";
import { useSuppliers } from "@/hooks/use-suppliers";
import { useMemo } from "react";

const Index = () => {
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: orders = [], isLoading: ordersLoading } = useOrders();
  const { data: suppliers = [], isLoading: suppliersLoading } = useSuppliers();

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const activeSuppliers = suppliers.filter(s => s.is_active).length;
    
    return {
      revenue: totalRevenue,
      orders: totalOrders,
      products: totalProducts,
      suppliers: activeSuppliers
    };
  }, [orders, products, suppliers]);

  const isLoading = productsLoading || categoriesLoading || ordersLoading || suppliersLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome to your grocery store admin dashboard
          </p>
        </div>
      </div>

      <StatsCards stats={stats} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <SalesChart />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentSales orders={orders.slice(0, 5)} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;