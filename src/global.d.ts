import { LancerCombat, LancerCombatant, LancerInitiativeConfig } from "lancer-initiative";
import "jquery";

declare global {
  interface CONFIG {
    LancerInitiative: LancerInitiativeConfig<"lancer-initiative">;
  }
  namespace ClientSettings {
    interface Values {
      "lancer-initiative.combat-tracker-appearance": Partial<
        LancerInitiativeConfig["def_appearance"]
      >;
      "lancer-initiative.combat-tracker-sort": boolean;
      "lancer-initiative.combat-tracker-enable-initiative": boolean;
    }
  }
  interface DocumentClassConfig {
    Combat: typeof LancerCombat;
    Combatant: typeof LancerCombatant;
  }
  interface FlagConfig {
    Combatant: {
      "lancer-initiative": {
        activations: LancerCombatant["activations"];
      };
    };
  }
  interface LenientGlobalVariableTypes {
    game: never; // the type doesn't matter
  }
}
