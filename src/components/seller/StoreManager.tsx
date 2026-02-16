import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocalCache } from "@/hooks/useLocalCache";
import { type SellerCatalogue, type CatalogueCategory, CATALOGUE_CATEGORIES, CATALOGUE_CATEGORY_LABELS, CATALOGUE_CATEGORY_COLORS } from "@/data/storeTypes";
import { Plus, BookOpen, Trash2, Package, Wrench, UtensilsCrossed, Shirt, X, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import CatalogueManager from "./CatalogueManager";

const categoryIcons: Record<CatalogueCategory, React.ReactNode> = {
  products: <Package className="h-5 w-5" />,
  services: <Wrench className="h-5 w-5" />,
  "food-drinks": <UtensilsCrossed className="h-5 w-5" />,
  fashion: <Shirt className="h-5 w-5" />,
};

interface StoreManagerProps {
  selectedCatalogueId?: string;
  onSelectCatalogue?: (id: string) => void;
}

export default function StoreManager({ selectedCatalogueId, onSelectCatalogue }: StoreManagerProps) {
  const { data: catalogues, update: setCatalogues } = useLocalCache<SellerCatalogue[]>("riba_seller_catalogues", []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category: "" as CatalogueCategory | "", description: "" });
  const { toast } = useToast();

  const handleCreate = () => {
    if (!form.name || !form.category) {
      toast({ title: "Missing fields", description: "Catalogue name and category are required.", variant: "destructive" });
      return;
    }
    const newCatalogue: SellerCatalogue = {
      id: crypto.randomUUID(),
      name: form.name,
      category: form.category as CatalogueCategory,
      description: form.description,
      createdAt: new Date().toISOString(),
    };
    setCatalogues((prev) => [...prev, newCatalogue]);
    setForm({ name: "", category: "", description: "" });
    setDialogOpen(false);
    toast({ title: "Catalogue created", description: `"${newCatalogue.name}" has been added.` });
    onSelectCatalogue?.(newCatalogue.id);
  };

  const handleDelete = (id: string) => {
    setCatalogues((prev) => prev.filter((c) => c.id !== id));
    if (selectedCatalogueId === id) {
      onSelectCatalogue?.("");
    }
    toast({ title: "Catalogue removed" });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">My Catalogues</h2>
          <p className="text-xs text-muted-foreground">Create catalogues under any category to organize your offerings.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="btn-profit">
              <Plus className="h-4 w-4 mr-1" /> New Catalogue
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Catalogue</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Catalogue Name *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Summer Fashion Collection" />
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as CatalogueCategory })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATALOGUE_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        <span className="flex items-center gap-2">
                          {categoryIcons[cat]}
                          {CATALOGUE_CATEGORY_LABELS[cat]}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="What's in this catalogue?" />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  <X className="h-4 w-4 mr-1" /> Cancel
                </Button>
                <Button className="btn-profit" onClick={handleCreate}>
                  <Save className="h-4 w-4 mr-1" /> Create Catalogue
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {catalogues.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No catalogues yet. Create your first catalogue to start selling!</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            {catalogues.map((catalogue) => (
              <Card
                key={catalogue.id}
                className={`cursor-pointer transition-colors ${selectedCatalogueId === catalogue.id ? "border-primary ring-1 ring-primary" : "hover:border-primary/40"}`}
                onClick={() => onSelectCatalogue?.(catalogue.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {categoryIcons[catalogue.category]}
                      <div>
                        <p className="text-sm font-medium">{catalogue.name}</p>
                        <Badge variant="secondary" className={`text-xs mt-0.5 ${CATALOGUE_CATEGORY_COLORS[catalogue.category]}`}>
                          {CATALOGUE_CATEGORY_LABELS[catalogue.category]}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={(e) => { e.stopPropagation(); handleDelete(catalogue.id); }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  {catalogue.description && <p className="text-xs text-muted-foreground">{catalogue.description}</p>}
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedCatalogueId && (
            <div className="mt-6 pt-6 border-t">
              <CatalogueManager catalogueId={selectedCatalogueId} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
