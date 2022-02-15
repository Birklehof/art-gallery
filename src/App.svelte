<script>
	import Home from "./pages/Home.svelte";
	import Subject from "./pages/Subject.svelte";

	let page = document.location.hash;

	window.onpopstate = function(_event) {
		page = document.location.hash;
	};

	function openInNewTab(url) {
		window.open(url, '_blank').focus();
	}

	const subjects = [
		{
			title: 'Waldboden',
			dir: 'Waldboden',
			max_image_id: 9,
			class: '7. Klasse Dezember 2021',
			materials: 'Acryl auf Papier, ca. 40 x 40 cm',
			description: 'Wir gingen gemeinsam in den Wald um Skizzen von den Dingen, die auf dem Waldboden zu sehen sind, zu erfassen. Ausgehend von diesen Zeichnungen haben die SchülerInnen begonnen Schicht für Schicht die Waldböden zu malen.'
		},
		{
			title: 'Schwarzwaldlandschaften',
			dir: 'Schwarzwaldlandschaften',
			max_image_id: 10,
			class: 'Q2 Feb 2022',
			materials: 'Aquarell auf Papier, ca. 20 x 30 cm',
			description: 'Raumtiefe entsteht durch Landschaftsebenen, Proportionen und die Luftperspektive (Verblassen und Verblauen von in der Ferne liegenden Bildelementen). In dieser praktischen Arbeit wurden typische Schwarzwald Schwarzwaldlandschaften umgesetzt. '
		},
		{
			title: 'Individuelles Stillleben',
			dir: 'Individuelles_Stillleben',
			max_image_id: 5,
			class: 'Q1 Feb 2022',
			materials: 'Acryl auf Leinwand, 40 x 50 cm',
			description: 'Nach der kunstgeschichtlichen Auseinandersetzung mit Stillleben verschiedender Epochen, erprobten und entwickelten die Schülerinnen einen eigenen Stil und setzten diesen in ihrem individuellen Stillleben um.'
		},
		{
			title: 'Ausstellungsraum',
			dir: 'Ausstellungsraum',
			max_image_id: 19,
			class: 'Q1 Juni 2021',
			materials: 'Modelle aus Holzpappe und PVC-Folien',
			description: 'Es sollte ein minimalistisches Einraum-Gebäude entworfen werden, welches an einem spezifischen Ort auf dem Birklehofgelände gebaut werden könnte, um SchülerInnen-Arbeiten auszustellen. Inspirationsquelle dazu war die Arbeit Peter Zumthors, insbesondere das Kunsthaus Bregenz.'
		},
		{
			title: 'Konsumwaren',
			dir: 'Konsumwaren',
			max_image_id: 25,
			class: '10B & 10C Juli 2021',
			materials: 'Hartschaumskulpturen, Permanentmarker und Acrylfarben, ca. 10 x 15 cm',
			description: 'Das Material eignet sich gut, um täuschend echte Reproduktionen zu gestalten. Die Aufgabenstellung war, einen Artikel nachzuahmen und in der Bemalung eine kritische Botschaft zu verstecken, die wie das Künstliche des Produkt selbst erst bei näherer Betrachtung offenbart wird.'
		},
		{
			title: 'Möbeldesign',
			dir: 'Moebeldesign',
			max_image_id: 30,
			class: 'Klasse 6, Feb 2022',
			materials: 'Modelle aus Holzpappe, Strohhalmen ect, ca. 10 x 15 cm',
			description: 'Auf spielerische Art und Weise hat sich die Klasse dem Thema Möbeldesign genähert und ein Modell entworfen, welches zwei unterschiedliche Funktionen hat.'
		}
	]
</script>
<main>
	<div class="toolbar">
		<img alt="Birklehof | Privates Internat & Gymnasium" style="cursor: pointer" on:click={() => openInNewTab("https://www.birklehof.de/")} id="logo" src="./assets/logo.png">
	</div>
	{#if page==="#Home" || page===""}
		<Home subjects={subjects}/>
	{/if}

	{#each subjects as subject}
		{#if page === '#' + subject.dir}
			<Subject subject={subject}/>
		{/if}
	{/each}
</main>