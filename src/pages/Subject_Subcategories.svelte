<script>
    import IoIosArrowBack from 'svelte-icons/io/IoIosArrowBack.svelte';
    import IoIosArrowForward from 'svelte-icons/io/IoIosArrowForward.svelte';
    import IoIosClose from 'svelte-icons/io/IoIosClose.svelte';
    import Lazy from 'svelte-lazy';
    import Masonry from 'svelte-bricks'
    import { onMount } from 'svelte';

    onMount(() => window.scrollTo(0,0));
    
    export let subject = {
        title: '',
        dir: '',
        max_image_id: 0,
        categories: [],
        class: '',
        materials: '',
        description: '',
        style: ''
    }

    const image_path = 'assets/pictures/' + subject.dir + '/IMG_'
    let curr_image_id = 0
    export let max_title_id = subject.max_image_id

    export let minColWidth = 400;
    export let maxColWidth = 2000;
    export let gap = 20;
    let width, height;

    function show_image(image_id, ending='.jpg') {
        document.getElementById('focus_image').src = ''
        curr_image_id = image_id+1;
        document.getElementById('focus_image').src = image_path + (curr_image_id).toString() + ending
        document.getElementById('overlay').style.display = 'block';
    }
    function hide_image() {
        document.getElementById('overlay').style.display = 'none';
    }
    function next_left() {
        curr_image_id -= 1;
        if (curr_image_id < 1) {
            curr_image_id = subject.max_image_id
        }
        let ending = '.jpg'
        subject.categories.forEach(category => {
            if (category.image_range[0] <= curr_image_id && category.image_range[1] >= curr_image_id) {
                ending = category.ending;
            }
        })
        document.getElementById('focus_image').src = image_path + (curr_image_id).toString() + ending
    }
    function next_right() {
        curr_image_id += 1;
        if (curr_image_id > subject.max_image_id) {
            curr_image_id = 1
        }
        let ending = '.jpg'
        subject.categories.forEach(category => {
            if (category.image_range[0] <= curr_image_id && category.image_range[1] >= curr_image_id) {
                ending = category.ending;
            }
        })
        document.getElementById('focus_image').src = image_path + (curr_image_id).toString() + ending
    }
</script>

<div>
  <div class='landing'>
    <img src={image_path + ((Math.floor(Math.random() * (max_title_id-1)))+1).toString() + '.jpg'} alt='Landing'>
    <div class='overlay'></div>
    <h1 class='big-title'>{subject.title}</h1>
    <h1 class='small-title'>{subject.title}</h1>
    <div class="info">
      <p class='class'>
        {subject.class}
      </p>
      <p class='materials'>
        {subject.materials}
      </p>
      <p class='description'>
        {subject.description}
      </p>
    </div>
    <div>
      <a href='#Home' class='back-link'>
        <p>Zurück zur Übersicht</p>
      </a>
    </div>
  </div>
  <div id='overlay'>
    <div id='next_left' class='clickable' on:click={next_left}>
      <div class='icon'>
        <IoIosArrowBack />
      </div>
    </div>
    <img id='focus_image' src='' alt=''>
    <div id='next_right' class='clickable' on:click={next_right}>
      <div class='icon'>
        <IoIosArrowForward />
      </div>
    </div>
    <div id='close' class='clickable' on:click={hide_image}>
      <div class='icon'>
        <IoIosClose />
      </div>
    </div>
  </div>

    {#each subject.categories as category}
      <Masonry
        items={[...Array(category.image_range[1]-category.image_range[0]+1).keys()]}
        {minColWidth}
        {maxColWidth}
        {gap}
        let:item
        bind:width
        bind:height
      >
        <div class='brick clickable' on:click={() => {show_image(item+category.image_range[0]-1, category.ending)}}>
          <Lazy height={300}>
            <img src={image_path + (item+category.image_range[0]).toString() + category.ending} alt='Please wait ... '/>
          </Lazy>
        </div>
      </Masonry>
    {/each}
</div>