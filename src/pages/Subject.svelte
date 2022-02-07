<script>
    import { Link } from "svelte-navigator";
    import IoIosArrowBack from 'svelte-icons/io/IoIosArrowBack.svelte';
    import IoIosArrowForward from 'svelte-icons/io/IoIosArrowForward.svelte';
    import IoIosClose from 'svelte-icons/io/IoIosClose.svelte';
    import Lazy from 'svelte-lazy';

    let curr_image_id = 0
    export var max_image_id = 11
    function show_image(image_id) {
        curr_image_id = image_id+1;
        document.getElementById("focus_image").src = "assets/pictures/picture_" + (curr_image_id).toString() + ".jpg"
        document.getElementById("overlay").style.display = "block";
    }
    function hide_image() {
        document.getElementById("overlay").style.display = "none";
    }
    function next_left() {
        curr_image_id -= 1;
        if (curr_image_id < 1) {
            curr_image_id = max_image_id
        }
        document.getElementById("focus_image").src = "assets/pictures/picture_" + (curr_image_id).toString() + ".jpg"
    }
    function next_right() {
        curr_image_id += 1;
        if (curr_image_id > max_image_id) {
            curr_image_id = 1
        }
        document.getElementById("focus_image").src = "assets/pictures/picture_" + (curr_image_id).toString() + ".jpg"
    }
</script>

<div>
  <div class="landing">
    <img src={"assets/landing/landing.jpg"} alt="Landing">
    <h1>Thema 1</h1>
    <div>
      <Link to="/" class="back-link">
        <p>Zurück zur Übersicht</p>
      </Link>
    </div>
  </div>
  <div id="overlay">
    <div id="next_left" on:click={next_left}>
      <div class="icon">
        <IoIosArrowBack />
      </div>
    </div>
    <img id="focus_image" src={"assets/pictures/picture_1.jpg"} alt="Please wait ... ">
    <div id="next_right" on:click={next_right}>
      <div class="icon">
        <IoIosArrowForward />
      </div>
    </div>
    <div id="close" on:click={hide_image}>
      <div class="icon">
        <IoIosClose />
      </div>
    </div>
  </div>
  <div class="masonry">
    {#each Array(max_image_id) as _, i}
      <div class="item clickable" on:click={() => {show_image(i)}}>
        <Lazy height={300}>
          <img src={"assets/pictures/picture_" + (i+1).toString() + ".jpg"} alt="Please wait ... "/>
        </Lazy>
      </div>
    {/each}
  </div>
</div>