import { PrismaClient } from "@prisma/client";
import { seedGlossary } from "./glossary";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  for (const item of seedGlossary) {
    await prisma.glossaryItem.upsert({
      where: { keyword: item.keyword },
      update: { description: item.description, aliases: item.aliases },
      create: item,
    });
  }
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
