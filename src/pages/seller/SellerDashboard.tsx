import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { formatNaira } from "@/data/mock";
import { mockOrders, sellerProducts } from "@/data/mockExtended";
import {
  BarChart3, Package, ShoppingCart, Users, DollarSign,
  Plus, Search, Home, Settings, Menu,
  Edit, Trash2, BookOpen, Store,
} from "lucide-react";
import SellerProfileSettings from "@/components/seller/SellerProfileSettings";
import CatalogueManager from "@/components/seller/CatalogueManager";
import StoreManager from "@/components/seller/StoreManager";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useLocalCache } from "@/hooks/useLocalCache";
import { type SellerStore, STORE_TYPE_LABELS } from "@/data/storeTypes";

const revenueData = [
  { month: "Jul", revenue: 120000 },
  { month: "Aug", revenue: 180000 },
  { month: "Sep", revenue: 250000 },
  { month: "Oct", revenue: 320000 },
  { month: "Nov", revenue: 280000 },
  { month: "Dec", revenue: 450000 },
  { month: "Jan", revenue: 380000 },
];

const stats = [
  { label: "Total Sales", value: "₦2.4M", icon: DollarSign, change: "+12%" },
  { label: "Active Products", value: "24", icon: Package, change: "+3" },
  { label: "Pending Orders", value: "8", icon: ShoppingCart, change: "-2" },
  { label: "Customers", value: "156", icon: Users, change: "+18" },
];

const statusColors: Record<string, string> = {
  pending: "status-pending",
  processing: "category-product",
  shipped: "category-service",
  delivered: "status-active",
  cancelled: "bg-destructive/10 text-destructive",
};

const navItems = [
  { label: "Overview", icon: BarChart3, tab: "overview" },
  { label: "Orders", icon: ShoppingCart, tab: "orders" },
  { label: "Products", icon: Package, tab: "products" },
  { label: "Stores", icon: Store, tab: "stores" },
  { label: "Catalogue", icon: BookOpen, tab: "catalogue" },
  { label: "Settings", icon: Settings, tab: "settings" },
];

function SideNav({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (t: string) => void }) {
  return (
    <div className="flex flex-col h-full">
      <Link to="/" className="flex items-center gap-2 p-4 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-profit">
          <span className="text-sm font-bold text-white">R</span>
        </div>
        <span className="font-bold">Seller Hub</span>
      </Link>
      <nav className="flex-1 space-y-1 px-2">
        {navItems.map((item) => (
          <button
            key={item.tab}
            onClick={() => setActiveTab(item.tab)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === item.tab ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t">
        <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <Home className="h-4 w-4" /> Back to Marketplace
        </Link>
      </div>
    </div>
  );
}

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: stores } = useLocalCache<SellerStore[]>("riba_seller_stores", []);
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 border-r bg-card flex-col shrink-0">
        <SideNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-60 p-0">
                <SideNav activeTab={activeTab} setActiveTab={(t) => { setActiveTab(t); setMobileOpen(false); }} />
              </SheetContent>
            </Sheet>
            <h1 className="text-lg font-semibold capitalize">{activeTab}</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">T</div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <Card key={stat.label}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <stat.icon className="h-5 w-5 text-primary" />
                        <span className="text-xs text-primary font-medium">{stat.change}</span>
                      </div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
                        <Tooltip formatter={(value: number) => formatNaira(value)} />
                        <Line type="monotone" dataKey="revenue" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={{ fill: "hsl(142, 71%, 45%)" }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">Recent Orders</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab("orders")}>View all</Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockOrders.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                          <div>
                            <p className="text-sm font-medium">{order.orderNumber}</p>
                            <p className="text-xs text-muted-foreground">{order.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{formatNaira(order.total)}</p>
                            <Badge variant="secondary" className={`text-xs ${statusColors[order.status]}`}>{order.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">Top Products</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab("products")}>View all</Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {sellerProducts.slice(0, 3).map((p) => (
                        <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                          <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.sales} sales</p>
                          </div>
                          <span className="text-sm font-medium text-primary">{formatNaira(p.price)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">All Orders</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search..." className="pl-8 h-9 w-48" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{formatNaira(order.total)}</TableCell>
                        <TableCell><Badge variant="secondary" className={`text-xs ${statusColors[order.status]}`}>{order.status}</Badge></TableCell>
                        <TableCell className="text-muted-foreground">{order.paymentMethod}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {activeTab === "products" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Products</CardTitle>
                <Button size="sm" className="btn-profit"><Plus className="h-4 w-4 mr-1" /> Add Product</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Inventory</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sales</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sellerProducts.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                            <span className="font-medium text-sm">{p.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{p.category}</TableCell>
                        <TableCell className="text-primary font-medium">{formatNaira(p.price)}</TableCell>
                        <TableCell>{p.inventory}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`text-xs ${
                            p.status === "active" ? "status-active" : p.status === "draft" ? "status-pending" : "bg-destructive/10 text-destructive"
                          }`}>
                            {p.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{p.sales}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {activeTab === "stores" && <StoreManager />}

          {activeTab === "catalogue" && (
            <div className="space-y-4">
              {stores.length > 0 && (
                <div className="flex items-center gap-3">
                  <Label className="text-sm font-medium whitespace-nowrap">Select Store:</Label>
                  <Select value={selectedStoreId} onValueChange={setSelectedStoreId}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Choose a store" />
                    </SelectTrigger>
                    <SelectContent>
                      {stores.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name} ({STORE_TYPE_LABELS[s.type]})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {stores.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Store className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Create a store first to manage its catalogue.</p>
                    <Button size="sm" className="btn-profit mt-3" onClick={() => setActiveTab("stores")}>
                      <Plus className="h-4 w-4 mr-1" /> Create Store
                    </Button>
                  </CardContent>
                </Card>
              ) : !selectedStoreId ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Select a store above to manage its catalogue.</p>
                  </CardContent>
                </Card>
              ) : (
                <CatalogueManager storeId={selectedStoreId} />
              )}
            </div>
          )}

          {activeTab === "settings" && <SellerProfileSettings />}
        </main>
      </div>
    </div>
  );
}
