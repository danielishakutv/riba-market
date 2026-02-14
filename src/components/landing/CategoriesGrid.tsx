import { UtensilsCrossed, Package, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const cats = [
  {
    name: "Restaurants & Food",
    icon: UtensilsCrossed,
    color: "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-800 hover:border-orange-400",
    count: "1,240+ vendors",
    description: "Delicious meals from verified vendors near you",
  },
  {
    name: "Products",
    icon: Package,
    color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800 hover:border-blue-400",
    count: "3,580+ items",
    description: "Electronics, fashion, home essentials & more",
  },
  {
    name: "Services",
    icon: Wrench,
    color: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800 hover:border-purple-400",
    count: "890+ providers",
    description: "Professional services from trusted experts",
  },
];

export function CategoriesGrid() {
  return (
    <section className="py-16 bg-secondary/30 dark:bg-secondary/10">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground">Shop by Category</h2>
          <p className="text-muted-foreground mt-2">Find exactly what you need</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cats.map((cat) => (
            <div
              key={cat.name}
              className={`rounded-xl border bg-card p-8 text-center hover-lift transition-all ${cat.border}`}
            >
              <div className={`mx-auto h-16 w-16 rounded-2xl flex items-center justify-center mb-4 ${cat.color}`}>
                <cat.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-1">{cat.name}</h3>
              <p className="text-sm text-muted-foreground mb-1">{cat.description}</p>
              <p className="text-xs text-primary font-medium mb-4">{cat.count}</p>
              <Link to="/products">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  Browse
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
