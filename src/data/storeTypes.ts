export const CATALOGUE_CATEGORIES = ["products", "services", "food-drinks", "fashion"] as const;
export type CatalogueCategory = typeof CATALOGUE_CATEGORIES[number];

export interface SellerCatalogue {
  id: string;
  name: string;
  category: CatalogueCategory;
  description: string;
  createdAt: string;
  // Customization fields
  bannerColor?: string;
  accentColor?: string;
  welcomeMessage?: string;
  isPublic?: boolean;
}

export const CATALOGUE_CATEGORY_LABELS: Record<CatalogueCategory, string> = {
  products: "Products",
  services: "Services",
  "food-drinks": "Food & Drinks",
  fashion: "Fashion",
};

export const CATALOGUE_CATEGORY_ICONS: Record<CatalogueCategory, string> = {
  products: "Package",
  services: "Wrench",
  "food-drinks": "UtensilsCrossed",
  fashion: "Shirt",
};

export const CATALOGUE_CATEGORY_COLORS: Record<CatalogueCategory, string> = {
  products: "category-product",
  services: "category-service",
  "food-drinks": "category-restaurant",
  fashion: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
};

// Legacy aliases for backward compatibility
export type StoreType = CatalogueCategory;
export type SellerStore = SellerCatalogue;
export const STORE_TYPES = CATALOGUE_CATEGORIES;
export const STORE_TYPE_LABELS = CATALOGUE_CATEGORY_LABELS;
export const STORE_TYPE_COLORS = CATALOGUE_CATEGORY_COLORS;
