import { useParams } from "react-router-dom";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useLocalCache } from "@/hooks/useLocalCache";
import { type SellerProfile } from "@/components/seller/SellerProfileSettings";
import { type SellerStore, STORE_TYPE_LABELS, STORE_TYPE_COLORS } from "@/data/storeTypes";
import { BadgeCheck, Star, Share2, MapPin, Users, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StoreProfileAbout from "@/components/store/StoreProfileAbout";
import StoreProfileReviews from "@/components/store/StoreProfileReviews";
import StoreProfilePolicies from "@/components/store/StoreProfilePolicies";
import StoreProfileStoreTab from "@/components/store/StoreProfileStoreTab";

export default function StoreProfile() {
  const { storeName } = useParams();
  const { data: sellerProfile } = useLocalCache<SellerProfile>("riba_seller_profile", {
    storeName: "TechHub NG", description: "Your one-stop shop for quality electronics and gadgets in Nigeria.", email: "", phone: "+234 801 234 5678",
    logoUrl: null, googleMapsLink: "", isPro: false, hideSoldCount: false,
  });
  const { data: stores } = useLocalCache<SellerStore[]>("riba_seller_stores", []);

  const totalSold = 552;
  const store = {
    name: storeName || sellerProfile.storeName,
    verified: true,
    rating: 4.7,
    reviewCount: 312,
    followers: 1240,
    description: sellerProfile.description,
    location: "Ikeja, Lagos",
    hours: "Mon-Sat: 9AM - 6PM",
    phone: sellerProfile.phone,
    logoUrl: sellerProfile.logoUrl,
    googleMapsLink: sellerProfile.googleMapsLink,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Store Header */}
        <div className="border-b bg-card">
          <div className="container py-8">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {store.logoUrl ? (
                <img src={store.logoUrl} alt={store.name} className="h-20 w-20 rounded-xl object-cover shrink-0" />
              ) : (
                <div className="h-20 w-20 rounded-xl bg-gradient-profit flex items-center justify-center text-3xl font-bold text-white shrink-0">
                  {store.name[0]}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold">{store.name}</h1>
                  {store.verified && <BadgeCheck className="h-6 w-6 text-primary" />}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                  {stores.length > 0 && stores.map((s) => (
                    <Badge key={s.id} variant="secondary" className={`text-xs ${STORE_TYPE_COLORS[s.type]}`}>
                      {STORE_TYPE_LABELS[s.type]}
                    </Badge>
                  ))}
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    {store.rating} ({store.reviewCount} reviews)
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" /> {store.followers} followers
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {store.location}
                  </span>
                  {!sellerProfile.hideSoldCount && (
                    <span className="flex items-center gap-1">
                      <ShoppingBag className="h-4 w-4" /> {totalSold} sold
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground max-w-xl">{store.description}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button className="btn-profit">Follow</Button>
                <Button variant="outline" size="icon"><Share2 className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="container py-6">
          <Tabs defaultValue={stores.length > 0 ? stores[0].id : "all"}>
            <TabsList className="flex-wrap h-auto gap-1">
              {stores.length === 0 && <TabsTrigger value="all">All Products</TabsTrigger>}
              {stores.map((s) => (
                <TabsTrigger key={s.id} value={s.id}>
                  {s.name}
                </TabsTrigger>
              ))}
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="policies">Policies</TabsTrigger>
            </TabsList>

            {stores.length === 0 && (
              <TabsContent value="all">
                <StoreProfileStoreTab storeName={store.name} />
              </TabsContent>
            )}
            {stores.map((s) => (
              <TabsContent key={s.id} value={s.id}>
                <StoreProfileStoreTab storeName={store.name} storeId={s.id} storeType={s.type} />
              </TabsContent>
            ))}

            <TabsContent value="about" className="mt-6 max-w-2xl">
              <StoreProfileAbout store={store} />
            </TabsContent>
            <TabsContent value="reviews" className="mt-6 max-w-2xl">
              <StoreProfileReviews rating={store.rating} reviewCount={store.reviewCount} />
            </TabsContent>
            <TabsContent value="policies" className="mt-6 max-w-2xl">
              <StoreProfilePolicies />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
