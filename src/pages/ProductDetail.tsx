import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { ProductCard } from "@/components/landing/ProductCard";
import { allProducts } from "@/data/mockExtended";
import { mockReviews } from "@/data/mockExtended";
import { formatNaira } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, ShoppingCart, Heart, Share2, BadgeCheck, Minus, Plus, Truck, Shield, RotateCcw, ThumbsUp, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function ProductDetail() {
  const { id } = useParams();
  const product = allProducts.find((p) => p.id === id) || allProducts[0];
  const related = allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const images = [product.image, product.image, product.image]; // Mock multiple images

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/products" className="hover:text-primary">Products</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <div>
            <div className="relative aspect-square rounded-xl overflow-hidden border mb-3">
              <img src={images[selectedImage]} alt={product.name} className="h-full w-full object-cover" />
              {product.badge === "sale" && product.discountPercent && (
                <span className="discount-badge text-sm">-{product.discountPercent}%</span>
              )}
              {product.badge === "new" && (
                <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">NEW</Badge>
              )}
            </div>
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-lg border-2 overflow-hidden transition-colors ${
                    selectedImage === i ? "border-primary" : "border-border"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                product.storeType === "restaurant" ? "category-restaurant" :
                product.storeType === "product" ? "category-product" : "category-service"
              }`}>
                {product.storeType === "restaurant" ? "Restaurant" : product.storeType === "product" ? "Product" : "Service"}
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">{product.name}</h1>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`h-4 w-4 ${s <= Math.round(product.rating) ? "fill-primary text-primary" : "text-muted"}`} />
                ))}
                <span className="text-sm font-medium ml-1">{product.rating}</span>
                <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
              </div>
            </div>

            <Link to={`/store/${product.storeName}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-4">
              {product.storeName}
              {product.storeVerified && <BadgeCheck className="h-4 w-4 text-primary" />}
            </Link>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-primary">{formatNaira(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">{formatNaira(product.originalPrice)}</span>
                  <Badge className="badge-sale">Save {product.discountPercent}%</Badge>
                </>
              )}
            </div>

            <p className="text-sm text-primary font-medium mb-6">
              {product.inStock ? "✅ In Stock" : "❌ Out of Stock"}
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setQty(Math.max(1, qty - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center text-sm font-medium">{qty}</span>
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setQty(qty + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <Button className="flex-1 btn-profit h-12 text-base">
                <ShoppingCart className="h-5 w-5 mr-2" /> Add to Cart
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12 border-primary text-primary hover:bg-primary/10">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Trust */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, label: "Fast Delivery" },
                { icon: Shield, label: "Secure Payment" },
                { icon: RotateCcw, label: "Easy Returns" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1 p-3 rounded-lg bg-muted/50 text-center">
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
            <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="prose prose-sm max-w-none dark:prose-invert mt-4">
            <p className="text-muted-foreground leading-relaxed">
              Experience the best of quality with {product.name} from {product.storeName}. This product has been carefully selected and verified
              to ensure you get the best value for your money. Our vendors are committed to delivering excellence, and this item is no exception.
              With {product.reviewCount} reviews and a {product.rating}-star rating, you can trust that you're making a great purchase.
            </p>
          </TabsContent>
          <TabsContent value="specs" className="mt-4">
            <div className="grid grid-cols-2 gap-2 max-w-md">
              {[["Category", product.category], ["Store", product.storeName], ["Rating", `${product.rating}/5`], ["Reviews", String(product.reviewCount)], ["Availability", product.inStock ? "In Stock" : "Out of Stock"]].map(([k, v]) => (
                <div key={k} className="contents">
                  <span className="text-sm text-muted-foreground py-2 border-b">{k}</span>
                  <span className="text-sm font-medium py-2 border-b">{v}</span>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-4">
            <div className="space-y-4">
              {mockReviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <img src={review.avatar} alt={review.author} className="h-8 w-8 rounded-full" />
                    <div>
                      <p className="text-sm font-medium">{review.author}</p>
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} className={`h-3 w-3 ${s <= review.rating ? "fill-primary text-primary" : "text-muted"}`} />
                        ))}
                        <span className="text-xs text-muted-foreground ml-2">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                  <Button variant="ghost" size="sm" className="mt-2 text-xs">
                    <ThumbsUp className="h-3 w-3 mr-1" /> Helpful ({review.helpful})
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="shipping" className="mt-4 text-sm text-muted-foreground space-y-3">
            <p><strong className="text-foreground">Delivery:</strong> Standard delivery takes 2-5 business days within Lagos and 5-10 business days outside Lagos.</p>
            <p><strong className="text-foreground">Returns:</strong> Items can be returned within 7 days of delivery. Items must be unused and in original packaging.</p>
            <p><strong className="text-foreground">Refunds:</strong> Refunds are processed within 3-5 business days after the returned item is received.</p>
          </TabsContent>
        </Tabs>

        {/* Related */}
        {related.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
