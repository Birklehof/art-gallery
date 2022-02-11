<script>
    import IoIosArrowBack from 'svelte-icons/io/IoIosArrowBack.svelte';
    import IoIosArrowForward from 'svelte-icons/io/IoIosArrowForward.svelte';
    import IoIosClose from 'svelte-icons/io/IoIosClose.svelte';
    import Lazy from 'svelte-lazy';
    import { onMount } from "svelte";

    onMount(() => window.scrollTo(0,0));

    const image_path = "assets/pictures/Waldboden/IMG_"
    let curr_image_id = 0
    const max_image_id = 9
    function show_image(image_id) {
        curr_image_id = image_id+1;
        document.getElementById("focus_image").src = image_path + (curr_image_id).toString() + ".jpg"
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
        document.getElementById("focus_image").src = image_path + (curr_image_id).toString() + ".jpg"
    }
    function next_right() {
        curr_image_id += 1;
        if (curr_image_id > max_image_id) {
            curr_image_id = 1
        }
        document.getElementById("focus_image").src = image_path + (curr_image_id).toString() + ".jpg"
    }
</script>

<div>
  <div class="landing">
    <img src={image_path + (Math.floor(Math.random() * max_image_id)).toString() + ".jpg"} alt="Landing">
    <div class="overlay"></div>
    <h1>Waldboden</h1>
    <p class="description">Wir gingen gemeinsam in den Wald um Skizzen von den Dingen, die auf dem Waldboden zu sehen sind, zu erfassen. Ausgehend von diesen Zeichnungen haben die SchülerInnen begonnen Schicht für Schicht die Waldböden zu malen.</p>
    <div>
      <a href="#Home" class="back-link">
        <p>Zurück zur Übersicht</p>
      </a>
    </div>
  </div>
  <div id="overlay">
    <div id="next_left" class="clickable" on:click={next_left}>
      <div class="icon">
        <IoIosArrowBack />
      </div>
    </div>
    <img id="focus_image" src="" alt="Please wait ... ">
    <div id="next_right" class="clickable" on:click={next_right}>
      <div class="icon">
        <IoIosArrowForward />
      </div>
    </div>
    <div id="close" class="clickable" on:click={hide_image}>
      <div class="icon">
        <IoIosClose />
      </div>
    </div>
  </div>
  <div class="masonry">
    {#each Array(max_image_id) as _, i}
      <div class="item clickable" on:click={() => {show_image(i)}}>
        <Lazy height={300}>
          <img src={image_path + (i+1).toString() + ".jpg"} alt="Please wait ... "/>
        </Lazy>
      </div>
    {/each}
  </div>
</div>