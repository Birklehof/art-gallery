<script>
	import Home from "./pages/Home.svelte";
	import Subject from "./pages/Subject.svelte";
	import Subject_Subcategories from "./pages/Subject_Subcategories.svelte";

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
			title: 'Schwarzwald',
			dir: 'Schwarzwald',
			max_image_id: 10,
			class: 'Q2 Feb 2022',
			materials: 'Aquarell auf Papier, ca. 20 x 30 cm',
			description: 'Raumtiefe entsteht durch Landschaftsebenen, Proportionen und die Luftperspektive (Verblassen und Verblauen von in der Ferne liegenden Bildelementen). In dieser praktischen Arbeit wurden typische Schwarzwald Schwarzwald umgesetzt. '
		},
		{
			title: 'Stillleben',
			dir: 'Stillleben',
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
			categories: [
				{
					title: 'Bett',
					image_range: [1, 3]
				},
				{
					title: 'Hochbett',
					image_range: [4, 8]
				},
				{
					title: 'Regaltisch',
					image_range: [9, 14]
				},
				{
					title: 'Sofa',
					image_range: [15, 19]
				},
				{
					title: 'Sofatisch',
					image_range: [20, 22]
				},
				{
					title: 'Tischbett',
					image_range: [23, 26]
				},
				{
					title: 'Tischregal',
					image_range: [27, 30]
				}
			],
			class: 'Klasse 6, Feb 2022',
			materials: 'Modelle aus Holzpappe, Strohhalmen ect, ca. 10 x 15 cm',
			description: 'Auf spielerische Art und Weise hat sich die Klasse dem Thema Möbeldesign genähert und ein Modell entworfen, welches zwei unterschiedliche Funktionen hat.'
		},
		{
			title: 'Fragmente',
			dir: 'Fragmente',
			max_image_id: 6,
			class: 'Klasse 8 und 9 MuK April 2021',
			materials: 'Bleistift, Fineliner, Filzstifte, vers. Formate',
			description: 'Während dem Fernunterricht setzten sich die SchülerInnen mit Bildfragmenten und linearen Zeichnungsformen auseinander. Nach verschiedenen Übungen sollte in Kleingruppen Bilder fragmentiert werden und die jeweiligen Fragmente mit unterschiedlichen linearen Gestaltungsmethoden umgesetzt werden.',
			style: 'column-count: 2 !important;'
		},
		{
			title: 'Schuhstudie',
			dir: 'Schuhstudie',
			max_image_id: 11,
			class: 'Klassen 10A & 10B, Nov 2021',
			materials: 'Bleistift, Fineliner, Kohle, Kreide, Buntstifte, Acryl, Aquarell, Zeichenpapier ca. 35 x 50 cm',
			description: 'Lernen zu Zeichnen bedeutet vor allem genau hinzusehen, das Auge zu schärfen und zu üben, das Gesehene wiederzugeben. In dieser Studie sollte ein Schuh jeweils linear, mit Fokus auf hell/dunkel, mit naturalistischer Farbgebung und am Ende in einer freien Mischform umgesetzt werden.'
		}
	]
</script>
<main>
	<div class="toolbar">
		<img alt="Birklehof | Privates Internat & Gymnasium" style="cursor: pointer" on:click={() => openInNewTab("https://www.birklehof.de/")} id="logo" src="./assets/others/logo.png">
	</div>
	{#if page==="#Home" || page===""}
		<Home subjects={subjects}/>
	{/if}

	{#each subjects as subject}
		{#if page === '#' + subject.dir}
			{#if subject.categories !== []}
				<Subject_Subcategories subject={subject} />
			{:else}
				<Subject subject={subject}/>
			{/if}
		{/if}
	{/each}
</main>