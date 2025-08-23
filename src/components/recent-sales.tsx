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

export function RecentSales() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Sales</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentSales.map((sale) => (
          <div key={sale.id} className="flex items-center gap-4">
            <Avatar className="h-9 w-9">
              <AvatarImage src="" alt={sale.customer} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {sale.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium text-foreground">
                {sale.customer}
              </p>
              <p className="text-xs text-muted-foreground">
                {sale.email}
              </p>
            </div>
            <div className="text-sm font-medium text-foreground">
              {sale.amount}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}