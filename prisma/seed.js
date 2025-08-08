const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  const raw = fs.readFileSync('products.json', 'utf-8');
  const products = JSON.parse(raw);

  console.log(`🚀 ${products.length} ürün import ediliyor...`);

  await prisma.product.createMany({
    data: products.map((p) => ({
      id: p.id,
      koleksiyonu: p.koleksiyonu,
      olcusu: p.olcusu,
      renk: p.renk,
      finish: p.finish,
      imagePath: p.imagePath,
      slug: p.slug,
    })),
    skipDuplicates: true,
  });

  console.log('✅ Import tamamlandı.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 