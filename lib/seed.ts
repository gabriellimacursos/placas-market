import { prisma } from "./db";

export async function seedDatabase() {
  const count = await prisma.listing.count();
  if (count > 0) return;

  const seller = await prisma.user.upsert({
    where: { email: "claudio@placastech.com.br" },
    update: {},
    create: {
      name: "Cláudio — Técnico Especialista",
      email: "claudio@placastech.com.br",
      phone: "(11) 99999-0001",
      state: "SP",
      city: "São Paulo",
      bio: "15 anos de experiência em reparo de placas eletrônicas de A/C. Especialista em Samsung, LG e Midea.",
      rating: 4.9,
      totalSales: 47,
    },
  });

  const sellers = await Promise.all([
    prisma.user.upsert({
      where: { email: "marcos@placastech.com.br" },
      update: {},
      create: { name: "Marcos Refrigeração", email: "marcos@placastech.com.br", state: "RJ", city: "Rio de Janeiro", rating: 4.7, totalSales: 23 },
    }),
    prisma.user.upsert({
      where: { email: "ana@placastech.com.br" },
      update: {},
      create: { name: "Ana Eletrônica A/C", email: "ana@placastech.com.br", state: "MG", city: "Belo Horizonte", rating: 4.8, totalSales: 31 },
    }),
  ]);

  const listings = [
    {
      title: "Placa Evaporadora Samsung 9.000-12.000 BTU Split Inverter",
      brand: "Samsung", partNumber: "DBB92-00083A", type: "evaporadora",
      condition: "reformada", warranty: "90-dias", price: 189.90,
      description: "Placa reformada com troca dos capacitores de filtro e componentes de proteção. Testada em bancada por 24h antes do envio. Envio via Sedex com nota fiscal e laudo de serviço incluso.",
      compatible: "AR09TSHDB, AR12TSHDB — Split Inverter 9.000-12.000 BTU",
      state: "SP", city: "São Paulo", sellerId: seller.id, views: 142,
    },
    {
      title: "Placa Principal Condensadora LG Dual Inverter 18.000 BTU",
      brand: "LG", partNumber: "EBR86580208", type: "condensadora",
      condition: "nova", warranty: "6-meses", price: 380.00,
      description: "Placa nova original LG. Compatível com linha Dual Inverter S4-W18JA3WA. Nota fiscal inclusa.",
      compatible: "S4-W18JA3WA, US-W182CSG3 — 18.000 BTU Dual Inverter",
      state: "RJ", city: "Rio de Janeiro", sellerId: sellers[0].id, views: 89,
    },
    {
      title: "Placa Inversora / Drive Midea Liva 12.000-24.000 BTU",
      brand: "Midea", partNumber: "201332380044", type: "inversora",
      condition: "reformada", warranty: "90-dias", price: 279.00,
      description: "Placa de inversor reformada com troca do módulo IGBT e capacitores eletrolíticos. Testada em equipamento real.",
      compatible: "MSR-09CR, MSR-12CR, MSR-18CR, MSR-24CR — Liva/Trane",
      state: "MG", city: "Belo Horizonte", sellerId: sellers[1].id, views: 201,
    },
    {
      title: "Placa Display Interface Electrolux Eco Turbo 9.000 BTU",
      brand: "Electrolux", partNumber: "70001690", type: "display",
      condition: "usada", warranty: "30-dias", price: 89.00,
      description: "Placa de display usada, removida de equipamento com defeito no compressor. Display funcionando perfeitamente.",
      compatible: "VI09F, VI12F — Eco Turbo 9.000-12.000 BTU",
      state: "BA", city: "Salvador", sellerId: seller.id, views: 55,
    },
    {
      title: "Placa Condensadora Carrier X-Power 24.000 BTU Inverter",
      brand: "Carrier", partNumber: "30226050", type: "condensadora",
      condition: "reformada", warranty: "6-meses", price: 440.00,
      description: "Reformada com substituição completa dos MOSFETs e capacitores de filtro. Laudo técnico e garantia de 6 meses.",
      compatible: "42XQB024515HC, 38XCC024H515HC — X-Power 24.000 BTU",
      state: "PR", city: "Curitiba", sellerId: sellers[0].id, views: 176,
    },
    {
      title: "Lote 3x Placas Springer Maxiflex com defeito (sucata)",
      brand: "Springer", partNumber: "201338191187", type: "evaporadora",
      condition: "sucata", warranty: "sem-garantia", price: 65.00,
      description: "Lote de 3 placas para retirada de componentes. Transistores, resistores e cristais podem estar bons.",
      compatible: "MB012QBBNA, MB018QBBNA — Maxiflex 12.000-18.000 BTU",
      state: "SP", city: "São Paulo", sellerId: seller.id, views: 38,
    },
    {
      title: "Placa Evaporadora Daikin Advance 12.000 BTU R-32",
      brand: "Daikin", partNumber: "1P527538-1", type: "evaporadora",
      condition: "nova", warranty: "1-ano", price: 520.00,
      description: "Placa nova original importada. Pronta entrega. Compatível com linha Advance R-32 2024.",
      compatible: "FTXB12AXVJU, FTXB35AXVJU — Advance R-32 2024",
      state: "SP", city: "São Paulo", sellerId: sellers[1].id, views: 312,
    },
    {
      title: "Placa Fonte Alimentação Gree G-Tech 9.000-18.000 BTU",
      brand: "Gree", partNumber: "30138374", type: "fonte",
      condition: "reformada", warranty: "90-dias", price: 155.00,
      description: "Fonte reformada com troca dos capacitores principais e diodos retificadores.",
      compatible: "GWH09AGB-K6DNA4A, GWH12AGB-K6DNA4A — G-Tech",
      state: "RJ", city: "Niterói", sellerId: sellers[0].id, views: 67,
    },
  ];

  await prisma.listing.createMany({ data: listings });
}
