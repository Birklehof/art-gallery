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

	// TODO Schuhe von links nach rechts

	const subjects = [
		{
			id: 1,
			title: 'Waldboden',
			dir: 'Waldboden',
			max_image_id: 9,
			class: 'Klasse 7, Dezember 2021',
			materials: 'Acryl auf Papier, ca. 40 x 40 cm',
			description: 'Wir gingen gemeinsam in den Wald um Skizzen von den organischen Gegenständen, die auf dem Waldboden zu sehen sind, zu erfassen. Ausgehend von diesen Zeichnungen haben die SchülerInnen begonnen Schicht für Schicht die Waldböden zu malen.'
		},
		{
			id: 2,
			title: 'Schwarzwald',
			dir: 'Schwarzwald',
			max_image_id: 10,
			class: 'Q2, Feb 2022',
			materials: 'Aquarell auf Papier, ca. 20 x 30 cm',
			description: 'Raumtiefe entsteht durch Landschaftsebenen, Proportionen und die Luftperspektive (Verblassen und Verblauen von in der Ferne liegenden Bildelementen). In dieser praktischen Arbeit wurden typische Schwarzwaldlandschaften umgesetzt. '
		},
		{
			id: 3,
			title: 'Stillleben',
			dir: 'Stillleben',
			max_image_id: 5,
			class: 'Q1, Feb 2022',
			materials: 'Acryl auf Leinwand, 40 x 50 cm',
			description: 'Nach der kunstgeschichtlichen Auseinandersetzung mit Stillleben verschiedener Epochen, erprobten und entwickelten die Schülerinnen einen eigenen Stil und setzten diesen in ihrem individuellen Stillleben um.'
		},
		{
			id: 4,
			title: 'Ausstellungsraum',
			dir: 'Ausstellungsraum',
			max_image_id: 19,
			categories: [
				{
					ending: '.jpg',
					image_range: [1, 3]
				},
				{
					ending: '.jpg',
					image_range: [4, 7]
				},
				{
					ending: '.jpg',
					image_range: [8, 8]
				},
				{
					ending: '.jpg',
					image_range: [9, 13]
				},
				{
					ending: '.jpg',
					image_range: [14, 16]
				},
				{
					ending: '.jpg',
					image_range: [17, 19]
				},
			],
			class: 'Q1, Juni 2021',
			materials: 'Modelle aus Holzpappe und PVC-Folien',
			description: 'Es sollte ein minimalistisches Einraum-Gebäude entworfen werden, welches an einem spezifischen Ort auf dem Birklehofgelände gebaut werden könnte, um SchülerInnen-Arbeiten auszustellen. Inspirationsquelle dazu war die Arbeit Peter Zumthors, insbesondere das Kunsthaus Bregenz.'
		},
		{
			id: 5,
			title: 'Konsumwaren',
			dir: 'Konsumwaren',
			max_image_id: 25,
			categories: [
				{
					ending: '.jpg',
					image_range: [2, 4]
				},
				{
					ending: '.jpg',
					image_range: [5, 7]
				},
				{
					ending: '.jpg',
					image_range: [8, 8]
				},
				{
					ending: '.jpg',
					image_range: [9, 10]
				},
				{
					ending: '.jpg',
					image_range: [11, 13]
				},
				{
					ending: '.jpg',
					image_range: [14, 16]
				},
				{
					ending: '.jpg',
					image_range: [17, 19]
				},
				{
					ending: '.jpg',
					image_range: [20, 22]
				},
				{
					ending: '.jpg',
					image_range: [23, 25]
				}
			],
			class: 'Klassen 10B & 10C, Juli 2021',
			materials: 'Hartschaumskulpturen, Permanentmarker und Acrylfarben, ca. 10 x 15 cm',
			description: 'Das Material eignet sich gut, um täuschend echte Reproduktionen zu gestalten. Die Aufgabenstellung war, einen Artikel nachzuahmen und in der Bemalung eine kritische Botschaft zu verstecken, die wie das Künstliche des Produkt selbst, erst bei näherer Betrachtung offenbart wird.'
		},
		{
			id: 6,
			title: 'Fotoworkshop mit Jan von Holleben',
			dir: 'Workshop',
			max_image_id: 17,
			max_title_id: 9,
			categories: [
				{
					ending: '.jpg',
					image_range: [1, 9]
				},
				{
					ending: '.GIF',
					image_range: [10, 17]
				}
			],
			class: '14 SchülerInnen der Orientierungsstufe, Jan 2022',
			materials: 'Fotografien und Stop Motion Animationen',
			description: 'Die BirklehoferInnen hatte während einem Wochenende die Möglichkeit mit dem Fotokünstler Jan von Holleben ihre fantastischen Ideen in Bildern umzusetzen. Dieser Workshop wurde durch die Elisabeth-Schneider-Stiftung möglich gemacht. Die GIFs am Ende der Seite, brauchen etwas Zeit zum laden, wir bitten deshalb um Geduld. ©Jan von Holleben 2022'
		},
		{
			id: 7,
			title: 'Schmuckstücke',
			dir: 'Schmuckstuecke',
			max_image_id: 6,
			class: 'Q1, Dez 2021',
			materials: 'Bleistift und Buntstifte, 30 x 50 cm',
			description: 'Hier war es die Aufgabe, verschiedene künstliche und natürliche Objekte zu arrangieren und die verschiedenen Oberflächenstrukturen möglichst naturalistisch umzusetzen'
		},
		{
			id: 8,
			title: 'Möbeldesign',
			dir: 'Moebeldesign',
			max_image_id: 30,
			categories: [
				{
					ending: '.jpg',
					image_range: [1, 3]
				},
				{
					ending: '.jpg',
					image_range: [4, 8]
				},
				{
					ending: '.jpg',
					image_range: [9, 14]
				},
				{
					ending: '.jpg',
					image_range: [15, 19]
				},
				{
					ending: '.jpg',
					image_range: [20, 22]
				},
				{
					ending: '.jpg',
					image_range: [23, 26]
				},
				{
					ending: '.jpg',
					image_range: [27, 30]
				}
			],
			class: 'Klasse 6, Feb 2022',
			materials: 'Modelle aus Holzpappe, Strohhalmen ect, ca. 10 x 15 cm',
			description: 'Auf spielerische Art und Weise hat sich die Klasse dem Thema Möbeldesign genähert und ein Modell entworfen, welches zwei unterschiedliche Funktionen hat.'
		},
		{
			id: 9,
			title: 'Fragmente',
			dir: 'Fragmente',
			max_image_id: 6,
			class: 'Klasse 8 und 9 MuK, April 2021',
			materials: 'Bleistift, Fineliner, Filzstifte, vers. Formate',
			description: 'Während dem Fernunterricht setzten sich die SchülerInnen mit Bildfragmenten und linearen Zeichnungsformen auseinander. Nach verschiedenen Übungen sollte in Kleingruppen Bilder fragmentiert werden und die jeweiligen Fragmente mit unterschiedlichen linearen Gestaltungsmethoden umgesetzt werden.',
			style: 'column-count: 2 !important;'
		},
		{
			id: 10,
			title: 'Schuhstudie',
			dir: 'Schuhstudie',
			max_image_id: 11,
			class: 'Klassen 10A & 10B, Nov 2021',
			materials: 'Bleistift, Fineliner, Kohle, Kreide, Buntstifte, Acryl, Aquarell, Zeichenpapier ca. 35 x 50 cm',
			description: 'Lernen zu Zeichnen bedeutet vor allem genau hinzusehen, das Auge zu schärfen und zu üben, das Gesehene wiederzugeben. In dieser Studie sollte ein Schuh jeweils linear, mit Fokus auf hell/dunkel, mit naturalistischer Farbgebung und am Ende in einer freien Mischform umgesetzt werden.'
		},
		{
			id: 11,
			title: 'Körpergefühl',
			dir: 'Koerpergefuehl',
			max_image_id: 22,
			categories: [
				{
					ending: '.jpg',
					image_range: [1, 4]
				},
				{
					ending: '.jpg',
					image_range: [5, 8]
				},
				{
					ending: '.jpg',
					image_range: [9, 12]
				},
				{
					ending: '.jpg',
					image_range: [13, 15]
				},
				{
					ending: '.jpg',
					image_range: [16, 17]
				},
				{
					ending: '.jpg',
					image_range: [18, 22]
				}
			],
			class: 'Klassen 8, Feb 2022',
			materials: 'Ton',
			description: 'Ein bestimmtes Gefühl sollte bei diesen Arbeiten über die Körperhaltung der Figuren zum Ausdruck gebracht werden.'
		},
		{
			id: 12,
			title: 'Kunstdiktat',
			dir: 'Kunstdiktat',
			max_image_id: 9,
			class: 'Klasse 6 & 9B',
			materials: 'Bleistifte / Filzstifte, ca. 20 x 30 cm',
			description: 'Das Kunstdiktat ist eine spielerische Übung zur Bildbetrachtung. Berühmte Werke werden der gegenüber sitzenden Person beschrieben, diese wiederum versucht das Beschriebene zu zeichnen. Beide können die Werke nicht sehen.'
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
			{#if subject.categories && subject.categories !== []}
				<Subject_Subcategories subject={subject} max_title_id={subject.max_title_id}/>
			{:else}
				<Subject subject={subject}/>
			{/if}
		{/if}
	{/each}
</main>