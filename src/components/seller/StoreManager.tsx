import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useLocalCache } from "@/hooks/useLocalCache";
import { type SellerCatalogue, type CatalogueCategory, CATALOGUE_CATEGORIES, CATALOGUE_CATEGORY_LABELS, CATALOGUE_CATEGORY_COLORS } from "@/data/storeTypes";
import {
  Plus, BookOpen, Trash2, Package, Wrench, UtensilsCrossed, Shirt,
  X, Save, Edit, Copy, ExternalLink, Eye, EyeOff, Palette, Settings2,
  Share2, Link2, Search, MoreVertical, Globe, BarChart3,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { type CatalogueItem } from "./CatalogueManager";
import CatalogueManager from "./CatalogueManager";

const categoryIcons: Record<CatalogueCategory, React.ReactNode> = {
  products: <Package className="h-5 w-5" />,
  services: <Wrench className="h-5 w-5" />,
  "food-drinks": <UtensilsCrossed className="h-5 w-5" />,
  fashion: <Shirt className="h-5 w-5" />,
};

const BANNER_COLORS = [
  { label: "Default", value: "" },
  { label: "Blue", value: "bg-blue-600" },
  { label: "Green", value: "bg-emerald-600" },
  { label: "Purple", value: "bg-purple-600" },
  { label: "Orange", value: "bg-orange-500" },
  { label: "Rose", value: "bg-rose-600" },
  { label: "Teal", value: "bg-teal-600" },
  { label: "Indigo", value: "bg-indigo-600" },
];

const emptyForm = { name: "", category: "" as CatalogueCategory | "", description: "", welcomeMessage: "", bannerColor: "", isPublic: true };

interface StoreManagerProps {
  selectedCatalogueId?: string;
  onSelectCatalogue?: (id: string) => void;
}

export default function StoreManager({ selectedCatalogueId, onSelectCatalogue }: StoreManagerProps) {
  const { data: catalogues, update: setCatalogues } = useLocalCache<SellerCatalogue[]>("riba_seller_catalogues", []);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  // Stats per catalogue
  const catalogueStats = useMemo(() => {
    const stats: Record<string, { itemCount: number; published: number; draft: number }> = {};
    catalogues.forEach((cat) => {
      try {
        const raw = localStorage.getItem(`riba_catalogue_${cat.id}`);
        const items: CatalogueItem[] = raw ? JSON.parse(raw) : [];
        stats[cat.id] = {
          itemCount: items.length,
          published: items.filter((i) => i.status === "published").length,
          draft: items.filter((i) => i.status === "draft").length,
        };
      } catch {
        stats[cat.id] = { itemCount: 0, published: 0, draft: 0 };
      }
    });
    return stats;
  }, [catalogues]);

  const filteredCatalogues = useMemo(() => {
    if (!searchQuery) return catalogues;
    const q = searchQuery.toLowerCase();
    return catalogues.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      CATALOGUE_CATEGORY_LABELS[c.category].toLowerCase().includes(q)
    );
  }, [catalogues, searchQuery]);

  const totalItems = Object.values(catalogueStats).reduce((sum, s) => sum + s.itemCount, 0);
  const totalPublished = Object.values(catalogueStats).reduce((sum, s) => sum + s.published, 0);
  const publicCatalogues = catalogues.filter((c) => c.isPublic !== false).length;

  // --- CRUD Operations ---
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
      welcomeMessage: form.welcomeMessage,
      bannerColor: form.bannerColor,
      isPublic: form.isPublic,
    };
    setCatalogues((prev) => [...prev, newCatalogue]);
    setForm(emptyForm);
    setCreateOpen(false);
    toast({ title: "Catalogue created", description: `"${newCatalogue.name}" has been added.` });
    onSelectCatalogue?.(newCatalogue.id);
  };

  const handleEdit = () => {
    if (!form.name || !form.category || !editingId) return;
    setCatalogues((prev) =>
      prev.map((c) =>
        c.id === editingId
          ? { ...c, name: form.name, category: form.category as CatalogueCategory, description: form.description }
          : c
      )
    );
    setEditOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    toast({ title: "Catalogue updated" });
  };

  const openEdit = (cat: SellerCatalogue) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, category: cat.category, description: cat.description, welcomeMessage: cat.welcomeMessage || "", bannerColor: cat.bannerColor || "", isPublic: cat.isPublic !== false });
    setEditOpen(true);
  };

  const openCustomize = (cat: SellerCatalogue) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, category: cat.category, description: cat.description, welcomeMessage: cat.welcomeMessage || "", bannerColor: cat.bannerColor || "", isPublic: cat.isPublic !== false });
    setCustomizeOpen(true);
  };

  const handleCustomizeSave = () => {
    if (!editingId) return;
    setCatalogues((prev) =>
      prev.map((c) =>
        c.id === editingId
          ? { ...c, welcomeMessage: form.welcomeMessage, bannerColor: form.bannerColor, isPublic: form.isPublic }
          : c
      )
    );
    setCustomizeOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    toast({ title: "Customization saved" });
  };

  const handleDelete = (id: string) => {
    // Also remove catalogue items from localStorage
    localStorage.removeItem(`riba_catalogue_${id}`);
    setCatalogues((prev) => prev.filter((c) => c.id !== id));
    if (selectedCatalogueId === id) onSelectCatalogue?.("");
    setDeleteConfirmId(null);
    toast({ title: "Catalogue deleted", description: "Catalogue and all its items have been removed." });
  };

  const toggleVisibility = (id: string) => {
    setCatalogues((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isPublic: c.isPublic === false ? true : false } : c))
    );
    const cat = catalogues.find((c) => c.id === id);
    toast({ title: cat?.isPublic === false ? "Catalogue is now public" : "Catalogue is now hidden" });
  };

  const duplicateCatalogue = (cat: SellerCatalogue) => {
    const dup: SellerCatalogue = {
      ...cat,
      id: crypto.randomUUID(),
      name: `${cat.name} (Copy)`,
      createdAt: new Date().toISOString(),
    };
    // Duplicate items too
    try {
      const raw = localStorage.getItem(`riba_catalogue_${cat.id}`);
      if (raw) {
        const items: CatalogueItem[] = JSON.parse(raw);
        const dupItems = items.map((i) => ({ ...i, id: crypto.randomUUID() }));
        localStorage.setItem(`riba_catalogue_${dup.id}`, JSON.stringify(dupItems));
      }
    } catch { /* ignore */ }
    setCatalogues((prev) => [...prev, dup]);
    toast({ title: "Catalogue duplicated", description: `"${dup.name}" created with all items.` });
  };

  const getCatalogueLink = (id: string) => `${origin}/catalogue/${id}`;

  const copyLink = (id: string) => {
    navigator.clipboard.writeText(getCatalogueLink(id));
    toast({ title: "Link copied!", description: "Shareable catalogue link copied to clipboard." });
  };

  const openShareDialog = (cat: SellerCatalogue) => {
    setEditingId(cat.id);
    setShareOpen(true);
  };

  const currentShareCatalogue = catalogues.find((c) => c.id === editingId);

  return (
    <div className="space-y-6">
      {/* Quick Actions Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm" className="btn-profit gap-1.5" onClick={() => { setForm(emptyForm); setCreateOpen(true); }}>
              <Plus className="h-4 w-4" /> New Catalogue
            </Button>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                <strong className="text-foreground">{catalogues.length}</strong> catalogue{catalogues.length !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1.5">
                <Package className="h-4 w-4" />
                <strong className="text-foreground">{totalItems}</strong> item{totalItems !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1.5">
                <Globe className="h-4 w-4" />
                <strong className="text-foreground">{publicCatalogues}</strong> public
              </span>
              <span className="flex items-center gap-1.5">
                <BarChart3 className="h-4 w-4" />
                <strong className="text-foreground">{totalPublished}</strong> published
              </span>
            </div>
            <div className="ml-auto relative min-w-[200px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search catalogues..."
                className="pl-8 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {catalogues.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-1">No catalogues yet</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
              Create your first catalogue to organize your products and share them with customers.
            </p>
            <Button className="btn-profit" onClick={() => { setForm(emptyForm); setCreateOpen(true); }}>
              <Plus className="h-4 w-4 mr-1" /> Create Your First Catalogue
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* No search results */}
          {filteredCatalogues.length === 0 && searchQuery && (
            <Card>
              <CardContent className="py-8 text-center">
                <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No catalogues match "{searchQuery}"</p>
              </CardContent>
            </Card>
          )}

          {/* Catalogue Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCatalogues.map((catalogue) => {
              const stats = catalogueStats[catalogue.id] || { itemCount: 0, published: 0, draft: 0 };
              const isSelected = selectedCatalogueId === catalogue.id;
              const isPublic = catalogue.isPublic !== false;

              return (
                <Card
                  key={catalogue.id}
                  className={`group cursor-pointer transition-all ${
                    isSelected ? "border-primary ring-2 ring-primary/20 shadow-md" : "hover:border-primary/40 hover:shadow-sm"
                  }`}
                  onClick={() => onSelectCatalogue?.(catalogue.id)}
                >
                  {/* Colour Banner */}
                  {catalogue.bannerColor && (
                    <div className={`h-2 rounded-t-lg ${catalogue.bannerColor}`} />
                  )}

                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="shrink-0">{categoryIcons[catalogue.category]}</div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">{catalogue.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Badge variant="secondary" className={`text-[10px] ${CATALOGUE_CATEGORY_COLORS[catalogue.category]}`}>
                              {CATALOGUE_CATEGORY_LABELS[catalogue.category]}
                            </Badge>
                            {isPublic ? (
                              <Badge variant="outline" className="text-[10px] gap-0.5 text-emerald-600"><Globe className="h-2.5 w-2.5" /> Public</Badge>
                            ) : (
                              <Badge variant="outline" className="text-[10px] gap-0.5 text-muted-foreground"><EyeOff className="h-2.5 w-2.5" /> Hidden</Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Context Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenuItem onClick={() => openEdit(catalogue)}>
                            <Edit className="h-4 w-4 mr-2" /> Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openCustomize(catalogue)}>
                            <Palette className="h-4 w-4 mr-2" /> Customize
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openShareDialog(catalogue)}>
                            <Share2 className="h-4 w-4 mr-2" /> Share Link
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleVisibility(catalogue.id)}>
                            {isPublic ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                            {isPublic ? "Make Hidden" : "Make Public"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => duplicateCatalogue(catalogue)}>
                            <Copy className="h-4 w-4 mr-2" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteConfirmId(catalogue.id)}>
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {catalogue.description && (
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{catalogue.description}</p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span><strong className="text-foreground">{stats.itemCount}</strong> item{stats.itemCount !== 1 ? "s" : ""}</span>
                      <span className="text-emerald-600"><strong>{stats.published}</strong> live</span>
                      {stats.draft > 0 && <span className="text-amber-600"><strong>{stats.draft}</strong> draft</span>}
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-1.5 mt-3 pt-3 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs flex-1 gap-1"
                        onClick={(e) => { e.stopPropagation(); onSelectCatalogue?.(catalogue.id); }}
                      >
                        <Package className="h-3 w-3" /> Items
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1"
                        onClick={(e) => { e.stopPropagation(); copyLink(catalogue.id); }}
                      >
                        <Link2 className="h-3 w-3" /> Link
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1"
                        onClick={(e) => { e.stopPropagation(); openCustomize(catalogue); }}
                      >
                        <Settings2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Inline Catalogue Item Manager */}
          {selectedCatalogueId && (
            <div className="mt-6 pt-6 border-t">
              <CatalogueManager catalogueId={selectedCatalogueId} />
            </div>
          )}
        </>
      )}

      {/* === DIALOGS === */}

      {/* Create Catalogue Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a New Catalogue</DialogTitle>
            <DialogDescription>Set up a new catalogue to organize and share your products.</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="customize">Customize</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4 mt-4">
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
            </TabsContent>
            <TabsContent value="customize" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Welcome Message</Label>
                <Textarea
                  value={form.welcomeMessage}
                  onChange={(e) => setForm({ ...form, welcomeMessage: e.target.value })}
                  rows={2}
                  placeholder="e.g. Welcome! Browse our latest collection..."
                />
                <p className="text-xs text-muted-foreground">Shown to customers on the public catalogue page.</p>
              </div>
              <div className="space-y-2">
                <Label>Banner Color</Label>
                <div className="flex flex-wrap gap-2">
                  {BANNER_COLORS.map((color) => (
                    <button
                      key={color.value}
                      className={`h-8 w-8 rounded-full border-2 transition-all ${
                        color.value ? color.value : "bg-gradient-profit"
                      } ${form.bannerColor === color.value ? "ring-2 ring-primary ring-offset-2" : ""}`}
                      onClick={() => setForm({ ...form, bannerColor: color.value })}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Public Catalogue</Label>
                  <p className="text-xs text-muted-foreground">Make this catalogue visible to customers.</p>
                </div>
                <Switch checked={form.isPublic} onCheckedChange={(v) => setForm({ ...form, isPublic: v })} />
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
            <Button className="btn-profit" onClick={handleCreate}>
              <Save className="h-4 w-4 mr-1" /> Create Catalogue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Catalogue Dialog */}
      <Dialog open={editOpen} onOpenChange={(o) => { setEditOpen(o); if (!o) { setEditingId(null); setForm(emptyForm); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Catalogue</DialogTitle>
            <DialogDescription>Update your catalogue details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Catalogue Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
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
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
            <Button className="btn-profit" onClick={handleEdit}>
              <Save className="h-4 w-4 mr-1" /> Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Customize Catalogue Dialog */}
      <Dialog open={customizeOpen} onOpenChange={(o) => { setCustomizeOpen(o); if (!o) { setEditingId(null); setForm(emptyForm); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customize Catalogue</DialogTitle>
            <DialogDescription>Personalize how your catalogue appears to customers.</DialogDescription>
          </DialogHeader>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Welcome Message</Label>
              <Textarea
                value={form.welcomeMessage}
                onChange={(e) => setForm({ ...form, welcomeMessage: e.target.value })}
                rows={3}
                placeholder="e.g. Welcome! Browse our latest collection..."
              />
              <p className="text-xs text-muted-foreground">Displayed at the top of your public catalogue page.</p>
            </div>

            <div className="space-y-2">
              <Label>Banner Color</Label>
              <div className="flex flex-wrap gap-2">
                {BANNER_COLORS.map((color) => (
                  <button
                    key={color.value}
                    className={`h-8 w-8 rounded-full border-2 transition-all ${
                      color.value ? color.value : "bg-gradient-profit"
                    } ${form.bannerColor === color.value ? "ring-2 ring-primary ring-offset-2" : ""}`}
                    onClick={() => setForm({ ...form, bannerColor: color.value })}
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Public Visibility</Label>
                <p className="text-xs text-muted-foreground">Anyone with the link can view this catalogue.</p>
              </div>
              <Switch checked={form.isPublic} onCheckedChange={(v) => setForm({ ...form, isPublic: v })} />
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <Label>Preview</Label>
              <Card className="overflow-hidden">
                <div className={`h-16 flex items-end p-3 ${form.bannerColor || "bg-gradient-profit"}`}>
                  <span className="text-white font-semibold text-sm drop-shadow">{form.name || "Catalogue Name"}</span>
                </div>
                <CardContent className="p-3">
                  {form.welcomeMessage && (
                    <p className="text-xs text-muted-foreground italic mb-2">"{form.welcomeMessage}"</p>
                  )}
                  <p className="text-xs text-muted-foreground">Products will appear here...</p>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="outline" onClick={() => setCustomizeOpen(false)}>
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
            <Button className="btn-profit" onClick={handleCustomizeSave}>
              <Save className="h-4 w-4 mr-1" /> Save Customization
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Link Dialog */}
      <Dialog open={shareOpen} onOpenChange={(o) => { setShareOpen(o); if (!o) setEditingId(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Catalogue</DialogTitle>
            <DialogDescription>
              {currentShareCatalogue ? `Share "${currentShareCatalogue.name}" with your customers.` : "Share this catalogue."}
            </DialogDescription>
          </DialogHeader>
          {editingId && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Public Link</Label>
                <div className="flex gap-2">
                  <Input readOnly value={getCatalogueLink(editingId)} className="text-xs font-mono" />
                  <Button variant="outline" size="icon" className="shrink-0" onClick={() => copyLink(editingId)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 gap-1.5" variant="outline" onClick={() => copyLink(editingId)}>
                  <Copy className="h-4 w-4" /> Copy Link
                </Button>
                <Button className="flex-1 gap-1.5" variant="outline" onClick={() => window.open(getCatalogueLink(editingId), "_blank")}>
                  <ExternalLink className="h-4 w-4" /> Open in Browser
                </Button>
              </div>
              {currentShareCatalogue?.isPublic === false && (
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-3">
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    This catalogue is currently <strong>hidden</strong>. Visitors won't see it unless you make it public.
                  </p>
                  <Button size="sm" variant="outline" className="mt-2 h-7 text-xs" onClick={() => { toggleVisibility(editingId); }}>
                    <Eye className="h-3 w-3 mr-1" /> Make Public
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={(o) => { if (!o) setDeleteConfirmId(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Catalogue</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{catalogues.find((c) => c.id === deleteConfirmId)?.name}"?
              This will permanently remove all items in this catalogue.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}>
              <Trash2 className="h-4 w-4 mr-1" /> Delete Permanently
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
