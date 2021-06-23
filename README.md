# Player Activation Request Extension for Lancer Initiative

Extends [Lancer Initiative](https://github.com/BoltsJ/lancer-initiative) allowing players to request the GM to switch to their turn. This requires version 0.6.0 or later in order to function.

## Install

Use this manifest url in the foundry module browser: https://github.com/BoltsJ/li-player-request/releases/latest/download/module.json

## Development

This serves primarily as documentation to the Hook in Lancer Initiative so that others can customize what happens when players click the tracker.

Lancer Initiative now provides a Hook when a player clicks on the tracker. The hook receives the following parameters:

* combat: LancerCombat — The combat instance that the hook was triggered from.
* combatantId: string — The id of the Combatant that was clicked

In this reference implementation, when a player clicks the tracker, a hooked function checks that the player clicked an owned combatant and if that combatant has remaining activations. If so, then  the sceneId, combatId, combatantId and userId are passed into a socket that is received by the GM(s). The receiving callback displays a dialog to the GM allowing them to approve or deny the activation.
