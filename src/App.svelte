<script>
	export var name = "Hi";
</script>

<main>
	<div class="landing">
		<img src={"assets/landing/landing.jpg"}>
		<h1>Willkommen zur Kunst Gallerie des Birklehof!</h1>
	</div>
	<div class="masonry">
		{#each Array(11) as _, i}
			<div class="item">
				<img src={"assets/pictures/picture_" + (i+1).toString() + ".jpg"}>
			</div>
		{/each}
		{#each Array(6) as _, i}
			<div class="item">
				<img src={"assets/pictures/picture_" + (i+1).toString() + ".jpg"}>
			</div>
		{/each}
	</div>
</main>