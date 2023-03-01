function wait(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

// Preload sequencer
await Sequencer.Preloader.preloadForClients(
  [
    "jb2a.misty_step.01.dark_red",
    "jb2a.energy_strands.complete.purple.01",
    "modules/jb2a_patreon/Library/3rd_Level/Fireball/FireballExplosion_01_Dark_Purple_800x800.webm",
    "jb2a.ground_cracks.purple.02",
  ],
  false
);

// get basic data on tokens

console.log("args: ", args);
const lastArg = args[args.length - 1];
const actorD = game.actors.get(lastArg.actor._id);
const me = canvas.tokens.get(token.id);
let targets = lastArg.targets;
const itemD = await fromUuid(lastArg.itemUuid);
let damageMultiplier = 0;
let multiplier = 0;
console.log("actorD:", actorD);
console.log("me:", me);

// Define the staff of power and get its remaining charges
let staffPower = actorD.items.getName("Staff of Power");
let chargesLeft = staffPower.data.flags.magicitems.uses;

// go Boom
new Sequence()
  .effect()
  .file("jb2a.misty_step.01.dark_red")
  .atLocation(token.center)
  .waitUntilFinished(-800)

  .sound()
  .file(
    "moulinette/sounds/tabletop-audio/soundpads/Combat%20Future/plasma_explosion.ogg"
  )

  .effect()
  .atLocation(token.center)
  .file("jb2a.energy_strands.complete.purple.01")
  .fadeIn(500)
  .scale(3)
  .scaleIn(0, 2500)
  .duration(2500)
  .rotateIn(360, 2500, { ease: "easeOutCubic" })
  .waitUntilFinished(-2500)
  .scaleOut(0, 100)

  .effect()
  .atLocation(token.center)
  .file("jb2a.flames.blue.01")
  .fadeIn(500)
  .duration(2500)
  .waitUntilFinished(1000)
  .scale(10)
  .scaleIn(0, 2500)
  .scaleOut(0, 100)

  .sound()
  .file(
    "s3/audio/soundboard/Fire%20and%20Explosions/blast%20debris/Explosion%20Blast%20Debris%20Fire%20Heavy%20Crackle%2001.ogg"
  )
  .duration(10000)
  .fadeOutAudio(1000)

  .effect()
  .atLocation(token.center)
  .file("jb2a.fireball.explosion.dark_purple")
  .scale(3)
  .timeRange(0, 750)
  .waitUntilFinished(-1000)
  .fadeOut(250)

  .effect()
  .atLocation(token.center)
  .file("jb2a.fireball.loop_no_debris.dark_purple")
  .scale(3)
  .fadeIn(500)
  .duration(6000)
  .fadeOut(500)
  .waitUntilFinished(-1000)

  .effect()
  .atLocation(token.center)
  .file("jb2a.fireball.explosion.dark_purple")
  .scale(3)
  .startTime(1000)
  .fadeIn(750)
  .waitUntilFinished(-3000)

  .effect()
  .atLocation(token.center)
  .file("jb2a.ground_cracks.purple.02")
  .fadeIn(250)
  .duration(15000)
  .fadeOut(5000)
  .play();

// deal damage to targets
for (let i = 0; i < targets.length; i++) {
  let distance = MidiQOL.getDistance(me, targets[i], true);
  let multiplier =
    distance <= 10 ? 8 : distance <= 20 ? 6 : distance <= 30 ? 4 : false;
  let damage = multiplier * chargesLeft;
  if (multiplier) {
    MidiQOL.applyTokenDamage(
      [{ type: "force", damage: damage }],
      damage,
      new Set([targets[i]]),
      null,
      new Set(),
      {}
    );
    ui.notifications.warn(
      targets[i].name + " takes " + damage + " points of force damage!"
    );
  }
}
wait(13000);

// set up 50-50 chance of survival
let randomNumber = Math.random();
console.log(randomNumber);
if (randomNumber >= 0.5) {
  multiplier = 16;
  let damage = multiplier * chargesLeft;
  ui.notifications.warn(
    me.data.name + " takes " + damage + " points of force damage!"
  );
  MidiQOL.applyTokenDamage(
    [{ type: "force", damage: damage }],
    damage,
    new Set([me]),
    null,
    new Set(),
    {}
  );
} else {
  ui.notifications.warn(me.data.name + " disappears!");
  me.document.delete();
  new Sequence()
    .effect()
    .atLocation(token.center)
    .file("jb2a.smoke.puff.centered.grey.0")
    .waitUntilFinished()

    .effect()
    .atLocation(token.center)
    .file("jb2a.smoke.puff.centered.grey.1")
    .waitUntilFinished()

    .effect()
    .atLocation(token.center)
    .file("jb2a.smoke.puff.centered.grey.2")
    .waitUntilFinished()
    .play();
  return;
}
