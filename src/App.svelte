<script>
	import Router from './routes/index.svelte';

	function openInNewTab(url) {
		window.open(url, '_blank').focus();
	}
</script>

<main>
	<div class="toolbar">
		<img style="cursor: pointer" on:click={() => openInNewTab("https://www.birklehof.de/")} id="logo" src="https://www.birklehof.de/wp-content/themes/birklehof-v2/img/birklehof-logo.png">
	</div>
	<Router />
</main>