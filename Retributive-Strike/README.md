# Retributive Strike

An item macro for the retributive strike, based off the [Staff of Power](https://www.dndbeyond.com/magic-items/4764-staff-of-power).

**Requires:**

- MidiQOL
- Item Macro
- Advanced Macros (probably)
- Sequencer
- Magic Items
- JB2A (I use the patreon version. You can alter the file paths if you're running the free version)

## How it Works

This macro gets the actor and token data from the caster, checks how many charges are left on the Staff of Power (via Magic Items, NOT the Foundry core charges), then checks the distance to all creatures within 30 feet of the caster. It computes the damage for each, applies it, and checks if the caster is teleported to a random plane of existence or if they take the force of the staff in their face. (Which, let's be honest, will probably kill them.)

I've includled a .json of the actual retributive strike item, which is set up with the range, saving throw and Item Macro built in. Just import it, drop it on a player or NPC sheet and nuke away.
