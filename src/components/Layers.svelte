<script lang="ts">
import { CATEGORIES } from "../lib/categories";
import { app, places } from "../lib/store.svelte";
import { CATEGORY_KEYS } from "../lib/types";
import Glyph from "./Glyph.svelte";

const counts = Object.fromEntries(
	CATEGORY_KEYS.map((key) => [
		key,
		places.filter((p) => p.category === key).length,
	]),
);
</script>

<div
	class="flex snap-x [scrollbar-width:none] gap-2 overflow-x-auto px-4 pt-3 pb-3.5 md:grid md:grid-cols-2 md:overflow-visible"
>
	{#each CATEGORY_KEYS as key (key)}
		{@const style = CATEGORIES[key]}
		{@const dimmed = app.only !== null && app.only !== key}
		<button
			type="button"
			onclick={() => app.toggleOnly(key)}
			aria-pressed={app.only === key}
			style:--c={style.color}
			class="flex shrink-0 snap-start items-center gap-2 rounded-[14px] border border-ink/10 bg-white/70 px-2.5 py-2 md:min-w-0 transition-[transform,opacity,background-color,border-color] duration-160 ease-out-strong hover:bg-white active:scale-[0.97] aria-pressed:border-(--c) aria-pressed:bg-white {dimmed
				? "opacity-55"
				: ""}"
		>
			<Glyph glyph={style.glyph} class="size-5 shrink-0 text-(--c)" />
			<span
				class="min-w-0 flex-1 leading-tight font-medium whitespace-nowrap md:whitespace-normal"
				>{style.label}</span
			>
			<em class="shrink-0 text-muted not-italic tabular-nums">{counts[key]}</em>
		</button>
	{/each}
</div>
