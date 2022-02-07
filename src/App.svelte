<script>
	import { Router, Route, Link } from "svelte-navigator";
	import Home from "./Home.svelte";
	import Subject from "./Subject.svelte"
</script>

<Router>
	<div class="toolbar">
		<Link to="/">
			<img id="logo" src="https://www.birklehof.de/wp-content/themes/birklehof-v2/img/birklehof-logo.png">
		</Link>
	</div>
	<main>
		<Route path="/">
			<Home />
		</Route>

		<Route path="home">
			<Home />
		</Route>

		<Route path="subject">
			<Subject />
		</Route>
	</main>
</Router>