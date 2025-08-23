import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Package,
  TrendingDown,
  Clock,
  Bell
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Alert {
  id: number;
  type: "Low Stock" | "Out of Stock" | "Expired" | "High Demand";
  product: string;
  message: string;
  severity: "High" | "Medium" | "Low";
  timestamp: string;
  resolved: boolean;
}

const initialAlerts: Alert[] = [
  {
    id: 1,
    type: "Low Stock",
    product: "Whole Milk 1L",
    message: "Stock level below minimum threshold (25 units remaining)",
    severity: "High",
    timestamp: "2024-01-15 09:30",
    resolved: false
  },
  {
    id: 2,
    type: "Out of Stock",
    product: "Brown Bread",
    message: "Product completely out of stock",
    severity: "High",
    timestamp: "2024-01-15 08:15",
    resolved: false
  },
  {
    id: 3,
    type: "High Demand",
    product: "Organic Bananas",
    message: "Unusually high demand detected (150% above average)",
    severity: "Medium",
    timestamp: "2024-01-14 16:45",
    resolved: false
  },
  {
    id: 4,
    type: "Low Stock",
    product: "Fresh Tomatoes",
    message: "Stock level below minimum threshold (35 units remaining)",
    severity: "Medium",
    timestamp: "2024-01-14 14:20",
    resolved: true
  },
  {
    id: 5,
    type: "Expired",
    product: "Greek Yogurt",
    message: "Products approaching expiration date",
    severity: "Low",
    timestamp: "2024-01-14 10:30",
    resolved: true
  }
];

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const { toast } = useToast();

  const unresolvedAlerts = alerts.filter(alert => !alert.resolved);
  const resolvedAlerts = alerts.filter(alert => alert.resolved);

  const getSeverityBadge = (severity: Alert["severity"]) => {
    switch (severity) {
      case "High":
        return <Badge variant="destructive">High</Badge>;
      case "Medium":
        return <Badge className="bg-warning text-warning-foreground">Medium</Badge>;
      case "Low":
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="secondary">{severity}</Badge>;
    }
  };

  const getTypeIcon = (type: Alert["type"]) => {
    switch (type) {
      case "Low Stock":
      case "Out of Stock":
        return Package;
      case "Expired":
        return Clock;
      case "High Demand":
        return TrendingDown;
      default:
        return AlertTriangle;
    }
  };

  const handleResolveAlert = (id: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, resolved: true } : alert
    ));
    toast({
      title: "Alert Resolved",
      description: "Alert has been marked as resolved.",
    });
  };

  const handleDismissAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    toast({
      title: "Alert Dismissed",
      description: "Alert has been removed.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">Alerts & Notifications</h2>
        <p className="text-muted-foreground">
          Monitor important alerts and system notifications
        </p>
      </div>

      {/* Alert Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{unresolvedAlerts.length}</div>
            <p className="text-xs text-muted-foreground">require attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {unresolvedAlerts.filter(a => a.severity === "High").length}
            </div>
            <p className="text-xs text-muted-foreground">critical alerts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{resolvedAlerts.length}</div>
            <p className="text-xs text-muted-foreground">alerts resolved</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Active Alerts ({unresolvedAlerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {unresolvedAlerts.map((alert) => {
            const IconComponent = getTypeIcon(alert.type);
            return (
              <div key={alert.id} className="flex items-start gap-4 p-4 rounded-lg border">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <IconComponent className="h-5 w-5 text-destructive" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{alert.type}: {alert.product}</h4>
                    {getSeverityBadge(alert.severity)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleResolveAlert(alert.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Resolve
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDismissAlert(alert.id)}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Dismiss
                  </Button>
                </div>
              </div>
            );
          })}
          {unresolvedAlerts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-success" />
              <p>No active alerts. Everything looks good!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resolved Alerts */}
      {resolvedAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              Resolved Alerts ({resolvedAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {resolvedAlerts.map((alert) => {
              const IconComponent = getTypeIcon(alert.type);
              return (
                <div key={alert.id} className="flex items-start gap-4 p-4 rounded-lg border opacity-60">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <IconComponent className="h-5 w-5 text-success" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{alert.type}: {alert.product}</h4>
                      <Badge className="bg-success text-success-foreground">Resolved</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Alerts;