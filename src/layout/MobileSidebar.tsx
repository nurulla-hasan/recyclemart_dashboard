"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Users,
  Megaphone,
  Layers,
  CreditCard,
  Headphones,
  Image,
  ShieldAlert,
  Ticket,
  ChevronRight,
  Asterisk,
  LogOut,
  PanelLeft,
} from "lucide-react";
import { cn, SuccessToast, ErrorToast } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { logOut } from "@/services/auth";


interface MenuItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string;
  expandable?: boolean;
  children?: { label: string; href: string }[];
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    title: "Admin Management",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/" },
      { icon: Users, label: "User Management", href: "/users" },
      { icon: Megaphone, label: "Ads Management", href: "/ads" },
      { icon: Layers, label: "Category & Subcategory", href: "/categories" },
      { icon: CreditCard, label: "Packages / Plans", href: "/packages" },
    ],
  },
  {
    title: "System Configuration",
    items: [
      { icon: Headphones, label: "Support Management", href: "/support" },
      { icon: Image, label: "Content Management", href: "/content" },
      { icon: ShieldAlert, label: "Admin & Roles", href: "/roles" },
      { icon: Ticket, label: "Lottery Management", href: "/lottery" },
    ],
  },
];

export default function MobileSidebar() {
  const [isMounted, setIsMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const isActive = (href: string) => pathname === href;

  const handleNavigation = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logOut();
      SuccessToast("Logged out successfully!");
      router.push("/auth/login");
      setOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
      ErrorToast("Failed to logout. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground hover:text-foreground hover:bg-muted">
          <PanelLeft className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72 bg-background border-r border-border">
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Asterisk className="w-5 h-5 text-background" />
            </div>
            <span className="text-foreground font-semibold text-lg">Analytics</span>
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto px-3 space-y-6 py-4 h-[calc(100vh-8rem)]">
          {menuGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-3">
                {group.title}
              </div>

              <div className="space-y-1">
                {group.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  const isExpanded = expandedItems.includes(item.label);
                  const active = isActive(item.href);
                  
                  return (
                    <div key={itemIndex}>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start transition-colors font-semibold text-base px-3",
                          active 
                            ? "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary" 
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                        onClick={() => {
                          if (item.expandable) {
                            toggleExpand(item.label);
                          } else {
                            handleNavigation(item.href);
                          }
                        }}
                      >
                        <Icon className="w-4 h-4 mr-3" />
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded">
                            {item.badge}
                          </span>
                        )}
                        {item.expandable && (
                          <ChevronRight 
                            className={cn(
                              "w-4 h-4 ml-auto transition-transform",
                              isExpanded && "rotate-90"
                            )} 
                          />
                        )}
                      </Button>

                      {item.children && isExpanded && (
                        <div className="ml-9 mt-1 space-y-1">
                          {item.children.map((child, childIndex) => (
                            <Button
                              key={childIndex}
                              variant="ghost"
                              className={cn(
                                "w-full justify-start text-sm font-medium px-3 py-1 h-8",
                                isActive(child.href)
                                  ? "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
                                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
                              )}
                              onClick={() => handleNavigation(child.href)}
                            >
                              {child.label}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-border absolute bottom-0 w-full bg-background">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted px-3 font-semibold text-base"
            onClick={handleLogout}
            disabled={isLoggingOut}
            loading={isLoggingOut}
            loadingText="Logging out..."
          >
            <LogOut className="w-4 h-4 mr-3" />
            <span>Log out</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
