// Get the proper type data for the combat tracker
import { LancerCombat } from "lancer-initiative";

Hooks.once("ready", () => {
  // Only a gm can approve, so only register the socket handler for them
  if (!game || !game.user) return;
  if (!game.user.isGM) return;
  console.log("li-player-request | Registering socket callback");

  game.socket.on("module.li-player-request", function (data: {
    combat: string;
    combatant: string;
    user: string;
    scene: string;
  }) {
    if (!game || !game.combats || !game.users) return;
    // Get data to pass to the form
    const combat = game.combats.find(c => c.id === data.combat) as LancerCombat;
    const combatant = combat.getCombatant(data.combatant);
    const combatant_name = (combatant.token?.name ?? combatant.name) as string;
    const player_name = game.users.get(data.user)?.name;

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
  });
});

/** This hook runs whenever a player that doesn't have permission to modify the
 * combat tracker clicks the activation button of a unit that still has
 * activations left. The hook passes the combat, the combatant id, and the user
 * id of the user that clicked the button.
 */
Hooks.on("LancerCombatRequestActivate", (combat: LancerCombat, combatantId: string) => {
  if (!game || !ui.notifications) return;
  // Only request for owned combatants that have activations available
  const combatant = combat.getCombatant(combatantId);
  if (combatant.permission < 3 || combatant.flags.activations.value < 1 || !combat.started) {
    return;
  }

  // send a request to activate to the GM(s)
  console.log("Sending activation request for " + combatantId);
  ui.notifications.info("Sending request to go next.");
  game.socket.emit("module.li-player-request", {
    scene: combat.scene._id,
    combat: combat.id,
    combatant: combatantId,
    user: game.userId,
  });
});
