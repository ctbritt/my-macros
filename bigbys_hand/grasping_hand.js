console.log(args);
async function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function filter(array, value, key) {
  return array.filter(
    key
      ? (a) => a[key] === value
      : (a) => Object.keys(a).some((k) => a[k] === value)
  );
}
const lastArg = args[args.length - 1];
const actorD = game.actors.get(args[0].actor._id);
const tokenD = canvas.tokens.get(args[0].tokenId);
let target = lastArg.targets;
const ttarget = canvas.tokens.get(lastArg.targets[0].id);
let uuid = target[0].uuid;
let targetSize = target[0]._actor.data.data.traits.size;
let targetCondition = target[0].data.actorData.effects;
let grappled = filter(targetCondition, "Grappled");
let actionName = "Grapple";
let itemDescription =
  "<p>When you want to grab a creature or wrestle with it, you can use the Attack action to make a Special melee Attack, a grapple. If you’re able to make multiple attacks with the Attack action, this Attack replaces one of them.</p><p>The target of your grapple must be no more than one size larger than you and must be within your reach. Using at least one free hand, you try to seize the target by making a grapple check instead of an Attack roll: a Strength (Athletics) check contested by the target’s Strength (Athletics) or Dexterity (Acrobatics) check (the target chooses the ability to use). If you succeed, you subject the target to the Grappled condition (see Conditions ). The condition specifies the things that end it, and you can release the target whenever you like (no action required).</p>";
if (targetSize === "grg") {
  ui.notifications.warn("Target too big to grapple!");
  return;
}
if (grappled[0]?.label === "Grappled") {
  ui.notifications.info(`${target[0].data.name} already grappled!`);
  return;
} else {
  let bigbySkill = "ath";
  let targetSkill =
    target[0].data.document._actor.data.data.skills.ath.total >
    target[0].data.document._actor.data.data.skills.acr.total
      ? "ath"
      : "acr";
  let bigbyCheck =
    actorD.data.type === "npc"
      ? { fastForward: false, chatMessage: false }
      : { fastForward: true, chatMessage: false };
  let targetCheck =
    target[0].data.type === "character"
      ? { fastForward: false, chatMessage: false }
      : { fastForward: true, chatMessage: false };
  let bigbyRoll = await MidiQOL.socket().executeAsGM("rollAbility", {
    request: "skill",
    targetUuid: target[0].actor.uuid,
    ability: bigbySkill,
    options: bigbyCheck,
  });
  let targetRoll = await MidiQOL.socket().executeAsGM("rollAbility", {
    request: "skill",
    targetUuid: target[0].actor.uuid,
    ability: targetSkill,
    options: targetCheck,
  });
  midiExec(actionName, itemDescription, bigbyRoll, targetRoll);
}

async function midiExec(actionName, itemDescription, bigbyRoll, targetRoll) {
  let bigbyRollType = bigbyRoll.terms[0].options.advantage
    ? " (Advantage)"
    : bigbyRoll.terms[0].options.disadvantage
    ? " (Disadvantage)"
    : "";
  let targetRollType = targetRoll.terms[0].options.advantage
    ? " (Advantage)"
    : targetRoll.terms[0].options.disadvantage
    ? " (Disadvantage)"
    : "";
  game.dice3d?.showForRoll(bigbyRoll);
  game.dice3d?.showForRoll(targetRoll);
  let bigbyWin = "";
  let targetWin = "";
  bigbyRoll.total >= targetRoll.total
    ? (bigbyWin = `success`)
    : (targetWin = `success`);
  if (bigbyWin === "success") {
    game.dfreds.effectInterface.addEffect({ effectName: "Grappled", uuid });
  }
  let damage_results = `
      <div><h2>${actionName}</h2>${itemDescription}</div>
    <div class="flexrow 2">
    <div><div style="text-align:center">${actorD.name}</div></div><div><div style="text-align:center">${target[0].name}</div></div>
    </div>
    <div class="flexrow 2">
      <div>
        <div style="text-align:center">Acrobatics${bigbyRollType}</div>
        <div class="dice-roll">
          <div class="dice-result">
            <div class="dice-formula">${bigbyRoll.formula}</div>
            <div class="dice-tooltip">
              <div class="dice">
                <header class="part-header flexrow">
                  <span class="part-formula">${bigbyRoll.formula}</span>
                  <span class="part-total">${bigbyRoll.total}</span>
                </header>
              </div>
            </div>
            <h4 class="dice-total ${bigbyWin}">${bigbyRoll.total}</h4>
          </div>
        </div>
      </div>
      <div>
        <div style="text-align:center">Acrobatics${targetRollType}</div>
        <div class="dice-roll">
          <div class="dice-result">
            <div class="dice-formula">${targetRoll.formula}</div>
            <div class="dice-tooltip">
              <div class="dice">
                <header class="part-header flexrow">
                  <span class="part-formula">${targetRoll.formula}</span>
                  <span class="part-total">${targetRoll.total}</span>
                </header>
              </div>
            </div>
            <h4 class="dice-total ${targetWin}">${targetRoll.total}</h4>
          </div>
        </div>
      </div>
    </div>`;
  const chatMessage = game.messages.get(lastArg.itemCardId);
  let content = duplicate(chatMessage.data.content);
  const searchString =
    /<div class="midi-qol-saves-display">[\s\S]*<div class="end-midi-qol-saves-display">/g;
  const replaceString = `<div class="midi-qol-saves-display"><div class="end-midi-qol-saves-display">${damage_results}`;
  content = content.replace(searchString, replaceString);
  chatMessage.update({ content: content });
  await wait(500);
  await ui.chat.scrollBottom();
}
