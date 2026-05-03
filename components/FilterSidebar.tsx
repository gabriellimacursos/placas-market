"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { STATES } from "@/lib/utils";

const TYPES = ["evaporadora", "condensadora", "inversora", "display", "fonte"];
const TYPE_LABELS: Record<string, string> = {
  evaporadora: "Evaporadora",
  condensadora: "Condensadora",
  inversora: "Inversora / Drive",
  display: "Display / Interface",
  fonte: "Fonte de alimentação",
};

const CONDITIONS = ["nova", "reformada", "usada", "sucata"];
const CONDITION_LABELS: Record<string, string> = {
  nova: "Nova",
  reformada: "Reformada",
  usada: "Usada funcionando",
  sucata: "Retirada de peças",
};

const WARRANTIES = ["30-dias", "90-dias", "6-meses", "1-ano"];
const WARRANTY_LABELS: Record<string, string> = {
  "30-dias": "30 dias",
  "90-dias": "90 dias",
  "6-meses": "6 meses",
  "1-ano": "1 ano",
};

export default function FilterSidebar() {
  const router = useRouter();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const types = params.getAll("type");
  const conditions = params.getAll("condition");
  const warranties = params.getAll("warranty");
  const state = params.get("state") ?? "";

  function toggle(key: string, value: string) {
    const sp = new URLSearchParams(params.toString());
    const existing = sp.getAll(key);
    sp.delete(key);
    if (existing.includes(value)) {
      existing.filter((v) => v !== value).forEach((v) => sp.append(key, v));
    } else {
      [...existing, value].forEach((v) => sp.append(key, v));
    }
    sp.delete("page");
    startTransition(() => router.push(`/?${sp}`));
  }

  function setParam(key: string, value: string) {
    const sp = new URLSearchParams(params.toString());
    if (value) sp.set(key, value); else sp.delete(key);
    sp.delete("page");
    startTransition(() => router.push(`/?${sp}`));
  }

  function clearAll() {
    startTransition(() => router.push("/"));
  }

  return (
    <aside className="hidden lg:block w-60 shrink-0">
      <div className="bg-white rounded-2xl border border-gray-200 p-5 sticky top-[116px]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-sm text-gray-800 uppercase tracking-wide">Filtros</h2>
          <button onClick={clearAll} className="text-xs text-red-500 hover:underline">Limpar</button>
        </div>

        <Section label="Tipo de placa">
          {TYPES.map((t) => (
            <CheckItem
              key={t}
              label={TYPE_LABELS[t]}
              checked={types.includes(t)}
              onChange={() => toggle("type", t)}
            />
          ))}
        </Section>

        <Divider />

        <Section label="Condição">
          {CONDITIONS.map((c) => (
            <CheckItem
              key={c}
              label={CONDITION_LABELS[c]}
              checked={conditions.includes(c)}
              onChange={() => toggle("condition", c)}
            />
          ))}
        </Section>

        <Divider />

        <Section label="Garantia">
          {WARRANTIES.map((w) => (
            <CheckItem
              key={w}
              label={WARRANTY_LABELS[w]}
              checked={warranties.includes(w)}
              onChange={() => toggle("warranty", w)}
            />
          ))}
        </Section>

        <Divider />

        <Section label="Estado do vendedor">
          <select
            value={state}
            onChange={(e) => setParam("state", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os estados</option>
            {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Section>
      </div>
    </aside>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">{label}</p>
      {children}
    </div>
  );
}

function Divider() {
  return <hr className="border-gray-100 mb-5" />;
}

function CheckItem({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2 text-sm py-1 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange} className="accent-blue-600 w-4 h-4" />
      {label}
    </label>
  );
}
