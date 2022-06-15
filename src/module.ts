// Get the proper type data for the combat tracker
import type { LancerCombat, LancerCombatant } from "lancer-initiative";

Hooks.once("ready", () => {
  // Only a gm can approve, so only register the socket handler for them
  if (!game.user?.isGM) return;
  console.log("li-player-request | Registering socket callback");

  game.socket?.on(
    "module.li-player-request",
    function (data: { combat: string; combatant: string; user: string; scene: string }) {
      if (!game.combats || !game.users) return;
      // Get data to pass to the form
      const combat = game.combats.find(
        (c: LancerCombat) => c.id === data.combat
      ) as LancerCombat | null;
      if (!combat) return;
      const combatant = <LancerCombatant | undefined>(
        combat.getEmbeddedDocument("Combatant", data.combatant)
      );
      const combatant_name = combatant?.token?.name ?? combatant?.name ?? "";
      const player_name = game.users.get(data.user)?.name ?? "";

      let prompt = new Dialog({
        title: "Activation Request",
        content: `<p>${player_name} is requesting for ${combatant_name} to go.</p>`,
        buttons: {
          confirm: {
            icon: '<i class="fas fa-check"></i>',
            label: "Allow",
            callback: () => combat.activateCombatant(data.combatant),
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: "Deny",
          },
        },
        default: "cancel",
      });
      prompt.render(true);
    }
  );
});

/** This hook runs whenever a player that doesn't have permission to modify the
 * combat tracker clicks the activation button of a unit that still has
 * activations left. The hook passes the combat, the combatant id, and the user
 * id of the user that clicked the button.
 */
Hooks.on("LancerCombatRequestActivate", (combat: LancerCombat, combatantId: string) => {
  if (!ui.notifications) return;
  // Only request for owned combatants that have activations available
  const combatant = <LancerCombatant|undefined>combat.getEmbeddedDocument("Combatant", combatantId);
  if (
    !combatant ||
    !isActivations(combatant.getFlag(CONFIG.LancerInitiative.module, "activations")) ||
    !combatant.isOwner ||
    (combatant.getFlag(CONFIG.LancerInitiative.module, "activations").value ?? 0) < 1 ||
    !combat.started
  ) {
    return;
  }

  // send a request to activate to the GM(s)
  console.log("Sending activation request for " + combatantId);
  ui.notifications.info("Sending request to go next.");
  game.socket?.emit("module.li-player-request", {
    scene: combat.scene?.id,
    combat: combat.id,
    combatant: combatantId,
    user: game.userId,
  });
});

/**
 * Typeguard for activations flag of combatants
 */
function isActivations(
  v: any // eslint-disable-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
  // eslint hates typeguards
): v is LancerCombatant['activations'] {
  return (
    typeof v === "object" &&
    (typeof v.max === "undefined" || typeof v.max === "number") &&
    (typeof v.value === "undefined" || typeof v.value === "number")
  );
}
