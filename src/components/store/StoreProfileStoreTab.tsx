import { ProductCard } from "@/components/landing/ProductCard";
import { allProducts } from "@/data/mockExtended";
import { useLocalCache } from "@/hooks/useLocalCache";
import { type CatalogueItem } from "@/components/seller/CatalogueManager";
import { type CatalogueCategory, CATALOGUE_CATEGORY_LABELS } from "@/data/storeTypes";
import { formatNaira } from "@/data/mock";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Package } from "lucide-react";

interface Props {
  storeName: string;
  storeId?: string;
  storeType?: CatalogueCategory;
}

export default function StoreProfileStoreTab({ storeName, storeId, storeType }: Props) {
  const cacheKey = storeId ? `riba_catalogue_${storeId}` : "riba_catalogue";
  const { data: catalogueItems } = useLocalCache<CatalogueItem[]>(cacheKey, []);
  const publishedCatalogue = catalogueItems.filter((i) => i.status === "published");

  // Fallback to mock products for demo
  const storeProducts = allProducts.filter((p) => p.storeName === storeName);
  const displayProducts = storeProducts.length > 0 ? storeProducts : allProducts.slice(0, 6);

  return (
    <div className="mt-6 space-y-6">
      {storeType && (
        <Badge variant="secondary" className="text-xs">
          {CATALOGUE_CATEGORY_LABELS[storeType]} Catalogue
        </Badge>
      )}

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search in this store..." className="pl-9 h-9" />
        </div>
      </div>

      {/* Catalogue items */}
      {publishedCatalogue.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3">Catalogue ({publishedCatalogue.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {publishedCatalogue.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded-lg mb-3" />
                  ) : (
                    <div className="w-full h-40 bg-muted rounded-lg mb-3 flex items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <h3 className="font-medium text-sm">{item.name}</h3>
                  {item.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>}
                  <p className="text-primary font-semibold mt-2">{formatNaira(item.price)}</p>
                  {item.category && <span className="text-xs text-muted-foreground">{item.category}</span>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Mock products */}
      <div>
        {publishedCatalogue.length > 0 && <h3 className="text-sm font-semibold mb-3">Products</h3>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
