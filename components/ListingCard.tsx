import Link from "next/link";
import { Star, MapPin, ShieldCheck } from "lucide-react";
import { formatPrice, CONDITION_COLORS, CONDITIONS, WARRANTIES } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Listing = {
  id: string;
  title: string;
  brand: string;
  partNumber: string;
  type: string;
  condition: string;
  warranty: string;
  price: number;
  state: string;
  city: string;
  views: number;
  seller: { name: string; rating: number; totalSales: number };
};

export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link href={`/listing/${listing.id}`} className="group block">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
        <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 h-44 flex items-center justify-center">
          <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 64 64">
            <rect x="4" y="12" width="56" height="36" rx="4" strokeWidth={1.5} />
            <rect x="10" y="18" width="16" height="10" rx="2" />
            <rect x="30" y="18" width="6" height="6" rx="1" />
            <rect x="40" y="18" width="6" height="6" rx="1" />
            <circle cx="12" cy="36" r="2" />
            <circle cx="20" cy="36" r="2" />
            <line x1="30" y1="30" x2="54" y2="30" strokeWidth={1.2} />
            <line x1="30" y1="34" x2="54" y2="34" strokeWidth={1.2} />
          </svg>

          <span className={cn("absolute top-3 left-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold", CONDITION_COLORS[listing.condition])}>
            {CONDITIONS[listing.condition] ?? listing.condition}
          </span>

          {listing.condition === "reformada" && (
            <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Testada
            </span>
          )}
        </div>

        <div className="p-4">
          <p className="text-xs text-gray-400 font-medium mb-1">
            {listing.brand} • {listing.partNumber}
          </p>
          <h3 className="font-bold text-gray-900 text-sm mb-2 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
            {listing.title}
          </h3>

          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={cn("w-3 h-3", i < Math.round(listing.seller.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200")} />
              ))}
            </div>
            <span className="text-xs text-gray-500">({listing.seller.totalSales})</span>
          </div>

          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-xl font-extrabold text-gray-900">
                {formatPrice(listing.price)}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3 h-3 text-green-600" />
                <p className="text-xs text-green-600 font-medium">
                  {WARRANTIES[listing.warranty] ?? listing.warranty}
                </p>
                <span className="text-gray-300">•</span>
                <MapPin className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-400">{listing.state}</span>
              </div>
            </div>
            <span className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition">
              Ver detalhes
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
