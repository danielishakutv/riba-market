import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star, BadgeCheck, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Product, formatNaira } from "@/data/mock";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/product/${product.id}`} className="group relative rounded-xl border bg-card text-card-foreground transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 overflow-hidden block">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {/* Badges */}
        {product.badge === "sale" && product.discountPercent && (
          <span className="discount-badge">-{product.discountPercent}%</span>
        )}
        {product.badge === "new" && (
          <span className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-bold">
            NEW
          </span>
        )}
        {/* Quick actions on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full shadow">
            <Heart className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full shadow">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Store info */}
        <div className="flex items-center gap-1.5 mb-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            product.storeType === "restaurant" ? "category-restaurant" :
            product.storeType === "product" ? "category-product" :
            "category-service"
          }`}>
            {product.storeType === "restaurant" ? "Restaurant" :
             product.storeType === "product" ? "Product" : "Service"}
          </span>
          {product.storeVerified && (
            <BadgeCheck className="h-4 w-4 text-primary" />
          )}
        </div>

        <h3 className="font-semibold text-sm line-clamp-2 mb-1 text-card-foreground">
          {product.name}
        </h3>

        <p className="text-xs text-muted-foreground mb-2">
          {product.storeName}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
          <span className="text-xs font-medium">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>

        {/* Price + Add to Cart */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-primary">
              {formatNaira(product.price)}
            </span>
            {product.originalPrice && (
              <span className="price-original ml-2">
                {formatNaira(product.originalPrice)}
              </span>
            )}
          </div>
          <Button size="sm" className="btn-profit h-8 px-3 text-xs">
            <ShoppingCart className="h-3.5 w-3.5 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </Link>
  );
}
