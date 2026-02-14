import { MapPin, Clock, Phone, ExternalLink } from "lucide-react";

interface StoreInfo {
  name: string;
  description: string;
  location: string;
  hours: string;
  phone: string;
  googleMapsLink: string;
}

export default function StoreProfileAbout({ store }: { store: StoreInfo }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-2">About {store.name}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{store.description}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <MapPin className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Location</p>
            <p className="text-sm font-medium">{store.location}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <Clock className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Hours</p>
            <p className="text-sm font-medium">{store.hours}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <Phone className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Phone</p>
            <p className="text-sm font-medium">{store.phone}</p>
          </div>
        </div>
        {store.googleMapsLink && (
          <a href={store.googleMapsLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
            <ExternalLink className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Store Location</p>
              <p className="text-sm font-medium text-primary">View on Google Maps</p>
            </div>
          </a>
        )}
      </div>
    </div>
  );
}
