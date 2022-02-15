<script>
    import Lazy from 'svelte-lazy';

    export let subjects = [];
</script>

<div>
  <div class="landing">
    <img src={"assets/landing/landing.jpg"} alt="Landing">
    <div class="overlay"></div>
    <h1 class="main-title big-title">Willkommen zur Kunstgalerie</h1>
    <h1 class="main-title big-title">des Birklehof!</h1>
    <h1 class="small-title">Willkommen zur Kunstgalerie des Birklehof!</h1>
  </div>
  <div class="masonry">
    {#each subjects as subject}
      <div class="brick hover-effect clickable">
        <a href={'#' + subject.dir}>
          <Lazy height={300}>
            <img src={"assets/pictures/" + subject.dir + "/IMG_1.jpg"} alt="Please wait ...">
          </Lazy>
        </a>
      </div>
    {/each}
  </div>
</div>