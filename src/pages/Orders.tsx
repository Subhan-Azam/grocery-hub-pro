import { useState, useMemo } from "react";
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
import {
  Search,
  Eye,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { useOrders } from "@/hooks/use-orders";
import { PageSkeleton } from "@/components/ui/page-loading";
import { useLoadingDelay } from "@/hooks/use-loading-delay";

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: orders = [], isLoading: ordersLoading, error } = useOrders();

  // Use loading delay to prevent flash of loading states
  const isLoading = useLoadingDelay({ isActuallyLoading: ordersLoading });

  const filteredOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customers &&
          `${order.customers.first_name} ${order.customers.last_name}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
    );
  }, [orders, searchTerm]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return (
          <Badge className="bg-success text-success-foreground">
            <CheckCircle className="h-3 w-3 mr-1" />
            Delivered
          </Badge>
        );
      case "shipped":
        return (
          <Badge className="bg-info text-info-foreground">
            <Clock className="h-3 w-3 mr-1" />
            Shipped
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-info text-info-foreground">
            <Clock className="h-3 w-3 mr-1" />
            Processing
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-warning text-warning-foreground">
            <Package className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return CheckCircle;
      case "shipped":
        return Clock;
      case "processing":
        return Clock;
      case "pending":
        return Package;
      case "cancelled":
        return XCircle;
      default:
        return Package;
    }
  };

  if (isLoading) {
    return <PageSkeleton type="orders" />;
  }

  if (error) {
    return (
      <div className="text-center text-destructive p-8">
        Error loading orders: {error.message}
      </div>
    );
  }

  const statusCounts = {
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
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
      <div className="grid gap-4 md:grid-cols-5">
        {Object.entries(statusCounts).map(([status, count]) => {
          const IconComponent = getStatusIcon(status);
          return (
            <Card key={status}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium capitalize">
                  {status} Orders
                </CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}</div>
                <p className="text-xs text-muted-foreground">
                  {orders.length > 0
                    ? ((count / orders.length) * 100).toFixed(1)
                    : 0}
                  % of total
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
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm
                ? "No orders found matching your search."
                : "No orders available yet."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {order.order_number}
                    </TableCell>
                    <TableCell>
                      {order.customers
                        ? `${order.customers.first_name} ${order.customers.last_name}`
                        : "Guest Customer"}
                    </TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{order.order_items?.length || 0}</TableCell>
                    <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.payment_status === "paid"
                            ? "default"
                            : order.payment_status === "failed"
                            ? "destructive"
                            : "secondary"
                        }
                        className={
                          order.payment_status === "paid"
                            ? "bg-success text-success-foreground"
                            : ""
                        }
                      >
                        {order.payment_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
