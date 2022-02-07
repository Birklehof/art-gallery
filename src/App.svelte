<script>
	import Home from "./pages/Home.svelte";
	import Subject from "./pages/Subject.svelte";
	import NotFound from "./pages/NotFound.svelte";

	let page = document.location.hash;

	window.onpopstate = function(event) {
		page = document.location.hash;
	};

	function openInNewTab(url) {
		window.open(url, '_blank').focus();
	}
</script>
<main>
	<div class="toolbar">
		<img alt="Birklehof | Privates Internat & Gymnasium" style="cursor: pointer" on:click={() => openInNewTab("https://www.birklehof.de/")} id="logo" src="https://www.birklehof.de/wp-content/themes/birklehof-v2/img/birklehof-logo.png">
	</div>
	{#if page==="#home" || page===""}
		<Home />
	{:else if page === "#subject"}
		<Subject />
	{:else}
		<NotFound />
	{/if}
</main>