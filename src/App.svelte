<script>
	import Home from "./pages/Home.svelte";
	import NotFound from "./pages/NotFound.svelte";
	import Waldboden from "./pages/Waldboden.svelte";
	import Landschaften from "./pages/Schwarzwaldlandschaften.svelte";
	import Individuelle_Stillleben from "./pages/Individuelle_Stillleben.svelte";
	import Konsumwaren from "./pages/Konsumwaren.svelte";

	let page = document.location.hash;

	window.onpopstate = function(_event) {
		page = document.location.hash;
	};

	function openInNewTab(url) {
		window.open(url, '_blank').focus();
	}
</script>
<main>
	<div class="toolbar">
		<img alt="Birklehof | Privates Internat & Gymnasium" style="cursor: pointer" on:click={() => openInNewTab("https://www.birklehof.de/")} id="logo" src="./assets/logo.png">
	</div>
	{#if page==="#Home" || page===""}
		<Home />
	{:else if page === "#Waldboden"}
		<Waldboden />
	{:else if page === "#Schwarzwaldlandschaften"}
		<Landschaften />
	{:else if page === "#Individuelle_Stillleben"}
		<Individuelle_Stillleben />
	{:else if page === "#Konsumwaren"}
		<Konsumwaren />
	{:else}
		<NotFound />
	{/if}
</main>