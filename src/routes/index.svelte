<script>
    import { Router, Route } from 'svelte-navigator';
    import Home from '../pages/Home.svelte';
    import Subject from '../pages/Subject.svelte';
    export let url = '';
</script>

<Router {url}>
  <div>
    <Route path="subject" component={Subject} />
    <Route path="/" component={Home} />
  </div>
</Router>