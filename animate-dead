const lastArg = args[args.length - 1];
const { actor, targets } = lastArg;
const ttoken = canvas.tokens.get(lastArg.tokenId);
const undeadThralls = actor.items.find(item => item.name === "Undead Thralls");

const hasThralls = !!undeadThralls;
const prof = actor.system.attributes.prof;
const spellLevel = lastArg.spellLevel;

const thrallHp = hasThralls ? actor.classes.wizard.system.levels : 0;
const thrallDamage = hasThralls ? prof : 0;

if (!game.modules.get("warpgate")?.active) {
  ui.notifications.error("Please enable the Warp Gate module");
}

const number = 1 + (spellLevel - 3) * 2 + (hasThralls ? 1 : 0);

const createButtonData = (label, name) => ({
  label,
  value: {
	token: { name },
	actor: { name },
  },
});

const buttonData = {
  buttons: [
	createButtonData(
	  hasThralls ? "Zombie Thrall" : "Zombie",
	  hasThralls ? "Zombie Thrall" : "Zombie"
	),
	createButtonData(
	  hasThralls ? "Skeleton Thrall" : "Skeleton",
	  hasThralls ? "Skeleton Thrall" : "Skeleton"
	),
  ],
};

for (let i = 0; i < number; i++) {
  buttonData.title = `Animating which type? (${i + 1} of ${number})`;
  const dialog = await warpgate.buttonDialog(buttonData);
  const summonName = dialog.token.name;
  const baseValue = new Roll(summonName.includes("Zombie") ? "3d8+9" : "2d8+4");
  
  await baseValue.evaluate();

  const finalHpValue = baseValue.total + thrallHp;

  const updates = {
	token: { name: summonName },
	actor: {
	  name: summonName,
	  system: {
		attributes: {
		  hp: { value: finalHpValue, max: finalHpValue },
		},
		bonuses: {
		  mwak: {
			damage: thrallDamage.toString(),
		  },
		  rwak: {
			damage: thrallDamage.toString(),
		  },
		},
	  },
	},
  };
  await warpgate.spawn(summonName, updates, {}, { controllingActor: actor });
}
