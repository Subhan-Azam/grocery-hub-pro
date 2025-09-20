import { useState } from "react";
import {
  Package,
  ShoppingCart,
  Users,
  // BarChart3,
  // Settings,
  Home,
  // TrendingUp,
  // AlertTriangle,
  History,
  LogOut,
  Calculator,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "POS System", url: "/pos", icon: Calculator },
  { title: "Products", url: "/products", icon: Package },
  { title: "Categories", url: "/categories", icon: ShoppingCart },
  { title: "Suppliers", url: "/suppliers", icon: Users },
  { title: "Orders", url: "/orders", icon: History },
  // { title: "Analytics", url: "/analytics", icon: BarChart3 },
  // { title: "Reports", url: "/reports", icon: TrendingUp },
  // { title: "Alerts", url: "/alerts", icon: AlertTriangle },
  // { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";
  const { signOut, user } = useAuth();

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar"
    >
      <SidebarContent className="bg-sidebar">
        <div className="px-3 py-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <Package className="h-6 w-6 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="text-lg font-semibold text-sidebar-foreground">
                  GroceryAdmin
                </h2>
                <p className="text-xs text-sidebar-foreground/60">
                  Inventory Management
                </p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">
            {!isCollapsed && "Main Navigation"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  >
                    <NavLink to={item.url} end={item.url === "/"}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user && (
          <div className="mt-auto p-3 border-t border-sidebar-border">
            <div className="mb-2 text-xs text-sidebar-foreground/60">
              {!isCollapsed && user.email}
            </div>
            <Button
              variant="ghost"
              size={isCollapsed ? "icon" : "default"}
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2">Sign Out</span>}
            </Button>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
