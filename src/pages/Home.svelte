<script>
    import Masonry from 'svelte-bricks';

    export let subjects = [];
    export let minColWidth = 400;
    export let maxColWidth = 800;
    export let gap = 20;
    let width, height;
</script>

<div>
  <div class="landing">
    <img src={"assets/others/landing.jpg"} alt=''>
    <div class="overlay"></div>
    <h1 class="main-title big-title">Willkommen zu</h1>
    <h1 class="main-title big-title">Kunst am Birklehof</h1>
    <h1 class="small-title" style="transform: translate(-50%, -74%) !important;">Willkommen zu</h1>
    <h1 class="small-title">Kunst am Birklehof</h1>
  </div>
  <Masonry
    items={subjects}
    {minColWidth}
    {maxColWidth}
    {gap}
    let:item
    bind:width
    bind:height
  >
    <div class="brick hover-effect clickable" style="background-color: black" on:click={document.location = '#' + item.dir}>
      <img src={"assets/pictures/" + item.dir + "/IMG_1.jpg"} alt=''>
      <h1>{item.title}</h1>
      <p>{item.description}</p>
    </div>
  </Masonry>
</div>