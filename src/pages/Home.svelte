<script>
    import Lazy from 'svelte-lazy';
    const subjects = [
        {
            title: 'Waldboden',
            dir: 'Waldboden',
            class: '7. Klasse Dezember 2021',
            description: 'Wir gingen gemeinsam in den Wald um Skizzen von den Dingen, die auf dem Waldboden zu sehen sind, zu erfassen. \n' +
                '\n' +
                'Ausgehend von diesen Zeichnungen haben die SchülerInnen begonnen Schicht für Schicht die Waldböden zu malen.'

        },
        {
            title: 'Schwarzwaldlandschaften',
            dir: 'Schwarzwaldlandschaften',
            class: 'Q2 Feb 2022',
            description: 'Raumtiefe entsteht durch Landschaftsebenen, Proportionen und die Luftperspektive (Verblassen und Verblauen von in der Ferne liegenden Bildelementen). In dieser praktischen Arbeit wurden typische Schwarzwald Schwarzwaldlandschaften umgesetzt. '
        },
        {
            title: 'Individuelle Stillleben',
            dir: 'Individuelle_Stillleben',
            class: 'Q1 Feb 2022',
            description: 'Nach der kunstgeschichtlichen Auseinandersetzung mit Stillleben verschiedender Epochen, erprobten und entwickelten die Schülerinnen einen eigenen Stil und setzten diesen in ihrem individuellen Stillleben um.'
        },
        {
            title: 'Konsumwaren',
            dir: 'Konsumwaren',
            class: '10B & 10C Juli 2021',
            description: 'Das Material eignet sich gut, um täuschend echte Reproduktionen zu gestalten. Die Aufgabenstellung war, einen Artikel nachzuahmen und in der Bemalung eine kritische Botschaft zu verstecken, die wie das Künstliche des Produkt selbst erst bei näherer Betrachtung offenbart wird.'
        }
        ]
</script>

<div>
  <div class="landing">
    <img src={"assets/landing/landing.jpg"} alt="Landing">
    <div class="overlay"></div>
    <h1 class="main-title big-title">Willkommen zur Kunstgallerie</h1>
    <h1 class="main-title big-title">des Birklehof!</h1>
    <h1 class="small-title">Willkommen zur Kunstgallerie des Birklehof!</h1>
  </div>
  <div class="masonry">
    {#each subjects as subject}
      <div class="item">
        <Lazy height={300}>
          <img src={"assets/pictures/" + subject.dir + "/IMG_1.jpg"} alt="Please wait ... "/>
        </Lazy>
        <a href={"#" + subject.dir}><h2>{subject.title}</h2></a>
        <p>{subject.class}</p>
        <p>{subject.description}</p>
      </div>
    {/each}
  </div>
</div>