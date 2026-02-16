import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useLocalCache } from "@/hooks/useLocalCache";
import { Upload, MapPin, Crown, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface SellerProfile {
  businessName: string;
  description: string;
  email: string;
  phone: string;
  logoUrl: string | null;
  googleMapsLink: string;
  isPro: boolean;
  hideSoldCount: boolean;
}

const defaultProfile: SellerProfile = {
  businessName: "TechHub NG",
  description: "Your one-stop shop for electronics and gadgets",
  email: "hello@techhubng.com",
  phone: "+234 801 234 5678",
  logoUrl: null,
  googleMapsLink: "",
  isPro: false,
  hideSoldCount: false,
};

export default function SellerProfileSettings() {
  const { data: profile, update: setProfile } = useLocalCache<SellerProfile>("riba_seller_profile", defaultProfile);
  const [form, setForm] = useState<SellerProfile>(profile);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "File too large", description: "Logo must be under 2MB", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setForm((prev) => ({ ...prev, logoUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setProfile(form);
    toast({ title: "Profile saved", description: "Your changes have been cached locally." });
  };

  const updateField = (field: keyof SellerProfile, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* PRO Badge */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" /> Account Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{form.isPro ? "PRO Account" : "Free Account"}</p>
              <p className="text-xs text-muted-foreground">
                {form.isPro ? "You can hide your sold count from public view." : "Upgrade to PRO to hide your sold count."}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="pro-toggle" className="text-xs text-muted-foreground">PRO</Label>
              <Switch id="pro-toggle" checked={form.isPro} onCheckedChange={(v) => updateField("isPro", v)} />
            </div>
          </div>
          {form.isPro && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div>
                <p className="text-sm font-medium">Hide Sold Count</p>
                <p className="text-xs text-muted-foreground">Hide the number of products sold from your public profile.</p>
              </div>
              <Switch checked={form.hideSoldCount} onCheckedChange={(v) => updateField("hideSoldCount", v)} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Logo Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Business Logo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div
              className="h-20 w-20 rounded-xl border-2 border-dashed border-muted-foreground/30 flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {form.logoUrl ? (
                <img src={form.logoUrl} alt="Business logo" className="h-full w-full object-cover rounded-xl" />
              ) : (
                <Upload className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div>
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-1" /> Upload Logo
              </Button>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 2MB</p>
            </div>
            <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleLogoUpload} />
          </div>
        </CardContent>
      </Card>

      {/* Store Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Business Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Business Name</Label>
            <Input value={form.businessName} onChange={(e) => updateField("businessName", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => updateField("description", e.target.value)} rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Contact Email</Label>
            <Input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Google Maps Link <span className="text-xs text-muted-foreground">(optional)</span></Label>
            <Input
              placeholder="https://maps.google.com/..."
              value={form.googleMapsLink}
              onChange={(e) => updateField("googleMapsLink", e.target.value)}
            />
            {form.googleMapsLink && (
              <a href={form.googleMapsLink} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                View on Google Maps →
              </a>
            )}
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Badge className="badge-verified">✓ Verified Vendor</Badge>
          </div>
        </CardContent>
      </Card>

      <Button className="btn-profit" onClick={handleSave}>
        <Save className="h-4 w-4 mr-1" /> Save Changes
      </Button>
    </div>
  );
}
