import { Suspense } from "react";
import Link from "next/link";
import { TrendingUp, Users, ThumbsUp, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import FilterSidebar from "@/components/FilterSidebar";
import ListingCard from "@/components/ListingCard";

type SearchParams = Promise<Record<string, string | string[]>>;

async function getListings(params: Record<string, string | string[]>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (Array.isArray(v)) v.forEach((i) => sp.append(k, i));
    else if (v) sp.set(k, v);
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000"}/api/listings?${sp}`, {
    cache: "no-store",
  });
  return res.json();
}

async function ListingsGrid({ params }: { params: Record<string, string | string[]> }) {
  const { listings, total, page, pages } = await getListings(params);
  const currentPage = Number(params.page ?? 1);

  if (!listings?.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803M10.5 7.5v6m3-3H7.5" />
          </svg>
        </div>
        <h3 className="font-bold text-gray-700 mb-1">Nenhuma placa encontrada</h3>
        <p className="text-sm text-gray-400">Tente outros filtros ou termos de busca.</p>
      </div>
    );
  }

  const buildPageUrl = (p: number) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (Array.isArray(v)) v.forEach((i) => sp.append(k, i));
      else if (v) sp.set(k, v);
    }
    sp.set("page", String(p));
    return `/?${sp}`;
  };

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-900">{total}</span> placa{total !== 1 ? "s" : ""} encontrada{total !== 1 ? "s" : ""}
        </p>
        <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Mais recentes</option>
          <option>Menor preço</option>
          <option>Maior preço</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {listings.map((l: Parameters<typeof ListingCard>[0]["listing"]) => (
          <ListingCard key={l.id} listing={l} />
        ))}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <Link href={buildPageUrl(currentPage - 1)}
            className="w-9 h-9 rounded-lg border border-gray-200 text-gray-400 flex items-center justify-center hover:bg-gray-50">
            <ChevronLeft className="w-4 h-4" />
          </Link>
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <Link key={p} href={buildPageUrl(p)}
              className={`w-9 h-9 rounded-lg text-sm font-semibold flex items-center justify-center transition ${p === currentPage ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              {p}
            </Link>
          ))}
          <Link href={buildPageUrl(currentPage + 1)}
            className="w-9 h-9 rounded-lg border border-gray-200 text-gray-400 flex items-center justify-center hover:bg-gray-50">
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  return (
    <>
      <section className="bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-3">
              Para técnicos de A/C
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3">
              O maior marketplace de<br />
              <span className="text-yellow-300">placas eletrônicas</span> de A/C<br />
              do Brasil
            </h1>
            <p className="text-blue-100 mb-5 max-w-lg text-sm">
              Compre e venda placas de evaporadora, condensadora e inversoras. Peças testadas, com garantia e entregues em todo o país.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/vender"
                className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-5 py-2.5 rounded-xl transition shadow-lg text-sm flex items-center gap-2">
                <Plus className="w-4 h-4" /> Anunciar placa
              </Link>
              <Link href="/dashboard"
                className="bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold px-5 py-2.5 rounded-xl transition text-sm">
                Ver meu painel
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 shrink-0">
            {[
              { icon: <TrendingUp className="w-5 h-5" />, value: "1.240", label: "Placas anunciadas" },
              { icon: <Users className="w-5 h-5" />, value: "380", label: "Técnicos cadastrados" },
              { icon: <ThumbsUp className="w-5 h-5" />, value: "98%", label: "Avaliações positivas" },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 border border-white/20 rounded-2xl p-4 text-center">
                <div className="text-blue-200 flex justify-center mb-1">{s.icon}</div>
                <div className="text-2xl font-extrabold">{s.value}</div>
                <div className="text-blue-200 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-8 flex gap-6">
        <Suspense fallback={<div className="hidden lg:block w-60 shrink-0" />}>
          <FilterSidebar />
        </Suspense>
        <Suspense fallback={
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 h-72 animate-pulse" />
            ))}
          </div>
        }>
          <ListingsGrid params={params} />
        </Suspense>
      </main>
    </>
  );
}
