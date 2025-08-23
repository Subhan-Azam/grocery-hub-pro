import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Store, 
  Bell, 
  Shield, 
  Database,
  Save,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [notifications, setNotifications] = useState({
    lowStock: true,
    newOrders: true,
    systemUpdates: false,
    emailReports: true,
  });

  const [storeSettings, setStoreSettings] = useState({
    storeName: "Fresh Grocery Store",
    storeEmail: "admin@freshgrocery.com",
    storePhone: "+1-555-0123",
    lowStockThreshold: 25,
  });

  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    });
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground">
          Manage your store settings and preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Store Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Store Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="store-name">Store Name</Label>
              <Input 
                id="store-name" 
                value={storeSettings.storeName}
                onChange={(e) => setStoreSettings(prev => ({
                  ...prev,
                  storeName: e.target.value
                }))}
              />
            </div>
            <div>
              <Label htmlFor="store-email">Email Address</Label>
              <Input 
                id="store-email" 
                type="email"
                value={storeSettings.storeEmail}
                onChange={(e) => setStoreSettings(prev => ({
                  ...prev,
                  storeEmail: e.target.value
                }))}
              />
            </div>
            <div>
              <Label htmlFor="store-phone">Phone Number</Label>
              <Input 
                id="store-phone" 
                value={storeSettings.storePhone}
                onChange={(e) => setStoreSettings(prev => ({
                  ...prev,
                  storePhone: e.target.value
                }))}
              />
            </div>
            <div>
              <Label htmlFor="low-stock-threshold">Low Stock Threshold</Label>
              <Input 
                id="low-stock-threshold" 
                type="number"
                value={storeSettings.lowStockThreshold}
                onChange={(e) => setStoreSettings(prev => ({
                  ...prev,
                  lowStockThreshold: parseInt(e.target.value) || 0
                }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Low Stock Alerts</p>
                <p className="text-sm text-muted-foreground">Get notified when products are running low</p>
              </div>
              <Switch 
                checked={notifications.lowStock}
                onCheckedChange={() => handleNotificationChange('lowStock')}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New Order Notifications</p>
                <p className="text-sm text-muted-foreground">Alert for new customer orders</p>
              </div>
              <Switch 
                checked={notifications.newOrders}
                onCheckedChange={() => handleNotificationChange('newOrders')}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">System Updates</p>
                <p className="text-sm text-muted-foreground">Notifications about system updates</p>
              </div>
              <Switch 
                checked={notifications.systemUpdates}
                onCheckedChange={() => handleNotificationChange('systemUpdates')}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Reports</p>
                <p className="text-sm text-muted-foreground">Receive daily/weekly reports via email</p>
              </div>
              <Switch 
                checked={notifications.emailReports}
                onCheckedChange={() => handleNotificationChange('emailReports')}
              />
            </div>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Admin User</p>
                <p className="text-sm text-muted-foreground">admin@freshgrocery.com</p>
              </div>
              <Badge className="bg-success text-success-foreground">Active</Badge>
            </div>
            <Button variant="outline" className="w-full">
              Change Password
            </Button>
            <Button variant="outline" className="w-full">
              Update Profile
            </Button>
          </CardContent>
        </Card>

        {/* Security & Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-warning" />
                <p className="font-medium">Database Connection</p>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Connect to Supabase for authentication and data storage
              </p>
              <Button variant="outline" className="w-full">
                <Database className="h-4 w-4 mr-2" />
                Configure Database
              </Button>
            </div>
            <Button variant="outline" className="w-full">
              Export Data
            </Button>
            <Button variant="outline" className="w-full">
              Privacy Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="bg-gradient-primary hover:bg-primary-hover">
          <Save className="h-4 w-4 mr-2" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;