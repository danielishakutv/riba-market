import { Search, ShoppingCart, CreditCard, Truck, UserPlus, Store, PackagePlus, TrendingUp } from "lucide-react";

const buyerSteps = [
  { icon: Search, label: "Browse", desc: "Find products you love" },
  { icon: ShoppingCart, label: "Add to Cart", desc: "Select items & quantities" },
  { icon: CreditCard, label: "Checkout", desc: "Pay securely online or COD" },
  { icon: Truck, label: "Receive", desc: "Get it delivered to your door" },
];

const sellerSteps = [
  { icon: UserPlus, label: "Register", desc: "Create your free account" },
  { icon: Store, label: "Create Store", desc: "Set up your storefront" },
  { icon: PackagePlus, label: "List Products", desc: "Add products with details" },
  { icon: TrendingUp, label: "Earn Profit", desc: "Start selling & earning" },
];

function StepRow({ steps, title }: { steps: typeof buyerSteps; title: string }) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-foreground mb-6 text-center">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {steps.map((step, i) => (
          <div key={step.label} className="relative text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <step.icon className="h-6 w-6 text-primary" />
            </div>
            <h4 className="font-semibold text-sm text-foreground">{step.label}</h4>
            <p className="text-xs text-muted-foreground mt-1">{step.desc}</p>
            {i < steps.length - 1 && (
              <div className="hidden md:block absolute top-7 left-[calc(50%+2rem)] w-[calc(100%-4rem)] border-t-2 border-dashed border-primary/30" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground">How It Works</h2>
          <p className="text-muted-foreground mt-2">Simple steps to get started</p>
        </div>
        <div className="space-y-16">
          <StepRow steps={buyerSteps} title="For Buyers" />
          <StepRow steps={sellerSteps} title="For Sellers" />
        </div>
      </div>
    </section>
  );
}
