<script>
    import Lazy from 'svelte-lazy';
    const subjects = [
        {
            title: 'Waldboden',
            class: '7. Klasse Dez 2021',
            description: 'Wir gingen gemeinsam in den Wald um Skizzen von den Dingen, die auf dem Waldboden zu sehen sind, zu erfassen. \n' +
                '\n' +
                'Ausgehend von diesen Zeichnungen haben die SchülerInnen begonnen Schicht für Schicht die Waldböden zu malen.'

        },
        {
            title: 'Landschaften',
            class: 'Q2 Feb 2022',
            description: 'Raumtiefe entsteht durch Landschaftsebenen, Proportionen und die Luftperspektive (Verblassen und Verblauen von in der Ferne liegenden Bildelementen). In dieser praktischen Arbeit wurden typische Schwarzwald Landschaften umgesetzt. '
        }]
</script>

<div>
  <div class="landing">
    <img src={"assets/landing/landing.jpg"} alt="Landing">
    <div class="overlay"></div>
    <h1 class="big-title">Willkommen zur Kunstgallerie</h1>
    <h1 class="big-title">des Birklehof!</h1>
    <h1 class="small-title">Willkommen zur Kunstgallerie des Birklehof!</h1>
  </div>
  <div class="masonry">
    {#each subjects as subject}
      <div class="item">
        <Lazy height={300}>
          <img src={"assets/pictures/" + subject.title + "/IMG_1.jpg"} alt="Please wait ... "/>
        </Lazy>
        <a href={"#" + subject.title}><h2>{subject.title}</h2></a>
        <p>{subject.class}</p>
        <p>{subject.description}</p>
      </div>
    {/each}
  </div>
</div>