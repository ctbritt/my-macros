let results;
const attacker = canvas.tokens.get(args[0].tokenId);
const {object: target} = await fromUuid(args[0].hitTargetUuids[0]);

const skilltoberolled = target.actor.data.data.skills.ath.total < target.actor.data.data.skills.acr.total ? "acr" : "ath";

results = await game.MonksTokenBar.requestContestedRoll({
  token:attacker,
  request:'skill:ath'
},{
  token: target,
  request: `skill:${skilltoberolled}`
},{
  silent:true,
  fastForward:false,
  flavor: `${target.name} tries to resist ${attacker.name}'s grapple attempt`,
  callback: async () => {
    const attackerTotal = results.getFlag("monks-tokenbar", `token${attacker.id}`).total;
    const targetTotal = results.getFlag("monks-tokenbar", `token${target.id}`).total;
    if (attackerTotal >= targetTotal) {
      if(!game.dfreds.effectInterface.hasEffectApplied('Grappled', target.actor.uuid)) {
        await game.dfreds.effectInterface.addEffect({ effectName: 'Grappled', uuid: target.actor.uuid});
        ui.notifications.info(`${attacker.name} grapples ${target.name}!`)
      }
    }
    else ui.notifications.info(`${target.name} resists the grapple from ${attacker.name}`)
  }
});