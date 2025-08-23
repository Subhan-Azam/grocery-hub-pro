import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, Package, Clock, CheckCircle, XCircle } from "lucide-react";

interface Order {
  id: number;
  orderNumber: string;
  customer: string;
  date: string;
  items: number;
  total: number;
  status: "Pending" | "Processing" | "Completed" | "Cancelled";
}

const initialOrders: Order[] = [
  { id: 1, orderNumber: "ORD-001", customer: "Alice Johnson", date: "2024-01-15", items: 5, total: 45.99, status: "Completed" },
  { id: 2, orderNumber: "ORD-002", customer: "Bob Smith", date: "2024-01-15", items: 3, total: 23.50, status: "Processing" },
  { id: 3, orderNumber: "ORD-003", customer: "Carol Davis", date: "2024-01-14", items: 8, total: 78.25, status: "Pending" },
  { id: 4, orderNumber: "ORD-004", customer: "David Wilson", date: "2024-01-14", items: 2, total: 15.99, status: "Completed" },
  { id: 5, orderNumber: "ORD-005", customer: "Emma Brown", date: "2024-01-13", items: 6, total: 52.75, status: "Cancelled" },
];

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = orders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case "Processing":
        return <Badge className="bg-info text-info-foreground"><Clock className="h-3 w-3 mr-1" />Processing</Badge>;
      case "Pending":
        return <Badge className="bg-warning text-warning-foreground"><Package className="h-3 w-3 mr-1" />Pending</Badge>;
      case "Cancelled":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "Completed":
        return CheckCircle;
      case "Processing":
        return Clock;
      case "Pending":
        return Package;
      case "Cancelled":
        return XCircle;
      default:
        return Package;
    }
  };

  const statusCounts = {
    Pending: orders.filter(o => o.status === "Pending").length,
    Processing: orders.filter(o => o.status === "Processing").length,
    Completed: orders.filter(o => o.status === "Completed").length,
    Cancelled: orders.filter(o => o.status === "Cancelled").length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">Order Management</h2>
        <p className="text-muted-foreground">
          Track and manage customer orders and their status
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {Object.entries(statusCounts).map(([status, count]) => {
          const IconComponent = getStatusIcon(status as Order["status"]);
          return (
            <Card key={status}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{status} Orders</CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}</div>
                <p className="text-xs text-muted-foreground">
                  {((count / orders.length) * 100).toFixed(1)}% of total
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders by number or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>${order.total}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;