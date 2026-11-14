<script lang="ts">
import { onMount, untrack } from "svelte";
import Layers from "./components/Layers.svelte";
import MapView from "./components/MapView.svelte";
import PlaceDetail from "./components/PlaceDetail.svelte";
import PlaceList from "./components/PlaceList.svelte";
import { app } from "./lib/store.svelte";

let search: HTMLInputElement | undefined;
let logo: HTMLElement | undefined;
// Tap-to-open for touch; mouse hover and keyboard focus are handled in CSS.
let about = $state(false);

// Same geometry as favicon.svg.
const OCTAGON =
	"59.7,43.5 43.5,59.7 20.5,59.7 4.3,43.5 4.3,20.5 20.5,4.3 43.5,4.3 59.7,20.5";
const STAR = "M19 19h26v26H19zM32 13.6l18.4 18.4L32 50.4 13.6 32z";

const onpointerdown = (event: PointerEvent) => {
	if (about && !logo?.contains(event.target as Node)) about = false;
};

const onkeydown = (event: KeyboardEvent) => {
	if (event.key === "/" && document.activeElement !== search) {
		event.preventDefault();
		search?.focus();
	} else if (event.key === "Escape") {
		if (about) about = false;
		else if (app.selected) app.selectedId = null;
		else search?.blur();
	}
};

// Changing any filter closes the open place so the list always reflects the filter.
$effect(() => {
	void [app.query, app.only];
	untrack(() => {
		app.selectedId = null;
	});
});

onMount(() => {
	addEventListener("keydown", onkeydown);
	addEventListener("pointerdown", onpointerdown);
	return () => {
		removeEventListener("keydown", onkeydown);
		removeEventListener("pointerdown", onpointerdown);
	};
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
	<header
		class="flex items-center gap-2.5 px-4.5 pt-4 pb-2.5 md:px-5.5 md:pt-5.5 md:pb-4"
	>
		<!-- Easter egg: the logo explains its own parts. -->
		<div bind:this={logo} class="group relative">
			<button
				type="button"
				aria-label="Logo"
				aria-describedby="logo-about"
				onclick={() => (about = !about)}
				class="block size-7 transition-transform duration-160 ease-out-strong active:scale-[0.94] md:size-7.5"
			>
				<svg viewBox="0 0 64 64" class="size-full" aria-hidden="true">
					<polygon points={OCTAGON} class="fill-accent" />
					<path d={STAR} class="fill-paper" />
				</svg>
			</button>
			<div
				id="logo-about"
				role="tooltip"
				data-open={about}
				class="pointer-events-none invisible absolute top-full left-0 z-20 mt-2.5 w-72 origin-top-left scale-97 rounded-2xl bg-paper p-3.5 opacity-0 shadow-panel transition-[opacity,scale,visibility] duration-150 ease-out-strong group-hover:visible group-hover:scale-100 group-hover:opacity-100 group-hover:delay-300 group-has-[:focus-visible]:visible group-has-[:focus-visible]:scale-100 group-has-[:focus-visible]:opacity-100 data-[open=true]:visible data-[open=true]:scale-100 data-[open=true]:opacity-100 motion-reduce:scale-100"
			>
				<dl
					class="m-0 grid grid-cols-[1.25rem_1fr] items-start gap-3 text-[13px] leading-snug"
				>
					<svg viewBox="0 0 64 64" class="mt-0.5 size-5" aria-hidden="true">
						<polygon
							points={OCTAGON}
							class="fill-none stroke-accent"
							stroke-width="6"
							stroke-linejoin="round"
						/>
					</svg>
					<div>
						<dt class="font-semibold">Sekizgen</dt>
						<dd class="m-0 text-muted">
							Türk-İslam eserlerinde, özellikle Selçuklu kümbetlerinde ve kubbe
							kasnaklarında sıkça rastlanan bir biçimdir. Haritadaki rozetler de
							bu biçimdedir.
						</dd>
					</div>
					<svg viewBox="12 12 40 40" class="mt-0.5 size-5" aria-hidden="true">
						<path d={STAR} class="fill-accent" />
					</svg>
					<div>
						<dt class="font-semibold">Sekiz köşeli yıldız</dt>
						<dd class="m-0 text-muted">
							Selçuklu çini ve taş süslemelerinde sıkça kullanılan bir motiftir.
							Kubadabad Sarayı'nın çinileri de bu biçimdedir.
						</dd>
					</div>
					<span class="mt-0.5 size-5 rounded-full bg-accent"></span>
					<div>
						<dt class="font-semibold">Turkuaz</dt>
						<dd class="m-0 text-muted">
							Adını Fransızcada “Türk taşı” anlamına gelen “turquoise”
							sözcüğünden alır. Taş, Avrupa'ya Anadolu üzerinden ulaştığı için
							bu adla anılmıştır.
						</dd>
					</div>
				</dl>
			</div>
		</div>
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
	</div>
	<Layers />
	<div class="relative min-h-0 flex-1 border-t border-ink/10">
		<!-- List stays mounted so its scroll position survives opening a place. -->
		<PlaceList hidden={app.selected !== null} />
		{#if app.selected}
			<PlaceDetail place={app.selected} />
		{/if}
	</div>
</aside>
