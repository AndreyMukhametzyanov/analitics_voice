import type { GlossarySeedRow } from "./types";
import { abbreviationsGlossary } from "./abbreviations";
import { monitoringTablesGlossary } from "./tables-monitoring";
import { purchasesTablesGlossary } from "./tables-purchases";
import { voiceGlossary } from "./voice";

export type { GlossarySeedRow } from "./types";

/** Все строки для `npm run db:seed`. */
export const seedGlossary: GlossarySeedRow[] = [
  ...voiceGlossary,
  ...abbreviationsGlossary,
  ...monitoringTablesGlossary,
  ...purchasesTablesGlossary,
];
