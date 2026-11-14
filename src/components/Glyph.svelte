<script lang="ts">
interface Props {
	glyph: string;
	class?: string;
}

const { glyph, class: className = "" }: Props = $props();
</script>

<svg
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
	class={className}
>
	{@html glyph}
</svg>
