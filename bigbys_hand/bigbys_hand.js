const actorD = game.actors.get(args[0].actor._id);
const tokenD = canvas.tokens.get(args[0].tokenId);
const level = args[0].spellLevel;
const summonType = "Bigby's Hand";
const summonerDc = actorD.data.data.attributes.spelldc;
const summonerAttack = summonerDc - 8;
const summonerMod = getProperty(
  tokenD.actor,
  `data.data.abilities.${getProperty(
    tokenD.actor,
    "data.data.attributes.spellcasting"
  )}.mod`
);

let fistScale = "";
let graspScale = "";

if (level - 5 > 0) {
  fistScale = ` + ${(level - 5) * 2}d8[force]`;
}
if (level - 5 > 0) {
  graspScale = ` + ${(level - 5) * 2}d6[bludgeoning]`;
}

let choice = await new Promise((resolve) => {
  new Dialog({
    title: "Choose your color:",
    buttons: {
      one: {
        label:
          '<img src="modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Blue_Thumb.webp" width="40" height="40" style="border:0px"><br>Blue',
        callback: () => {
          resolve({
            token: {
              img: "modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Blue_400x400.webm",
            },
          });
        },
      },
      two: {
        label:
          '<img src="modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Green_Thumb.webp" width="40" height="40" style="border:0px"><br>Green',
        callback: () => {
          resolve({
            token: {
              img: "modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Green_400x400.webm",
            },
          });
        },
      },
      three: {
        label:
          '<img src="modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Purple_Thumb.webp" width="40" height="40" style="border:0px"><br>Purple',
        callback: () => {
          resolve({
            token: {
              img: "modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Purple_400x400.webm",
            },
          });
        },
      },
      fourth: {
        label:
          '<img src="modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Red_Thumb.webp" width="40" height="40" style="border:0px"><br>Red',
        callback: () => {
          resolve({
            token: {
              img: "modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Red_400x400.webm",
            },
          });
        },
      },
    },
  }).render(true);
});

let updates = {
  token: {
    alpha: 0,
    name: `${summonType} of ${actorD.name}`,
  },
  actor: {
    name: `${summonType} of ${actorD.name}`,
    "data.attributes.hp": {
      value: actorD.data.data.attributes.hp.max,
      max: actorD.data.data.attributes.hp.max,
    },
  },
  embedded: {
    Item: {
      "Clenched Fist": {
        "data.attackBonus": `- @mod - @prof + ${summonerAttack}`,
        "data.damage.parts": [[`4d8[force] ${fistScale}`, "force"]],
      },
      "Grasping Hand (Crush)": {
        "data.damage.parts": [
          [`2d6[bludgeoning] + ${summonerMod} ${graspScale}`, "bludgeoning"],
        ],
      },
    },
  },
};

function greetings(templateData, summonedToken) {
  ChatMessage.create({ content: `Bigby's hand appears.` });

  let colorChoice = summonedToken.data.img;

  if (colorChoice.includes("Blue")) {
    return ChatMessage.create({
      speaker: { alias: "Bigby's Hand" },
      content: `<img src="modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Blue_Thumb.webp" width="30" height="30" style="border:0px"> <i>Gives ${actorD.name} a thumbs up.</i> 👍`,
    });
  } else if (colorChoice.includes("Green")) {
    return ChatMessage.create({
      speaker: { alias: "Bigby's Hand" },
      content: `<img src="modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Green_Thumb.webp" width="30" height="30" style="border:0px"> <i>Throws a peace sign at ${actorD.name}.</i> ✌️`,
    });
  } else if (colorChoice.includes("Purple")) {
    return ChatMessage.create({
      speaker: { alias: "Bigby's Hand" },
      content: `<img src="modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Purple_Thumb.webp" width="30" height="30" style="border:0px"> <i>Waves at ${actorD.name}.</i> 👋`,
    });
  } else if (colorChoice.includes("Red")) {
    return ChatMessage.create({
      speaker: { alias: "Bigby's Hand" },
      content: `<img src="modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Red_Thumb.webp" width="30" height="30" style="border:0px"> <i>Waits for ${actorD.name} to give a high five.</i> 🖐️️`,
    });
  }
}

async function myEffectFunction(template, update) {
  //prep summoning area
  let effect = "";

  let colorChoice = update.token.img;

  if (colorChoice.includes("Blue")) {
    effect =
      "modules/jb2a_patreon/Library/Generic/Explosion/Explosion_01_Blue_400x400.webm";
  } else if (colorChoice.includes("Green")) {
    effect =
      "modules/jb2a_patreon/Library/Generic/Explosion/Explosion_01_Green_400x400.webm";
  } else if (colorChoice.includes("Purple")) {
    effect =
      "modules/jb2a_patreon/Library/Generic/Explosion/Explosion_01_Purple_400x400.webm";
  } else if (colorChoice.includes("Red")) {
    effect =
      "modules/jb2a_patreon/Library/Generic/Explosion/Explosion_04_Dark_Red_400x400.webm";
  }

  new Sequence()
    .sound()
    .file(
      "s3/audio/soundboard/Fire%20and%20Explosions/large%20blast/Explosion%20Blast%20Large%2001.ogg"
    )
    .effect()
    .file(effect)
    .atLocation(template)
    .center()
    .scale(1.5)
    .belowTokens()
    .play();
}

async function postEffects(template, token) {
  //bring in our minion
  new Sequence().animation().on(token).fadeIn(500).play();
}

const callbacks = {
  pre: async (template, update) => {
    myEffectFunction(template, update);
    await warpgate.wait(500);
  },
  post: async (template, token) => {
    postEffects(template, token);
    await warpgate.wait(500);
    greetings(template, token);
  },
};

const options = { controllingActor: actor };

updates = mergeObject(updates, choice);
console.log("updates: ", updates);
warpgate.spawn(summonType, updates, callbacks, options);
