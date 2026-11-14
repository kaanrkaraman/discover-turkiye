import places from "../data/places.json";
import { CATEGORY_KEYS } from "../src/lib/types";

const errors: string[] = [];
const ids = new Set<number>();
const names = new Set<string>();

for (const p of places) {
	const at = `#${p.id} ${p.name}`;
	if (ids.has(p.id)) errors.push(`${at}: duplicate id`);
	if (names.has(p.name)) errors.push(`${at}: duplicate name`);
	ids.add(p.id);
	names.add(p.name);
	if (!(CATEGORY_KEYS as readonly string[]).includes(p.category))
		errors.push(`${at}: unknown category "${p.category}"`);
	if (!p.province || !p.summary)
		errors.push(`${at}: empty province or summary`);
	// Türkiye bounding box; catches swapped lat/lng.
	if (!(p.lng >= 25.5 && p.lng <= 45 && p.lat >= 35.8 && p.lat <= 42.2))
		errors.push(`${at}: coordinates outside Türkiye (${p.lat}, ${p.lng})`);
}

if (errors.length) {
	console.error(errors.join("\n"));
	process.exit(1);
}
console.log(`${places.length} places OK`);
