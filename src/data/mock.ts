export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  storeName: string;
  storeVerified: boolean;
  storeType: "restaurant" | "product" | "service";
  rating: number;
  reviewCount: number;
  category: string;
  badge?: "new" | "sale";
  discountPercent?: number;
  inStock: boolean;
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Jollof Rice Party Pack",
    price: 15000,
    originalPrice: 18000,
    image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&h=300&fit=crop",
    storeName: "Mama's Kitchen",
    storeVerified: true,
    storeType: "restaurant",
    rating: 4.8,
    reviewCount: 234,
    category: "Food",
    badge: "sale",
    discountPercent: 17,
    inStock: true,
  },
  {
    id: "2",
    name: "Premium Ankara Fabric (6 yards)",
    price: 8500,
    image: "https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=400&h=300&fit=crop",
    storeName: "Aso Oke Palace",
    storeVerified: true,
    storeType: "product",
    rating: 4.6,
    reviewCount: 89,
    category: "Fashion",
    badge: "new",
    inStock: true,
  },
  {
    id: "3",
    name: "Professional Photography Session",
    price: 45000,
    image: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=400&h=300&fit=crop",
    storeName: "SnapPro Studios",
    storeVerified: false,
    storeType: "service",
    rating: 4.9,
    reviewCount: 56,
    category: "Services",
    inStock: true,
  },
  {
    id: "4",
    name: "Samsung Galaxy A54 5G",
    price: 235000,
    originalPrice: 280000,
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=300&fit=crop",
    storeName: "TechHub NG",
    storeVerified: true,
    storeType: "product",
    rating: 4.7,
    reviewCount: 312,
    category: "Electronics",
    badge: "sale",
    discountPercent: 16,
    inStock: true,
  },
  {
    id: "5",
    name: "Suya Special (10 sticks)",
    price: 5000,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
    storeName: "Abuja Grills",
    storeVerified: true,
    storeType: "restaurant",
    rating: 4.5,
    reviewCount: 178,
    category: "Food",
    inStock: true,
  },
  {
    id: "6",
    name: "Home Cleaning Service",
    price: 20000,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
    storeName: "CleanSpace NG",
    storeVerified: true,
    storeType: "service",
    rating: 4.4,
    reviewCount: 67,
    category: "Services",
    badge: "new",
    inStock: true,
  },
  {
    id: "7",
    name: "Nike Air Max 90 (Original)",
    price: 85000,
    originalPrice: 95000,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
    storeName: "SneakerVault",
    storeVerified: true,
    storeType: "product",
    rating: 4.8,
    reviewCount: 201,
    category: "Fashion",
    badge: "sale",
    discountPercent: 11,
    inStock: true,
  },
  {
    id: "8",
    name: "Peppered Chicken & Fried Rice",
    price: 4500,
    image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&h=300&fit=crop",
    storeName: "The Food Court",
    storeVerified: false,
    storeType: "restaurant",
    rating: 4.3,
    reviewCount: 145,
    category: "Food",
    inStock: true,
  },
];

export const categories = [
  {
    name: "Restaurants & Food",
    icon: "UtensilsCrossed",
    color: "orange",
    count: 1240,
    description: "Delicious meals from verified vendors",
  },
  {
    name: "Products",
    icon: "Package",
    color: "blue",
    count: 3580,
    description: "Electronics, fashion, home & more",
  },
  {
    name: "Services",
    icon: "Wrench",
    color: "purple",
    count: 890,
    description: "Professional services near you",
  },
];

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}
