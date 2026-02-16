

# Riba Market — "Where Profit Meets Marketplace"
## Multi-Vendor eCommerce Platform

### 🎨 Phase 1: Design System & Branding
- Apply the Riba Market green theme (light + dark mode) using the uploaded `globals.css` and `tailwind.config.ts`
- Set up theme toggle (light/dark mode) using `next-themes`
- Create custom utility classes: `.btn-profit`, `.card-profit`, `.badge-sale`, `.badge-verified`
- Green gradient CTAs, amber/gold sale badges, category-specific colors (orange for restaurants, blue for products, purple for services)

### 🏠 Phase 2: Landing Page
- **Header**: Riba Market logo, navigation links (Categories, Deals, Sell on Riba), cart icon with badge, wishlist, profile dropdown, dark mode toggle
- **Hero section**: Bold headline with tagline, search bar with category pills (Restaurants, Products, Services), green gradient CTA buttons
- **Featured products carousel**: Product cards with images, prices in ₦, vendor badges, "Add to Cart" buttons
- **Categories grid**: Restaurant/Food (orange), Products (blue), Services (purple) with browse buttons
- **How it works**: Visual steps for Buyers and Sellers
- **Trust indicators**: Verified Vendors, Secure Payment, Fast Delivery, 24/7 Support
- **CTA sections**: "Start Selling" and "Shop Now"
- **Footer**: Links, social media, Riba Market branding

### 🔐 Phase 3: Authentication Pages
- **Login page**: Email/password, remember me, social login buttons, forgot password link
- **Signup page**: User type selector (Buyer/Seller/Both), name, email, phone, password with strength indicator, business name for sellers
- **Password reset flow**: Email input → success message → new password form
- Split-screen layout with promotional content on the right side
- All forms with Zod validation and inline error messages

### 🛍️ Phase 4: Product Catalog & Filters
- **Filter sidebar** (collapsible on mobile): Categories, price range slider, store type badges, verified vendors toggle, rating filter, date listed, location
- **Product grid**: Responsive columns with grid/list toggle, sort dropdown
- **Product cards**: Image with sale/new badges, ₦ price, store name with verified badge, rating stars, add to cart, wishlist heart, quick view
- Green hover effects, skeleton loading states, empty state, pagination
- Mobile filter drawer

### 📦 Phase 5: Product Details Page
- Image gallery with thumbnails and zoom
- Product info: Name, rating, store with verified badge, price, availability, quantity selector
- Add to cart + wishlist buttons
- Tabs: Description, Specifications, Reviews, Shipping & Returns
- Reviews section with rating breakdown, write review form, filters
- Related products carousel

### 🛒 Phase 6: Shopping Cart & Checkout
- **Cart page**: Items grouped by store/vendor, quantity selectors, discount code input, price breakdown, save for later
- **Checkout flow** (multi-step):
  1. Delivery address selection/add new
  2. Payment method (Online via Flutterwave / Cash on Delivery)
  3. Order review with full breakdown
- **Order confirmation**: Order number, PDF receipt download button, track order, continue shopping

### 📊 Phase 7: Seller Dashboard
- **Overview**: Stats cards (sales, revenue, products, orders, customers), revenue chart, recent orders, top products, quick actions
- **Orders management**: Table with status badges, filters, search, order detail modal with timeline
- **Product management**: Products table, add/edit product form (name, category, description, price, inventory, images, video URL, specifications), draft/publish
- **Store settings**: Profile edit, logo upload, business info, verification status
- Responsive sidebar layout

### 👤 Phase 8: Buyer Dashboard
- **Overview**: Welcome message, quick stats, active order tracker, recent orders, recommended products
- **Order history**: Orders table with status timeline, order details, PDF download, track shipment, leave review
- **Wishlist**: Saved products grid, quick add to cart, remove
- **Saved addresses**: Address cards, add/edit/delete, set default
- **Account settings**: Profile edit, change password, notification preferences

### 🏪 Phase 9: Store Profile Page (Public)
- Store header: Logo, name, type badge, verification, rating, follow/share buttons, description, operating hours
- Tabs: Products, About, Reviews, Policies
- Products grid with in-store search and category filters
- Reviews section with rating breakdown

### 📱 Phase 10: Mobile Navigation
- Bottom navigation bar (Home, Categories, Sell, Orders, Profile)
- Side drawer menu
- Cart slide-out drawer
- Mobile-optimized search with autocomplete

---

**Note:** All pages will use mock/sample data initially. The architecture will be designed so Supabase (auth, database, storage) can be connected seamlessly in a future phase. The uploaded database schema will guide the data models used in mock data.

