"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, CheckCircle } from "lucide-react";
import { BRANDS, STATES } from "@/lib/utils";

const TYPES = [
  { value: "evaporadora", label: "Evaporadora" },
  { value: "condensadora", label: "Condensadora" },
  { value: "inversora", label: "Inversora / Drive" },
  { value: "display", label: "Display / Interface" },
  { value: "fonte", label: "Fonte de alimentação" },
];

const CONDITIONS = [
  { value: "nova", label: "Nova" },
  { value: "reformada", label: "Reformada / Recondicionada" },
  { value: "usada", label: "Usada funcionando" },
  { value: "sucata", label: "Para retirada de peças" },
];

const WARRANTIES = [
  { value: "sem-garantia", label: "Sem garantia" },
  { value: "30-dias", label: "30 dias" },
  { value: "90-dias", label: "90 dias" },
  { value: "6-meses", label: "6 meses" },
  { value: "1-ano", label: "1 ano" },
];

export default function VenderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    title: "", brand: "", partNumber: "", type: "evaporadora",
    condition: "reformada", warranty: "90-dias", price: "",
    description: "", compatible: "", state: "SP", city: "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: Number(form.price), sellerId: "demo-seller" }),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/"), 2000);
      }
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Anúncio publicado!</h2>
        <p className="text-gray-500 text-sm">Redirecionando para o marketplace...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition mb-6">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Link>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Anunciar placa</h1>
        <p className="text-sm text-gray-400 mb-6">Preencha as informações da placa para publicar no marketplace.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Título do anúncio *">
            <input required value={form.title} onChange={(e) => set("title", e.target.value)}
              placeholder="Ex: Placa Evaporadora Samsung 9.000-12.000 BTU Split Inverter"
              className={input} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Marca *">
              <select required value={form.brand} onChange={(e) => set("brand", e.target.value)} className={input}>
                <option value="">Selecione</option>
                {BRANDS.map((b) => <option key={b}>{b}</option>)}
              </select>
            </Field>
            <Field label="Tipo de placa *">
              <select value={form.type} onChange={(e) => set("type", e.target.value)} className={input}>
                {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Código / Part Number *">
            <input required value={form.partNumber} onChange={(e) => set("partNumber", e.target.value)}
              placeholder="Ex: DBB92-00083A" className={input} />
          </Field>

          <Field label="Modelos de A/C compatíveis">
            <input value={form.compatible} onChange={(e) => set("compatible", e.target.value)}
              placeholder="Ex: AR09TSHDB, AR12TSHDB — Split Inverter 9.000-12.000 BTU" className={input} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Condição *">
              <select value={form.condition} onChange={(e) => set("condition", e.target.value)} className={input}>
                {CONDITIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </Field>
            <Field label="Garantia *">
              <select value={form.warranty} onChange={(e) => set("warranty", e.target.value)} className={input}>
                {WARRANTIES.map((w) => <option key={w.value} value={w.value}>{w.label}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Preço (R$) *">
            <input required type="number" min="0" step="0.01" value={form.price}
              onChange={(e) => set("price", e.target.value)}
              placeholder="0,00" className={input} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Estado *">
              <select value={form.state} onChange={(e) => set("state", e.target.value)} className={input}>
                {STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Cidade *">
              <input required value={form.city} onChange={(e) => set("city", e.target.value)}
                placeholder="Ex: São Paulo" className={input} />
            </Field>
          </div>

          <Field label="Descrição técnica">
            <textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)}
              placeholder="Descreva o que foi feito, defeitos corrigidos, componentes trocados, tempo de teste..."
              className={`${input} resize-none`} />
          </Field>

          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-400 transition cursor-pointer">
            <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500 font-medium">Clique para adicionar fotos da placa</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG até 10MB cada (máximo 5 fotos)</p>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition text-sm">
            {loading ? "Publicando..." : "Publicar anúncio grátis"}
          </button>

          <p className="text-center text-xs text-gray-400">
            Ao publicar você concorda com os <a href="#" className="text-blue-600 hover:underline">Termos de uso</a>.
            Comissão de 8% apenas em vendas realizadas.
          </p>
        </form>
      </div>
    </div>
  );
}

const input = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
