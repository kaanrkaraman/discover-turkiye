<script lang="ts">
import { CATEGORIES } from "../lib/categories";
import { app } from "../lib/store.svelte";
import Glyph from "./Glyph.svelte";
</script>

<section
	class="absolute inset-0 overflow-y-auto px-2.5 pt-2 pb-3.5 transition-[opacity,translate] duration-200 ease-out-strong starting:translate-y-1.5 starting:opacity-0"
>
	<div
		class="flex items-center justify-between px-2 pt-2 pb-1.5 text-xs text-muted"
	>
		<span>
			{app.visible.length}
			yer{app.visited.size ? ` · ${app.visited.size} gezildi` : ""}
		</span>
		{#if app.filtered}
			<button
				type="button"
				onclick={() => app.clear()}
				class="rounded-md px-1.5 py-0.5 font-medium text-ink transition-transform duration-160 ease-out-strong hover:bg-ink/5 active:scale-[0.97]"
			>
				Filtreleri temizle
			</button>
		{/if}
	</div>
	<ul class="m-0 list-none p-0">
		{#each app.visible as place, i (place.id)}
			{@const style = CATEGORIES[place.category]}
			<li>
				<button
					type="button"
					onclick={() => (app.selectedId = place.id)}
					style:--c={style.color}
					style:animation-delay="{Math.min(i, 10) * 30}ms"
					class="flex w-full animate-rise items-center gap-3 rounded-xl px-2 py-2.5 transition-[transform,background-color] duration-120 ease-out-strong hover:bg-ink/5 active:scale-[0.985] motion-reduce:animate-none"
				>
					<Glyph glyph={style.glyph} class="size-5 shrink-0 text-(--c)" />
					<span class="min-w-0 flex-1">
						<b class="block font-medium">{place.name}</b>
						<small class="text-xs text-muted"
							>{place.province}
							· {style.label}</small
						>
					</span>
					{#if app.visited.has(place.id)}
						<svg
							class="shrink-0 text-visited"
							viewBox="0 0 16 16"
							width="16"
							height="16"
							aria-label="Gezildi"
						>
							<circle cx="8" cy="8" r="8" fill="currentColor" />
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
				</button>
			</li>
		{:else}
			<li class="px-2 py-7 text-center text-muted">Eşleşen yer yok.</li>
		{/each}
	</ul>
</section>
