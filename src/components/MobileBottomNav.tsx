import { Link, useLocation } from "react-router-dom";
import { Home, Search, PlusCircle, ShoppingBag, User } from "lucide-react";

const navItems = [
  { label: "Home", icon: Home, path: "/" },
  { label: "Browse", icon: Search, path: "/products" },
  { label: "Sell", icon: PlusCircle, path: "/seller/dashboard" },
  { label: "Orders", icon: ShoppingBag, path: "/buyer/dashboard" },
  { label: "Account", icon: User, path: "/buyer/dashboard" },
];

export function MobileBottomNav() {
  const location = useLocation();

  // Hide on certain pages
  const hiddenPaths = ["/login", "/signup", "/forgot-password", "/checkout"];
  if (hiddenPaths.some((p) => location.pathname.startsWith(p))) return null;
  // Hide on dashboard pages (they have their own nav)
  if (location.pathname.startsWith("/seller/") || location.pathname.startsWith("/buyer/")) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className={`h-5 w-5 ${item.label === "Sell" ? "h-6 w-6" : ""}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
