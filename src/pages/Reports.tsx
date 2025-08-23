import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  FileText, 
  Calendar, 
  TrendingUp,
  Package,
  DollarSign,
  Users,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Reports = () => {
  const { toast } = useToast();

  const handleDownloadReport = (reportName: string) => {
    toast({
      title: "Report Downloaded",
      description: `${reportName} has been downloaded successfully.`,
    });
  };

  const reportTypes = [
    {
      id: 1,
      name: "Sales Report",
      description: "Comprehensive sales analysis and trends",
      icon: DollarSign,
      lastGenerated: "2024-01-15",
      status: "Ready",
      frequency: "Daily"
    },
    {
      id: 2,
      name: "Inventory Report",
      description: "Stock levels and product movement analysis",
      icon: Package,
      lastGenerated: "2024-01-15",
      status: "Ready",
      frequency: "Weekly"
    },
    {
      id: 3,
      name: "Customer Analytics",
      description: "Customer behavior and purchase patterns",
      icon: Users,
      lastGenerated: "2024-01-14",
      status: "Generating",
      frequency: "Monthly"
    },
    {
      id: 4,
      name: "Performance Report",
      description: "Overall business performance metrics",
      icon: TrendingUp,
      lastGenerated: "2024-01-13",
      status: "Ready",
      frequency: "Monthly"
    },
  ];

  const recentReports = [
    { name: "Daily Sales Summary - Jan 15", date: "2024-01-15", size: "2.3 MB" },
    { name: "Weekly Inventory Report - Week 2", date: "2024-01-14", size: "1.8 MB" },
    { name: "Monthly Performance - December", date: "2024-01-01", size: "4.1 MB" },
    { name: "Customer Analytics - Q4 2023", date: "2023-12-31", size: "3.2 MB" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Ready":
        return <Badge className="bg-success text-success-foreground">Ready</Badge>;
      case "Generating":
        return <Badge className="bg-warning text-warning-foreground">Generating</Badge>;
      case "Error":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">Reports & Analytics</h2>
        <p className="text-muted-foreground">
          Generate and download detailed business reports
        </p>
      </div>

      {/* Report Generation */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Generate Reports</h3>
          {reportTypes.map((report) => {
            const IconComponent = report.icon;
            return (
              <Card key={report.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{report.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                      </div>
                    </div>
                    {getStatusBadge(report.status)}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {report.lastGenerated}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {report.frequency}
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleDownloadReport(report.name)}
                      disabled={report.status === "Generating"}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Recent Reports</h3>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Downloaded Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentReports.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{report.name}</p>
                      <p className="text-xs text-muted-foreground">{report.date} • {report.size}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;