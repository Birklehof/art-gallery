<script>
    import { Link } from "svelte-navigator";
    import Lazy from 'svelte-lazy';
    export var max_image_id = 3;
</script>

<div>
  <div class="landing">
    <img src={"assets/landing/landing.jpg"} alt="Landing">
    <h1 class="big-title">Willkommen zur Kunst Gallerie</h1>
    <h1 class="big-title">des Birklehof!</h1>
    <h1 class="small-title">Willkommen zur Kunst Gallerie des Birklehof!</h1>
  </div>
  <div class="masonry">
    {#each Array(max_image_id) as _, i}
      <div class="item">
        <Lazy height={300}>
          <img src={"assets/pictures/picture_" + (i+1).toString() + ".jpg"} alt="Please wait ... "/>
        </Lazy>
        <Link to="/subject"><h2>Thema 1</h2></Link>
        <p>Eine kurze Beschreibung des Themas und der Klassen, die daran gearbeitet haben.</p>
      </div>
    {/each}
  </div>
</div>