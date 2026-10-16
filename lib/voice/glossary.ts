import { prisma } from '../prisma';
import { compileGlossary, type CompiledGlossary } from './transcript';

const TTL_MS = Number(process.env.GLOSSARY_TTL_MS ?? 30_000);

type GlossaryCache = {
  loadedAt: number;
  glossary: CompiledGlossary;
};

const globalForGlossary = globalThis as unknown as { glossaryCache?: GlossaryCache };

export async function getGlossary(): Promise<CompiledGlossary> {
  const cache = globalForGlossary.glossaryCache;
  if (cache && Date.now() - cache.loadedAt < TTL_MS) {
    return cache.glossary;
  }

  const items = await prisma.glossaryItem.findMany();
  const glossary = compileGlossary(items);
  globalForGlossary.glossaryCache = { loadedAt: Date.now(), glossary };
  return glossary;
}
