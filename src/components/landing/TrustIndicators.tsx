import { BadgeCheck, Lock, Truck, Headphones } from "lucide-react";

const indicators = [
  { icon: BadgeCheck, title: "Verified Vendors", desc: "Every seller is vetted for quality" },
  { icon: Lock, title: "Secure Payment", desc: "Your transactions are protected" },
  { icon: Truck, title: "Fast Delivery", desc: "Quick and reliable shipping" },
  { icon: Headphones, title: "24/7 Support", desc: "We're here whenever you need help" },
];

export function TrustIndicators() {
  return (
    <section className="py-16 bg-secondary/30 dark:bg-secondary/10">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {indicators.map((item) => (
            <div key={item.title} className="text-center">
              <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <item.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
