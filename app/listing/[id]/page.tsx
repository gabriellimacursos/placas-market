import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, MapPin, ShieldCheck, MessageCircle, Package, Eye } from "lucide-react";
import { formatPrice, TYPES, CONDITIONS, WARRANTIES, CONDITION_COLORS } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

async function getListing(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000"}/api/listings/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function ListingPage({ params }: Props) {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) notFound();

  const { seller } = listing;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition mb-6">
        <ArrowLeft className="w-4 h-4" /> Voltar para listagem
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Imagem */}
        <div>
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl h-72 flex items-center justify-center mb-4">
            <svg className="w-32 h-32 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 64 64">
              <rect x="4" y="12" width="56" height="36" rx="4" strokeWidth={1.5} />
              <rect x="10" y="18" width="16" height="10" rx="2" />
              <rect x="30" y="18" width="6" height="6" rx="1" />
              <rect x="40" y="18" width="6" height="6" rx="1" />
              <circle cx="12" cy="36" r="2" />
              <circle cx="20" cy="36" r="2" />
              <line x1="30" y1="30" x2="54" y2="30" strokeWidth={1.2} />
              <line x1="30" y1="34" x2="54" y2="34" strokeWidth={1.2} />
            </svg>
          </div>
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={cn("w-20 h-20 rounded-xl border-2 bg-gray-100", i === 0 ? "border-blue-500" : "border-gray-200")} />
            ))}
          </div>
        </div>

        {/* Detalhes */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold", CONDITION_COLORS[listing.condition])}>
              {CONDITIONS[listing.condition] ?? listing.condition}
            </span>
            {listing.condition === "reformada" && (
              <span className="inline-flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" /> Testada
              </span>
            )}
          </div>

          <h1 className="text-2xl font-extrabold text-gray-900 mb-2 leading-snug">{listing.title}</h1>
          <p className="text-sm text-gray-400 mb-5">Código: {listing.partNumber} • {listing.brand}</p>

          <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
            <InfoBox label="Tipo" value={TYPES[listing.type] ?? listing.type} />
            <InfoBox label="Condição" value={CONDITIONS[listing.condition] ?? listing.condition} />
            <InfoBox label="Garantia" value={WARRANTIES[listing.warranty] ?? listing.warranty} color="text-green-700" />
            <InfoBox label="Localização" value={`${listing.city} – ${listing.state}`} />
          </div>

          {listing.compatible && (
            <div className="bg-blue-50 rounded-xl p-3 mb-5">
              <p className="text-xs font-semibold text-blue-700 mb-1">Compatível com:</p>
              <p className="text-sm text-blue-900">{listing.compatible}</p>
            </div>
          )}

          <div className="mb-5">
            <p className="text-3xl font-extrabold text-gray-900">{formatPrice(listing.price)}</p>
            <p className="text-xs text-gray-400 mt-1">+ frete calculado no checkout</p>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm">
              <Package className="w-4 h-4" /> Comprar agora
            </button>
            <button className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm">
              <MessageCircle className="w-4 h-4" /> Falar com vendedor
            </button>
          </div>

          <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-400">
            <Eye className="w-3.5 h-3.5" />
            <span>{listing.views} visualizações</span>
          </div>
        </div>
      </div>

      {/* Descrição */}
      {listing.description && (
        <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-bold text-lg mb-3">Informações técnicas</h2>
          <p className="text-gray-600 text-sm leading-relaxed">{listing.description}</p>
        </div>
      )}

      {/* Vendedor */}
      <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-bold text-lg mb-4">Sobre o vendedor</h2>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0">
            {seller.name[0]}
          </div>
          <div className="flex-1">
            <p className="font-bold">{seller.name}</p>
            <p className="text-sm text-gray-500">{seller.totalSales} vendas • {seller.state}</p>
            <div className="flex items-center gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={cn("w-3.5 h-3.5", i < Math.round(seller.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200")} />
              ))}
              <span className="text-xs text-gray-500 ml-1">{seller.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {seller.received?.length > 0 && (
          <div className="mt-5">
            <h3 className="font-semibold text-sm mb-3">Últimas avaliações</h3>
            <div className="space-y-3">
              {seller.received.map((r: { id: string; rating: number; comment: string; reviewer: { name: string } }) => (
                <div key={r.id} className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={cn("w-3 h-3", i < r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200")} />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">{r.reviewer.name}</span>
                  </div>
                  {r.comment && <p className="text-xs text-gray-600">{r.comment}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoBox({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className={cn("font-semibold text-sm", color ?? "text-gray-900")}>{value}</p>
    </div>
  );
}
