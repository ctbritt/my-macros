let corpses = canvas.tokens.placeables.filter(function (target) {
  return (
	target?.actor?.data?.data?.attributes?.hp?.value <= 0 &&
	target?.actor?.data?.type == "npc" // adjust paths for your particular system
  );
});

ItemPiles.API.turnTokensIntoItemPiles(corpses);

for (let i of corpses) {
  new Sequence()
	.effect()
	.file("jb2a.token_border.circle.spinning.orange.001")
	.attachTo(i)
	.scale(0.5)
	.persist()
	.fadeIn(300)
	.fadeOut(300)
	.name(`Treasure Glow-${i.data.name}`)
	.play()
}
