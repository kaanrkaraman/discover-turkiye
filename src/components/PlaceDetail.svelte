<script lang="ts">
import { CATEGORIES } from "../lib/categories";
import { app } from "../lib/store.svelte";
import type { Place } from "../lib/types";

const { place }: { place: Place } = $props();

const style = $derived(CATEGORIES[place.category]);
const done = $derived(app.visited.has(place.id));
</script>

<section
	style:--c={style.color}
	class="absolute inset-0 overflow-y-auto px-5 pt-2 pb-5 transition-[opacity,translate] duration-200 ease-out-strong starting:translate-y-1.5 starting:opacity-0"
>
	<button
		type="button"
		onclick={() => (app.selectedId = null)}
		class="mb-2 -ml-0.5 inline-flex items-center gap-1.5 rounded-[10px] px-2.5 py-2 text-muted transition-[transform,color] duration-160 ease-out-strong hover:text-ink active:scale-[0.97]"
	>
		← Tüm yerler
	</button>
	<div>
		<span
			class="inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--c)_12%,transparent)] py-0.75 pr-2.5 pl-2 text-xs font-medium text-(--c) before:size-1.5 before:rounded-full before:bg-(--c)"
		>
			{style.label}
		</span>
	</div>
	<h2
		class="mt-3 mb-1 font-display text-[28px] leading-[1.1] font-semibold tracking-tight"
	>
		{place.name}
	</h2>
	<div class="text-muted">{place.province}</div>
	<p class="mt-4 text-[14.5px] leading-relaxed">{place.summary}</p>
	<button
		type="button"
		aria-pressed={done}
		onclick={() => app.toggleVisited(place.id)}
		class="mt-5 flex w-full items-center justify-center gap-2 rounded-[14px] border border-ink/10 bg-white/70 px-4 py-3 text-center font-medium transition-[transform,background-color,border-color] duration-160 ease-out-strong active:scale-[0.97] aria-pressed:border-visited/35 aria-pressed:bg-visited/12 aria-pressed:text-[#226b3c]"
	>
		{#if done}
			<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
				<circle cx="8" cy="8" r="8" fill="#2d8a4e" />
				<path
					d="M4.5 8.2l2.3 2.3 4.7-5"
					fill="none"
					stroke="#fff"
					stroke-width="1.8"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		{/if}
		Gezdim
	</button>
</section>
