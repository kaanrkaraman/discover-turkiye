<script lang="ts">
import { onMount, untrack } from "svelte";
import Layers from "./components/Layers.svelte";
import MapView from "./components/MapView.svelte";
import PlaceDetail from "./components/PlaceDetail.svelte";
import PlaceList from "./components/PlaceList.svelte";
import { app, provinces } from "./lib/store.svelte";

let search: HTMLInputElement | undefined;

const onkeydown = (event: KeyboardEvent) => {
	if (event.key === "/" && document.activeElement !== search) {
		event.preventDefault();
		search?.focus();
	} else if (event.key === "Escape") {
		if (app.selected) app.selectedId = null;
		else search?.blur();
	}
};

// Changing any filter closes the open place so the list always reflects the filter.
$effect(() => {
	void [app.query, app.only, app.province];
	untrack(() => {
		app.selectedId = null;
	});
});

onMount(() => {
	addEventListener("keydown", onkeydown);
	return () => removeEventListener("keydown", onkeydown);
});
</script>

<MapView
	places={app.visible}
	selected={app.selected}
	visited={app.visited}
	onselect={(id) => (app.selectedId = id)}
/>

<aside
	class="fixed inset-x-2 bottom-[max(0.5rem,env(safe-area-inset-bottom))] z-10 flex h-[52dvh] flex-col overflow-hidden rounded-[20px] bg-paper/85 shadow-panel backdrop-blur-2xl backdrop-saturate-150 md:inset-x-auto md:inset-y-4 md:left-4 md:h-auto md:w-95 md:rounded-[22px]"
>
	<header class="px-4.5 pt-4 pb-2.5 md:px-5.5 md:pt-5.5 md:pb-4">
		<h1
			class="font-display text-2xl leading-none font-semibold tracking-tight md:text-[26px]"
		>
			Discover Türkiye
		</h1>
	</header>
	<div class="relative px-4">
		<input
			bind:this={search}
			bind:value={app.query}
			type="search"
			placeholder="Yer veya il ara"
			autocomplete="off"
			aria-label="Ara"
			class="h-10.5 w-full rounded-xl border border-ink/10 bg-white/70 pr-10 pl-3.5 transition-[border-color,box-shadow] duration-160 outline-none focus:border-accent focus:ring-3 focus:ring-accent/15 md:h-10.5"
		>
		<kbd
			class="pointer-events-none absolute top-2.5 right-7 min-w-5 rounded-[5px] border border-ink/10 text-center font-mono text-xs/5 text-muted max-md:hidden"
		>
			/
		</kbd>
		<select
			bind:value={app.province}
			aria-label="İl"
			class="mt-2 h-9.5 w-full rounded-xl border border-ink/10 bg-white/70 px-3 transition-[border-color,box-shadow] duration-160 outline-none focus:border-accent focus:ring-3 focus:ring-accent/15 {app.province
				? ""
				: "text-muted"}"
		>
			<option value="">Tüm iller</option>
			{#each provinces as { name, count } (name)}
				<option value={name}>{name} ({count})</option>
			{/each}
		</select>
	</div>
	<Layers />
	<div class="relative min-h-0 flex-1 border-t border-ink/10">
		{#if app.selected}
			<PlaceDetail place={app.selected} />
		{:else}
			<PlaceList />
		{/if}
	</div>
</aside>
