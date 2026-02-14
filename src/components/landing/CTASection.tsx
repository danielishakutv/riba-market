import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-profit dark:bg-gradient-dark-profit relative overflow-hidden">
      <div className="container relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Start Your Profit Journey?
        </h2>
        <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
          Join thousands of Nigerian entrepreneurs already growing their business on Riba Market.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/signup">
            <Button size="lg" className="bg-white text-primary-700 hover:bg-white/90 font-semibold text-base">
              Start Selling
            </Button>
          </Link>
          <Link to="/products">
            <Button size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white/20 font-semibold text-base">
              Shop Now
            </Button>
          </Link>
        </div>
      </div>
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
    </section>
  );
}
