import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const categoryPills = ["All", "Restaurants", "Products", "Services"];

export function HeroSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/products?q=${encodeURIComponent(searchQuery)}&category=${activeCategory}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-background dark:from-primary-950/30 dark:to-background">
      <div className="container py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-3xl text-center animate-fade-in">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-foreground">Riba Market</span>
            <br />
            <span className="text-gradient-profit dark:text-primary">
              Where Profit Meets Marketplace
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
            Empowering Nigerian entrepreneurs and connecting them with customers.
            Buy, sell, and grow your business with ease.
          </p>

          {/* Search bar */}
          <div className="mt-10 mx-auto max-w-xl">
            <div className="flex gap-2 mb-4">
              {categoryPills.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-primary/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search products, restaurants, services..."
                className="h-12 pl-12 pr-28 rounded-xl border-primary/20 focus-visible:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 btn-profit rounded-lg h-9">
                Search
              </Button>
            </form>
          </div>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="btn-profit text-base" onClick={() => navigate("/products")}>
              Start Shopping
            </Button>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 text-base" onClick={() => navigate("/signup")}>
              Sell on Riba
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative blobs */}
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
    </section>
  );
}
