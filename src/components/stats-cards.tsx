import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  AlertTriangle 
} from "lucide-react"

interface StatsData {
  revenue: number
  orders: number
  products: number
  suppliers: number
}

interface StatCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ReactNode
  description?: string
}

function StatCard({ title, value, change, trend, icon, description }: StatCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="flex items-center gap-2 mt-2">
          <Badge 
            variant={trend === "up" ? "default" : "destructive"}
            className="flex items-center gap-1"
          >
            {trend === "up" ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {change}
          </Badge>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function StatsCards({ stats }: { stats: StatsData }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Revenue"
        value={`$${stats.revenue.toLocaleString()}`}
        change="+12.5%"
        trend="up"
        icon={<DollarSign className="h-4 w-4" />}
        description="from last month"
      />
      <StatCard
        title="Total Products"
        value={stats.products.toLocaleString()}
        change="+8.2%"
        trend="up"
        icon={<Package className="h-4 w-4" />}
        description="active products"
      />
      <StatCard
        title="Orders This Month"
        value={stats.orders.toLocaleString()}
        change="+23.1%"
        trend="up"
        icon={<ShoppingCart className="h-4 w-4" />}
        description="processed orders"
      />
      <StatCard
        title="Active Suppliers"
        value={stats.suppliers.toLocaleString()}
        change="-4.8%"
        trend="down"
        icon={<AlertTriangle className="h-4 w-4" />}
        description="currently active"
      />
    </div>
  )
}