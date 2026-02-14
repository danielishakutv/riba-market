export const STORE_TYPES = ["products", "services", "food-drinks", "fashion"] as const;
export type StoreType = typeof STORE_TYPES[number];

export interface SellerStore {
  id: string;
  name: string;
  type: StoreType;
  description: string;
  createdAt: string;
}

export const STORE_TYPE_LABELS: Record<StoreType, string> = {
  products: "Products",
  services: "Services",
  "food-drinks": "Food & Drinks",
  fashion: "Fashion",
};

export const STORE_TYPE_ICONS: Record<StoreType, string> = {
  products: "Package",
  services: "Wrench",
  "food-drinks": "UtensilsCrossed",
  fashion: "Shirt",
};

export const STORE_TYPE_COLORS: Record<StoreType, string> = {
  products: "category-product",
  services: "category-service",
  "food-drinks": "category-restaurant",
  fashion: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
};
