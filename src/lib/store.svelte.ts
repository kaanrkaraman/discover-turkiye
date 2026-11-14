import { SvelteSet } from "svelte/reactivity";
import raw from "../../data/places.json";
import { CATEGORIES } from "./categories";
import type { Category, Place } from "./types";

export const places: readonly Place[] = raw as Place[];

const STORAGE_KEY = "dt-visited";

const loadVisited = (): number[] => {
	try {
		const parsed: unknown = JSON.parse(
			localStorage.getItem(STORAGE_KEY) ?? "[]",
		);
		return Array.isArray(parsed)
			? parsed.filter((value): value is number => Number.isInteger(value))
			: [];
	} catch {
		return [];
	}
};

const saveVisited = (ids: Iterable<number>) => {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
	} catch {
		return;
	}
};

// Accent-insensitive fold: "Şanlıurfa" and "sanliurfa" match, "İznik" ~ "iznik".
const fold = (text: string) =>
	text
		.toLocaleLowerCase("tr")
		.normalize("NFD")
		.replace(/\p{M}/gu, "")
		.replace(/ı/g, "i");

const words = (text: string) =>
	fold(text)
		.split(/[^\p{L}\p{N}]+/u)
		.filter(Boolean);

// Edit distance <= 1 (one typo, insertion or deletion).
const near = (a: string, b: string) => {
	if (Math.abs(a.length - b.length) > 1) return false;
	let i = 0;
	let j = 0;
	let edits = 0;
	while (i < a.length && j < b.length) {
		if (a[i] === b[j]) {
			i++;
			j++;
		} else if (++edits > 1) {
			return false;
		} else if (a.length > b.length) i++;
		else if (a.length < b.length) j++;
		else {
			i++;
			j++;
		}
	}
	return edits + (a.length - i) + (b.length - j) <= 1;
};

const index = places.map((place) => ({
	place,
	name: words(place.name),
	rest: words(`${place.province} ${CATEGORIES[place.category].label}`),
}));

// Every query token must match something; name hits outrank province/category hits.
const score = (entry: (typeof index)[number], tokens: string[]) => {
	let total = 0;
	for (const token of tokens) {
		let best = 0;
		for (const [pool, weight] of [
			[entry.name, 3],
			[entry.rest, 2],
		] as const) {
			for (const word of pool) {
				if (word === token) best = Math.max(best, weight * 3);
				else if (word.startsWith(token)) best = Math.max(best, weight * 2);
				else if (token.length > 2 && word.includes(token))
					best = Math.max(best, weight);
				else if (token.length > 3 && near(word, token))
					best = Math.max(best, 1);
			}
		}
		if (!best) return 0;
		total += best;
	}
	return total;
};

class AppState {
	query = $state("");
	only = $state<Category | null>(null);
	selectedId = $state<number | null>(null);
	visited = new SvelteSet<number>(loadVisited());

	selected = $derived(places.find((p) => p.id === this.selectedId) ?? null);

	visible = $derived.by(() => {
		const tokens = words(this.query);
		const pool = index.filter(
			(e) => this.only === null || e.place.category === this.only,
		);
		if (!tokens.length) return pool.map((e) => e.place);
		return pool
			.map((e) => ({ place: e.place, score: score(e, tokens) }))
			.filter((e) => e.score > 0)
			.sort((a, b) => b.score - a.score)
			.map((e) => e.place);
	});

	filtered = $derived(this.only !== null || this.query.trim() !== "");

	clear() {
		this.only = null;
		this.query = "";
	}

	toggleOnly(category: Category) {
		this.only = this.only === category ? null : category;
	}

	toggleVisited(id: number) {
		if (!this.visited.delete(id)) this.visited.add(id);
		saveVisited(this.visited);
	}
}

export const app = new AppState();
