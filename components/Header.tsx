"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, Suspense } from "react";
import { Search, Bell, CircuitBoard, LayoutDashboard, Plus } from "lucide-react";
import { BRANDS } from "@/lib/utils";

function HeaderContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [, startTransition] = useTransition();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    startTransition(() => {
      const sp = new URLSearchParams(params.toString());
      if (q) sp.set("q", q); else sp.delete("q");
      sp.delete("page");
      router.push(`/?${sp}`);
    });
  }

  function filterBrand(brand: string) {
    const sp = new URLSearchParams(params.toString());
    if (brand === "todas") sp.delete("brand"); else sp.set("brand", brand);
    sp.delete("page");
    router.push(`/?${sp}`);
  }

  const activeBrand = params.get("brand");

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <CircuitBoard className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-gray-900 leading-none hidden sm:block">
            Placas<span className="text-blue-600">Tech</span>
          </span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-xl relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por marca, modelo, código da placa..."
            className="w-full pl-9 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
        </form>

        <nav className="hidden md:flex items-center gap-1 text-sm font-medium shrink-0">
          <Link href="/" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition">
            <Search className="w-4 h-4" /> Comprar
          </Link>
          <Link href="/vender" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition">
            <Plus className="w-4 h-4" /> Vender
          </Link>
          <Link href="/dashboard" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition">
            <LayoutDashboard className="w-4 h-4" /> Painel
          </Link>
        </nav>

        <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition shrink-0">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
      </div>

      <div className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 flex gap-1.5 overflow-x-auto py-2 text-xs font-semibold scrollbar-none">
          <button
            onClick={() => filterBrand("todas")}
            className={`shrink-0 px-3 py-1.5 rounded-lg transition ${!activeBrand ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-blue-400"}`}
          >
            Todas as marcas
          </button>
          {BRANDS.map((b) => (
            <button
              key={b}
              onClick={() => filterBrand(b)}
              className={`shrink-0 px-3 py-1.5 rounded-lg transition ${activeBrand === b ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-blue-400"}`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

export default function Header() {
  return (
    <Suspense fallback={<div className="h-[108px] bg-white border-b border-gray-200" />}>
      <HeaderContent />
    </Suspense>
  );
}
