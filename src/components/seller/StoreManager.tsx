import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocalCache } from "@/hooks/useLocalCache";
import { type SellerStore, type StoreType, STORE_TYPES, STORE_TYPE_LABELS, STORE_TYPE_COLORS } from "@/data/storeTypes";
import { Plus, Store, Trash2, Package, Wrench, UtensilsCrossed, Shirt, X, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const storeTypeIcons: Record<StoreType, React.ReactNode> = {
  products: <Package className="h-5 w-5" />,
  services: <Wrench className="h-5 w-5" />,
  "food-drinks": <UtensilsCrossed className="h-5 w-5" />,
  fashion: <Shirt className="h-5 w-5" />,
};

export default function StoreManager() {
  const { data: stores, update: setStores } = useLocalCache<SellerStore[]>("riba_seller_stores", []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", type: "" as StoreType | "", description: "" });
  const { toast } = useToast();

  const handleCreate = () => {
    if (!form.name || !form.type) {
      toast({ title: "Missing fields", description: "Store name and type are required.", variant: "destructive" });
      return;
    }
    const newStore: SellerStore = {
      id: crypto.randomUUID(),
      name: form.name,
      type: form.type as StoreType,
      description: form.description,
      createdAt: new Date().toISOString(),
    };
    setStores((prev) => [...prev, newStore]);
    setForm({ name: "", type: "", description: "" });
    setDialogOpen(false);
    toast({ title: "Store created", description: `"${newStore.name}" has been added.` });
  };

  const handleDelete = (id: string) => {
    setStores((prev) => prev.filter((s) => s.id !== id));
    toast({ title: "Store removed" });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">My Stores</h2>
          <p className="text-xs text-muted-foreground">Create multiple stores under your brand.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="btn-profit">
              <Plus className="h-4 w-4 mr-1" /> New Store
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Store</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Store Name *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. My Fashion Corner" />
              </div>
              <div className="space-y-2">
                <Label>Store Type *</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as StoreType })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select store type" />
                  </SelectTrigger>
                  <SelectContent>
                    {STORE_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        <span className="flex items-center gap-2">
                          {storeTypeIcons[type]}
                          {STORE_TYPE_LABELS[type]}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="What does this store sell?" />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  <X className="h-4 w-4 mr-1" /> Cancel
                </Button>
                <Button className="btn-profit" onClick={handleCreate}>
                  <Save className="h-4 w-4 mr-1" /> Create Store
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {stores.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Store className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No stores yet. Create your first store to start selling!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {stores.map((store) => (
            <Card key={store.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {storeTypeIcons[store.type]}
                    <div>
                      <p className="text-sm font-medium">{store.name}</p>
                      <Badge variant="secondary" className={`text-xs mt-0.5 ${STORE_TYPE_COLORS[store.type]}`}>
                        {STORE_TYPE_LABELS[store.type]}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(store.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                {store.description && <p className="text-xs text-muted-foreground">{store.description}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
