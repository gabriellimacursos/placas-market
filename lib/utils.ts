import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export const BRANDS = [
  "Samsung", "LG", "Midea", "Electrolux", "Carrier",
  "Springer", "Daikin", "Hitachi", "Consul", "Gree", "Philco", "Trane",
];

export const TYPES: Record<string, string> = {
  evaporadora: "Evaporadora",
  condensadora: "Condensadora",
  inversora: "Inversora / Drive",
  display: "Display / Interface",
  fonte: "Fonte de alimentação",
};

export const CONDITIONS: Record<string, string> = {
  nova: "Nova",
  reformada: "Reformada",
  usada: "Usada funcionando",
  sucata: "Retirada de peças",
};

export const WARRANTIES: Record<string, string> = {
  "sem-garantia": "Sem garantia",
  "30-dias": "30 dias",
  "90-dias": "90 dias",
  "6-meses": "6 meses",
  "1-ano": "1 ano",
};

export const STATES = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS",
  "MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC",
  "SP","SE","TO",
];

export const STATUS_COLORS: Record<string, string> = {
  pending:   "bg-yellow-100 text-yellow-800",
  paid:      "bg-blue-100 text-blue-800",
  shipped:   "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export const STATUS_LABELS: Record<string, string> = {
  pending:   "Aguardando pagamento",
  paid:      "Pago — preparar envio",
  shipped:   "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

export const CONDITION_COLORS: Record<string, string> = {
  nova:      "bg-green-100 text-green-800",
  reformada: "bg-blue-100 text-blue-800",
  usada:     "bg-yellow-100 text-yellow-800",
  sucata:    "bg-red-100 text-red-800",
};
