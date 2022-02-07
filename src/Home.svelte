<script>
    import { Link } from "svelte-navigator";
    import Lazy from 'svelte-lazy';
    export var max_image_id = 2;
</script>

<div>
  <div class="landing">
    <img src={"assets/landing/landing.jpg"} alt="Landing">
    <h1>Willkommen zur Kunst Gallerie des Birklehof!</h1>
  </div>
  <div class="masonry">
    {#each Array(max_image_id) as _, i}
      <Link to="/subject">
        <div class="item">
          <Lazy height={300}>
            <img src={"assets/pictures/picture_" + (i+1).toString() + ".jpg"} alt="Please wait ... "/>
          </Lazy>
        </div>
      </Link>
    {/each}
  </div>
</div>