import type { LancerCombat, LancerCombatant, LancerInitiativeConfig } from "lancer-initiative";

declare global {
  interface DocumentClassConfig {
    Combat: typeof LancerCombat;
    Combatant: typeof LancerCombatant;
  }
  interface LenientGlobalVariableTypes {
    game: never; // the type doesn't matter
  }
}
