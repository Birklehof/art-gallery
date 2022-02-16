<script>
    export let subjects = [];
</script>

<div>
  <div class="landing">
    <img src={"assets/others/landing.jpg"} alt="Landing">
    <div class="overlay"></div>
    <h1 class="main-title big-title">Willkommen zur Kunstgalerie</h1>
    <h1 class="main-title big-title">des Birklehof!</h1>
    <h1 class="small-title">Willkommen zur Kunstgalerie des Birklehof!</h1>
  </div>
  <div class="masonry">
    {#each subjects as subject}
      <div class="brick hover-effect" style="background-color: black">
        <img src={"assets/pictures/" + subject.dir + "/IMG_1.jpg"} alt="">
        <h1><a href={'#' + subject.dir}>
          {subject.title}</a></h1>
        <p>{subject.description}</p>
      </div>
    {/each}
  </div>
</div>