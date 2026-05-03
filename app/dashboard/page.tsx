import Link from "next/link";
import { TrendingUp, Package, Star, Plus, ArrowRight, Clock } from "lucide-react";
import { formatPrice, STATUS_COLORS, STATUS_LABELS, CONDITIONS, CONDITION_COLORS } from "@/lib/utils";
import { cn } from "@/lib/utils";

const DEMO_SELLER_ID = "claudio@placastech.com.br";

async function getDashboard() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000"}/api/dashboard?sellerId=placeholder`,
    { cache: "no-store" }
  );
  if (!res.ok) return null;
  return res.json();
}

async function getListings() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000"}/api/listings`, { cache: "no-store" });
  const data = await res.json();
  return data.listings?.slice(0, 5) ?? [];
}

export default async function DashboardPage() {
  const listings = await getListings();

  const stats = [
    { label: "Anúncios ativos", value: "14", sub: "+3 esta semana", icon: <Package className="w-5 h-5" />, color: "bg-blue-600" },
    { label: "Vendas este mês", value: "R$ 2.840", sub: "↑ 18% vs mês anterior", icon: <TrendingUp className="w-5 h-5" />, color: "bg-green-600", highlight: true },
    { label: "Pedidos pendentes", value: "3", sub: "Aguardando envio", icon: <Clock className="w-5 h-5" />, color: "bg-orange-500" },
    { label: "Avaliação média", value: "4.9 ★", sub: "47 avaliações", icon: <Star className="w-5 h-5" />, color: "bg-yellow-500" },
  ];

  const orders = [
    { id: "1", listing: { title: "Placa Evaporadora Samsung DBB92-00083A" }, buyer: { name: "Carlos T.", state: "SP" }, total: 189.90, status: "paid" },
    { id: "2", listing: { title: "Placa Inversora Midea Liva 12.000 BTU" }, buyer: { name: "Ana R.", state: "RJ" }, total: 279.00, status: "delivered" },
    { id: "3", listing: { title: "Placa Condensadora LG EBR86580208" }, buyer: { name: "Marcos F.", state: "MG" }, total: 380.00, status: "shipped" },
    { id: "4", listing: { title: "Display Electrolux Eco Turbo 9.000 BTU" }, buyer: { name: "João P.", state: "BA" }, total: 89.00, status: "pending" },
  ];

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-extrabold">Painel do Técnico</h1>
            <p className="text-gray-400 text-sm">Bem-vindo, Cláudio — veja como estão seus anúncios e vendas.</p>
          </div>
          <Link href="/vender"
            className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-5 py-2.5 rounded-xl transition text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> Novo anúncio
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3 text-white", s.color)}>
                {s.icon}
              </div>
              <p className="text-gray-400 text-xs mb-1 uppercase tracking-wide">{s.label}</p>
              <p className={cn("text-2xl font-extrabold", s.highlight ? "text-yellow-400" : "text-white")}>{s.value}</p>
              <p className="text-green-400 text-xs mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Últimos pedidos */}
          <div className="lg:col-span-2 bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <h2 className="font-bold">Últimos pedidos</h2>
              <button className="text-blue-400 text-xs hover:underline">Ver todos →</button>
            </div>
            <div className="divide-y divide-gray-700/60">
              {orders.map((o) => (
                <div key={o.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{o.listing.title}</p>
                    <p className="text-xs text-gray-400">{o.buyer.name} • {o.buyer.state}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-sm">{formatPrice(o.total)}</p>
                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold mt-0.5", STATUS_COLORS[o.status])}>
                      {STATUS_LABELS[o.status]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Meus anúncios */}
          <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <h2 className="font-bold">Meus anúncios</h2>
              <Link href="/" className="text-blue-400 text-xs hover:underline">Ver todos →</Link>
            </div>
            <div className="divide-y divide-gray-700/60">
              {listings.map((l: { id: string; title: string; condition: string; price: number; views: number }) => (
                <Link key={l.id} href={`/listing/${l.id}`}
                  className="flex items-center gap-3 px-6 py-3 hover:bg-gray-700/50 transition group">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate group-hover:text-blue-400 transition">{l.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn("inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold", CONDITION_COLORS[l.condition])}>
                        {CONDITIONS[l.condition]}
                      </span>
                      <span className="text-xs text-gray-400">{l.views} views</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-yellow-400">{formatPrice(l.price)}</p>
                    <ArrowRight className="w-3 h-3 text-gray-500 ml-auto mt-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { label: "Novo anúncio", href: "/vender", icon: <Plus className="w-5 h-5" />, color: "bg-blue-600 hover:bg-blue-500" },
            { label: "Ver marketplace", href: "/", icon: <Package className="w-5 h-5" />, color: "bg-gray-700 hover:bg-gray-600" },
            { label: "Minhas vendas", href: "#", icon: <TrendingUp className="w-5 h-5" />, color: "bg-gray-700 hover:bg-gray-600" },
            { label: "Avaliações", href: "#", icon: <Star className="w-5 h-5" />, color: "bg-gray-700 hover:bg-gray-600" },
          ].map((a) => (
            <Link key={a.label} href={a.href}
              className={cn("rounded-2xl p-4 text-center font-semibold text-sm flex flex-col items-center gap-2 transition text-white", a.color)}>
              {a.icon}
              {a.label}
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
