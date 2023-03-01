const { macroPass, targets, spellLevel, damageTotal, damageRoll, damageList, itemCardId, itemData, failedSaves } = args[ 0 ]; // destructuring the args[0] object to get relevant values

const effectLabel = "Blight-Disadvantage"; // a label can be what you want
const [ target ] = targets;
const isUndeadConstruct = target.actor.system?.details?.type?.value === "undead" || target.actor.system?.details?.type?.value === "construct";
const isPlant = target.actor.system?.details?.type?.value === "plant"
const diceAmount = spellLevel + 4;
	const data = {
	changes: [ {
		key: "flags.midi-qol.disadvantage.ability.save.all",
		mode: 0,
		priority: 20,
		value: "1"
	} ],
	flags: {
		dae: {
			specialDuration: [ "isDamaged" ]
		}
	},
	icon: "icons/magic/unholy/strike-beam-blood-large-red-green.webp",
	label: effectLabel
};

if ( macroPass === "preSave" ) { // this macro is fired every pass of the midiqol workflow, this only runs in the presave part
	if ( !isPlant ) return; // not a plant return and continue the workflow
	await MidiQOL.socket().executeAsGM("createEffects", {actorUuid:target.actor.uuid, effects:[data]});

}
if ( macroPass === "postDamageRoll" ) {

	if ( isPlant ) {
		this.setDamageRoll( await new Roll( `${diceAmount}d8` ).evaluate( { maximize: isPlant } ) )
	}
	if ( isUndeadConstruct ) {
		this.setDamageRoll( await new Roll( "0" ).evaluate( ) )

	}
}