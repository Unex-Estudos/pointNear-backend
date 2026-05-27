import { PrismaClient, UserRole } from '@prisma/client';
import { hashPassword } from '../src/utils/password';
import { createUniqueSlug } from '../src/utils/slug';
import { toPriceRange } from '../src/utils/business-mapper';

const prisma = new PrismaClient();

const categories = [
  { slug: 'alimentacao', label: 'Alimentação', iconName: 'Utensils', color: 'bg-orange-100 text-orange-700' },
  { slug: 'beleza', label: 'Beleza & Estética', iconName: 'Scissors', color: 'bg-pink-100 text-pink-700' },
  { slug: 'saude', label: 'Saúde & Bem-estar', iconName: 'HeartPulse', color: 'bg-red-100 text-red-700' },
  { slug: 'servicos', label: 'Serviços Gerais', iconName: 'Wrench', color: 'bg-blue-100 text-blue-700' },
  { slug: 'moda', label: 'Moda & Vestuário', iconName: 'Shirt', color: 'bg-purple-100 text-purple-700' },
  { slug: 'pet', label: 'Pet Shop & Vet', iconName: 'Dog', color: 'bg-amber-100 text-amber-700' },
  { slug: 'casa', label: 'Casa & Construção', iconName: 'Home', color: 'bg-emerald-100 text-emerald-700' },
  { slug: 'automotivo', label: 'Automotivo', iconName: 'Car', color: 'bg-slate-100 text-slate-700' },
  { slug: 'educacao', label: 'Educação', iconName: 'BookOpen', color: 'bg-indigo-100 text-indigo-700' },
  { slug: 'lazer', label: 'Lazer & Cultura', iconName: 'Ticket', color: 'bg-yellow-100 text-yellow-700' },
];

const standardHours = {
  segunda: { open: '09:00', close: '18:00', closed: false },
  terca: { open: '09:00', close: '18:00', closed: false },
  quarta: { open: '09:00', close: '18:00', closed: false },
  quinta: { open: '09:00', close: '18:00', closed: false },
  sexta: { open: '09:00', close: '18:00', closed: false },
  sabado: { open: '09:00', close: '13:00', closed: false },
  domingo: { open: '00:00', close: '00:00', closed: true },
};

const restaurantHours = {
  segunda: { open: '00:00', close: '00:00', closed: true },
  terca: { open: '11:30', close: '23:00', closed: false },
  quarta: { open: '11:30', close: '23:00', closed: false },
  quinta: { open: '11:30', close: '23:00', closed: false },
  sexta: { open: '11:30', close: '23:30', closed: false },
  sabado: { open: '12:00', close: '23:30', closed: false },
  domingo: { open: '12:00', close: '17:00', closed: false },
};

const businesses = [
  {
    name: 'Padaria Artesanal Pão & Prosa', category: 'alimentacao', subcategories: ['Padaria', 'Cafeteria', 'Doceria'], description: 'Pães de fermentação natural assados diariamente, bolos caseiros e café especial. Um cantinho aconchegante na Vila Madalena para o seu café da manhã ou lanche da tarde.', photos: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800'], address: { street: 'Rua Fradique Coutinho', number: '1234', neighborhood: 'Vila Madalena', city: 'São Paulo', state: 'SP', zip: '05416-001', lat: -23.5559, lng: -46.6871 }, contact: { phone: '(11) 3032-1234', whatsapp: '5511998765432', instagram: '@paoeprosa.sp' }, hours: { ...standardHours, segunda: { open: '07:00', close: '20:00', closed: false }, terca: { open: '07:00', close: '20:00', closed: false }, quarta: { open: '07:00', close: '20:00', closed: false }, quinta: { open: '07:00', close: '20:00', closed: false }, sexta: { open: '07:00', close: '20:00', closed: false }, sabado: { open: '07:00', close: '20:00', closed: false }, domingo: { open: '07:00', close: '14:00', closed: false } }, priceRange: '$$', featured: true, services: [{ name: 'Pão de Levain Tradicional', price: 18, description: 'Pão rústico de fermentação natural' }, { name: 'Croissant de Amêndoas', price: 14.5 }, { name: 'Café Coado Especial', price: 8 }, { name: 'Combo Café da Manhã', price: 32, description: 'Café, suco, pão na chapa e fatia de bolo' }], reviews: [{ authorName: 'Mariana S.', rating: 5, comment: 'O melhor croissant da região! Ambiente super agradável.', date: '2023-10-15' }, { authorName: 'Pedro H.', rating: 4, comment: 'Pães excelentes, mas costuma encher muito aos finais de semana.', date: '2023-09-22' }]
  },
  {
    name: 'Salão de Beleza Studio C', category: 'beleza', subcategories: ['Cabelereiro', 'Manicure', 'Maquiagem'], description: 'Especialistas em loiros, cortes modernos e cuidados com as unhas. Utilizamos apenas produtos premium para garantir a saúde e beleza dos seus fios.', photos: ['https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=800'], address: { street: 'Rua dos Pinheiros', number: '543', neighborhood: 'Pinheiros', city: 'São Paulo', state: 'SP', zip: '05422-010', lat: -23.5672, lng: -46.6845 }, contact: { whatsapp: '5511977665544', instagram: '@studioc.pinheiros' }, hours: { ...standardHours, segunda: { open: '00:00', close: '00:00', closed: true }, terca: { open: '10:00', close: '19:00', closed: false }, quarta: { open: '10:00', close: '19:00', closed: false }, quinta: { open: '10:00', close: '20:00', closed: false }, sexta: { open: '10:00', close: '20:00', closed: false }, sabado: { open: '09:00', close: '18:00', closed: false } }, priceRange: '$$$', featured: true, services: [{ name: 'Corte Feminino', price: 120 }, { name: 'Manicure e Pedicure', price: 65 }, { name: 'Mechas / Luzes', price: 450, description: 'A partir de R$ 450, inclui tratamento' }, { name: 'Hidratação Joico', price: 150 }], reviews: [{ authorName: 'Camila T.', rating: 5, comment: 'A Carol arrasa nos loiros! Meu cabelo nunca esteve tão saudável.', date: '2023-10-02' }]
  },
  {
    name: 'Cantina do Nonno', category: 'alimentacao', subcategories: ['Restaurante', 'Italiana', 'Massas'], description: 'Tradicional cantina italiana no coração da Mooca. Massas frescas feitas diariamente, molhos apurados por horas e um ambiente familiar que te transporta para a Itália.', photos: ['https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=800'], address: { street: 'Rua Juventus', number: '890', neighborhood: 'Mooca', city: 'São Paulo', state: 'SP', zip: '03124-020', lat: -23.5761, lng: -46.5947 }, contact: { phone: '(11) 2273-9988', whatsapp: '5511988776655' }, hours: restaurantHours, priceRange: '$$', featured: true, services: [{ name: 'Lasanha à Bolonhesa', price: 68, description: 'Serve 2 pessoas' }, { name: 'Nhoque Recheado', price: 54 }, { name: 'Tiramisù', price: 22 }, { name: 'Vinho da Casa (Jarra)', price: 45 }], reviews: [{ authorName: 'Roberto M.', rating: 5, comment: 'Comida com gosto de casa de vó. Porções generosas e preço justo.', date: '2023-09-28' }, { authorName: 'Ana L.', rating: 4, comment: 'Ótima comida, mas a fila de espera no domingo é grande.', date: '2023-08-15' }]
  },
  { name: 'Oficina Mecânica Confiança', category: 'automotivo', subcategories: ['Mecânica', 'Revisão', 'Troca de Óleo'], description: 'Há 15 anos cuidando do seu veículo com transparência e honestidade. Realizamos serviços de suspensão, freios, injeção eletrônica e revisões preventivas.', photos: ['https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=800'], address: { street: 'Rua Tuiuti', number: '2100', neighborhood: 'Tatuapé', city: 'São Paulo', state: 'SP', zip: '03307-000', lat: -23.5412, lng: -46.5745 }, contact: { phone: '(11) 2091-4433', whatsapp: '5511955443322' }, hours: standardHours, priceRange: '$$', services: [{ name: 'Troca de Óleo e Filtros', price: 180, description: 'A partir de R$ 180, depende do veículo' }, { name: 'Revisão de Freios', price: 120, description: 'Mão de obra + peças à parte' }, { name: 'Alinhamento e Balanceamento', price: 80 }, { name: 'Scanner Automotivo', price: 100 }], reviews: [{ authorName: 'Carlos E.', rating: 5, comment: 'Difícil achar mecânico honesto hoje em dia. O Seu João explica tudo antes de fazer o serviço.', date: '2023-10-10' }] },
  { name: 'Pet Shop Cão Feliz', category: 'pet', subcategories: ['Banho e Tosa', 'Rações', 'Acessórios'], description: 'O melhor cuidado para o seu melhor amigo. Oferecemos banho quentinho, tosa na tesoura, rações super premium e uma variedade de brinquedos e acessórios.', photos: ['https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800'], address: { street: 'Rua Joaquim Floriano', number: '456', neighborhood: 'Itaim Bibi', city: 'São Paulo', state: 'SP', zip: '04534-002', lat: -23.5835, lng: -46.6742 }, contact: { whatsapp: '5511944332211', instagram: '@caofeliz.itaim' }, hours: { ...standardHours, sabado: { open: '09:00', close: '16:00', closed: false } }, priceRange: '$$', featured: true, services: [{ name: 'Banho Cães Pequenos', price: 55 }, { name: 'Banho e Tosa Higiênica', price: 75 }, { name: 'Tosa na Tesoura', price: 120 }, { name: 'Hidratação de Pelagem', price: 35 }], reviews: [{ authorName: 'Juliana F.', rating: 5, comment: 'Meu poodle volta cheiroso e super calmo. As meninas do banho são muito carinhosas.', date: '2023-09-05' }] },
  { name: 'Farmácia Vida & Saúde', category: 'saude', subcategories: ['Farmácia', 'Perfumaria', 'Manipulação'], description: 'Sua farmácia de bairro com atendimento personalizado. Entregamos em domicílio na região sem taxa de entrega para compras acima de R$ 50.', photos: ['https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=800'], address: { street: 'Av. Lins de Vasconcelos', number: '1500', neighborhood: 'Vila Mariana', city: 'São Paulo', state: 'SP', zip: '01538-001', lat: -23.5812, lng: -46.6254 }, contact: { phone: '(11) 5083-1122', whatsapp: '5511933221100' }, hours: { ...standardHours, segunda: { open: '07:00', close: '22:00', closed: false }, terca: { open: '07:00', close: '22:00', closed: false }, quarta: { open: '07:00', close: '22:00', closed: false }, quinta: { open: '07:00', close: '22:00', closed: false }, sexta: { open: '07:00', close: '22:00', closed: false }, sabado: { open: '08:00', close: '20:00', closed: false }, domingo: { open: '08:00', close: '14:00', closed: false } }, priceRange: '$', services: [{ name: 'Aferição de Pressão', price: 0, description: 'Gratuito' }, { name: 'Aplicação de Injeção', price: 15, description: 'Com receita médica' }, { name: 'Teste de Glicemia', price: 10 }], reviews: [] },
  { name: 'Papelaria Criativa', category: 'servicos', subcategories: ['Papelaria', 'Presentes', 'Impressões'], description: 'Tudo para escritório, material escolar e presentes criativos. Fazemos impressões, encadernações e plastificações na hora.', photos: ['https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80&w=800'], address: { street: 'Rua Augusta', number: '2500', neighborhood: 'Cerqueira César', city: 'São Paulo', state: 'SP', zip: '01412-100', lat: -23.5615, lng: -46.6623 }, contact: { whatsapp: '5511922110099' }, hours: standardHours, priceRange: '$', services: [{ name: 'Impressão P&B', price: 0.5, description: 'Por página' }, { name: 'Impressão Colorida', price: 2, description: 'Por página' }, { name: 'Encadernação Espiral', price: 8, description: 'Até 100 folhas' }, { name: 'Plastificação A4', price: 5 }], reviews: [] },
  { name: 'Açaí do Bairro', category: 'alimentacao', subcategories: ['Açaí', 'Sucos', 'Lanches Naturais'], description: 'O verdadeiro açaí, batido na hora com xarope de guaraná ou puro. Mais de 30 opções de acompanhamentos para você montar do seu jeito.', photos: ['https://images.unsplash.com/photo-1590165482129-1b8b27698780?auto=format&fit=crop&q=80&w=800'], address: { street: 'Av. Pompeia', number: '1200', neighborhood: 'Pompeia', city: 'São Paulo', state: 'SP', zip: '05022-001', lat: -23.5312, lng: -46.6854 }, contact: { whatsapp: '5511911009988', instagram: '@acaidobairro.sp' }, hours: { ...standardHours, segunda: { open: '12:00', close: '20:00', closed: false }, terca: { open: '12:00', close: '20:00', closed: false }, quarta: { open: '12:00', close: '20:00', closed: false }, quinta: { open: '12:00', close: '20:00', closed: false }, sexta: { open: '12:00', close: '22:00', closed: false }, sabado: { open: '12:00', close: '22:00', closed: false }, domingo: { open: '14:00', close: '20:00', closed: false } }, priceRange: '$', featured: true, services: [{ name: 'Copo 300ml', price: 14, description: 'Inclui 2 acompanhamentos' }, { name: 'Copo 500ml', price: 18, description: 'Inclui 3 acompanhamentos' }, { name: 'Barca de Açaí', price: 45, description: 'Serve 3 pessoas' }, { name: 'Suco Natural', price: 9 }], reviews: [{ authorName: 'Lucas M.', rating: 5, comment: 'Melhor açaí da Pompeia! Textura perfeita e não é muito doce.', date: '2023-10-20' }] },
  { name: 'Barbearia Clássica', category: 'beleza', subcategories: ['Barbearia', 'Cabelo Masculino'], description: 'Corte na tesoura, barba com toalha quente e navalha. Um ambiente retrô com cerveja gelada e sinuca enquanto você espera.', photos: ['https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800'], address: { street: 'Rua da Mooca', number: '3000', neighborhood: 'Mooca', city: 'São Paulo', state: 'SP', zip: '03165-000', lat: -23.5623, lng: -46.5987 }, contact: { whatsapp: '5511900998877', instagram: '@barbeariaclassica.mooca' }, hours: { ...standardHours, segunda: { open: '00:00', close: '00:00', closed: true }, terca: { open: '10:00', close: '20:00', closed: false }, quarta: { open: '10:00', close: '20:00', closed: false }, quinta: { open: '10:00', close: '21:00', closed: false }, sexta: { open: '10:00', close: '21:00', closed: false }, sabado: { open: '09:00', close: '19:00', closed: false } }, priceRange: '$$', services: [{ name: 'Corte Máquina e Tesoura', price: 45 }, { name: 'Barba Tradicional', price: 35, description: 'Com toalha quente' }, { name: 'Combo Cabelo + Barba', price: 70 }, { name: 'Sobrancelha', price: 15 }], reviews: [] },
  { name: 'Lavanderia Bolha de Sabão', category: 'servicos', subcategories: ['Lavanderia', 'Passadoria'], description: 'Cuidamos das suas roupas com carinho. Lavagem a seco, tapetes, cortinas e roupas de festa. Serviço de leva e traz disponível.', photos: ['https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&q=80&w=800'], address: { street: 'Rua Domingos de Morais', number: '800', neighborhood: 'Vila Mariana', city: 'São Paulo', state: 'SP', zip: '04010-100', lat: -23.5845, lng: -46.6341 }, contact: { phone: '(11) 5571-3344', whatsapp: '5511999887766' }, hours: standardHours, priceRange: '$$', services: [{ name: 'Lavagem Cesto (até 20 peças)', price: 65 }, { name: 'Camisa Social (Lavar e Passar)', price: 12 }, { name: 'Terno Completo', price: 45 }, { name: 'Edredom Casal', price: 55 }], reviews: [] },
  { name: 'Boutique Maria Bonita', category: 'moda', subcategories: ['Roupas Femininas', 'Acessórios'], description: 'Moda feminina contemporânea com peças exclusivas e curadoria especial. Vestidos, blusas, calças e acessórios para todas as ocasiões.', photos: ['https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=800'], address: { street: 'Rua Oscar Freire', number: '100', neighborhood: 'Jardins', city: 'São Paulo', state: 'SP', zip: '01426-000', lat: -23.5641, lng: -46.6667 }, contact: { whatsapp: '5511988776655', instagram: '@boutiquemariabonita' }, hours: { ...standardHours, sabado: { open: '10:00', close: '18:00', closed: false } }, priceRange: '$$$', services: [{ name: 'Vestidos de Festa', price: 350, description: 'A partir de R$ 350' }, { name: 'Blusas Casuais', price: 89, description: 'A partir de R$ 89' }, { name: 'Calças Alfaiataria', price: 180 }, { name: 'Consultoria de Estilo', price: 0, description: 'Cortesia na loja' }], reviews: [] },
  { name: 'Sapataria Rápida Passo Certo', category: 'servicos', subcategories: ['Sapataria', 'Consertos', 'Chaveiro'], description: 'Conserto de calçados, bolsas e malas. Troca de saltos, solados, zíperes e tingimento. Serviço de chaveiro também disponível.', photos: ['https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&q=80&w=800'], address: { street: 'Av. Santo Amaro', number: '3500', neighborhood: 'Brooklin', city: 'São Paulo', state: 'SP', zip: '04555-001', lat: -23.6123, lng: -46.6812 }, contact: { phone: '(11) 5044-2211', whatsapp: '5511999999999' }, hours: standardHours, priceRange: '$', services: [{ name: 'Troca de Salto Feminino', price: 25 }, { name: 'Meia Sola Masculina', price: 45 }, { name: 'Troca de Zíper (Bolsa)', price: 35 }, { name: 'Cópia de Chave Simples', price: 10 }], reviews: [] },
];

const dayMap: Record<string, 'SEGUNDA' | 'TERCA' | 'QUARTA' | 'QUINTA' | 'SEXTA' | 'SABADO' | 'DOMINGO'> = {
  segunda: 'SEGUNDA',
  terca: 'TERCA',
  quarta: 'QUARTA',
  quinta: 'QUINTA',
  sexta: 'SEXTA',
  sabado: 'SABADO',
  domingo: 'DOMINGO',
};

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.reviewComment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.service.deleteMany();
  await prisma.businessHour.deleteMany();
  await prisma.businessSubcategory.deleteMany();
  await prisma.businessPhoto.deleteMany();
  await prisma.business.deleteMany();
  await prisma.category.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  const [admin, merchant, customer] = await Promise.all([
    prisma.user.create({ data: { name: 'Administrador PointNear', email: 'admin@pointnear.local', passwordHash: await hashPassword('Admin123!'), role: UserRole.ADMIN } }),
    prisma.user.create({ data: { name: 'Comerciante Demo', email: 'merchant@pointnear.local', passwordHash: await hashPassword('Merchant123!'), role: UserRole.MERCHANT } }),
    prisma.user.create({ data: { name: 'Cliente Demo', email: 'cliente@pointnear.local', passwordHash: await hashPassword('Cliente123!'), role: UserRole.CUSTOMER } }),
  ]);

  await Promise.all(categories.map((category) => prisma.category.create({ data: category })));

  for (const item of businesses) {
    const category = await prisma.category.findUniqueOrThrow({ where: { slug: item.category } });
    const business = await prisma.business.create({
      data: {
        slug: createUniqueSlug(item.name, Math.random().toString(36).slice(2, 8)),
        name: item.name,
        description: item.description,
        status: 'APPROVED',
        priceRange: toPriceRange(item.priceRange),
        featured: Boolean(item.featured),
        categoryId: category.id,
        ownerId: merchant.id,
        street: item.address.street,
        number: item.address.number,
        neighborhood: item.address.neighborhood,
        city: item.address.city,
        state: item.address.state,
        zip: item.address.zip,
        lat: item.address.lat,
        lng: item.address.lng,
        phone: item.contact.phone ?? null,
        whatsapp: item.contact.whatsapp ?? null,
        instagram: item.contact.instagram ?? null,
        email: (item.contact as { email?: string }).email ?? null,
      },
    });

    await prisma.businessPhoto.createMany({ data: item.photos.map((url, position) => ({ businessId: business.id, url, position })) });
    await prisma.businessSubcategory.createMany({ data: item.subcategories.map((name) => ({ businessId: business.id, name })) });
    await prisma.businessHour.createMany({ data: Object.entries(item.hours).map(([day, value]) => ({ businessId: business.id, day: dayMap[day], open: value.open, close: value.close, closed: value.closed })) });
    await prisma.service.createMany({ data: item.services.map((service) => ({ businessId: business.id, name: service.name, price: service.price, description: service.description ?? null })) });

    for (const review of item.reviews) {
      await prisma.review.create({ data: { businessId: business.id, userId: customer.id, authorName: review.authorName, rating: review.rating, comment: review.comment, createdAt: new Date(review.date) } });
    }
  }

  console.log('Seed concluído.');
  console.log(`Admin: ${admin.email} / Admin123!`);
  console.log(`Merchant: ${merchant.email} / Merchant123!`);
  console.log(`Cliente: ${customer.email} / Cliente123!`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
