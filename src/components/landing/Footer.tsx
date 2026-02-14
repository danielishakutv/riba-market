import { Link } from "react-router-dom";

const footerLinks = {
  Marketplace: [
    { label: "Browse Products", href: "/products" },
    { label: "Restaurants", href: "/products" },
    { label: "Services", href: "/products" },
    { label: "Deals", href: "/products" },
  ],
  "For Sellers": [
    { label: "Start Selling", href: "/signup" },
    { label: "Seller Dashboard", href: "/seller/dashboard" },
    { label: "Pricing", href: "#" },
    { label: "Seller Guide", href: "#" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-card py-12">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-profit">
                <span className="text-sm font-bold text-white">R</span>
              </div>
              <span className="text-lg font-bold text-foreground">Riba Market</span>
            </Link>
            <p className="text-sm text-muted-foreground">Where Profit Meets Marketplace</p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-foreground mb-3">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Riba Market. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
