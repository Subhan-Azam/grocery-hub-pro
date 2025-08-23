import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const recentSales = [
  {
    id: 1,
    customer: "Olivia Martin",
    email: "olivia.martin@email.com",
    amount: "+$1,999.00",
    avatar: "OM",
  },
  {
    id: 2,
    customer: "Jackson Lee",
    email: "jackson.lee@email.com",
    amount: "+$39.00",
    avatar: "JL",
  },
  {
    id: 3,
    customer: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    amount: "+$299.00",
    avatar: "IN",
  },
  {
    id: 4,
    customer: "William Kim",
    email: "will@email.com",
    amount: "+$99.00",
    avatar: "WK",
  },
  {
    id: 5,
    customer: "Sofia Davis",
    email: "sofia.davis@email.com",
    amount: "+$39.00",
    avatar: "SD",
  },
]

export function RecentSales({ orders }: { orders: any[] }) {
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No recent sales
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order, index) => (
        <div key={order.id || index} className="flex items-center gap-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <span className="text-sm font-medium text-primary">
              {(order.customers?.first_name || "G")[0]}
            </span>
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium text-foreground">
              {order.customers 
                ? `${order.customers.first_name} ${order.customers.last_name}`
                : "Guest Customer"
              }
            </p>
            <p className="text-xs text-muted-foreground">
              {order.order_number}
            </p>
          </div>
          <div className="text-sm font-medium text-foreground">
            +${order.total_amount?.toFixed(2) || "0.00"}
          </div>
        </div>
      ))}
    </div>
  );
}