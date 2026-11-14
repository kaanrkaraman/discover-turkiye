import type { Category } from "./types";

interface CategoryStyle {
	label: string;
	color: string;
	glyph: string;
}

export const CATEGORIES: Record<Category, CategoryStyle> = {
	ancient: {
		label: "Antik Kentler",
		color: "#c2562d",
		glyph: `<path d="M4 9l8-4 8 4z"/><path d="M6 11v7M10 11v7M14 11v7M18 11v7M4 20h16"/>`,
	},
	monument: {
		label: "Tarihi Eserler",
		color: "#b8871f",
		glyph: `<path d="M3 20h12M4.5 20v-5a4.5 4.5 0 0 1 9 0v5M9 10.5V8.5"/><path d="M19 20V9l1-3 1 3v11M18 20h4"/>`,
	},
	castle: {
		label: "Kaleler",
		color: "#5d6470",
		glyph: `<path d="M5 20V8h2V5h2v3h2V5h2v3h2V5h2v3h2v12zM10 20v-4a2 2 0 0 1 4 0v4"/>`,
	},
	museum: {
		label: "Müzeler",
		color: "#2f6f8f",
		glyph: `<path d="M5 5h14v5H5z"/><path d="M9 10v11h6V10"/>`,
	},
	khan: {
		label: "Han ve Köprüler",
		color: "#7d8f3a",
		glyph: `<path d="M3 19h18M4 11h16M6 11v8M18 11v8M9 11a3 3 0 0 1 6 0"/>`,
	},
	park: {
		label: "Milli Parklar",
		color: "#4a7c4e",
		glyph: `<circle cx="6.5" cy="11" r="1.8"/><circle cx="10" cy="6.5" r="1.8"/><circle cx="14" cy="6.5" r="1.8"/><circle cx="17.5" cy="11" r="1.8"/><path d="M12 12c-3 0-5 3-5 5.5 0 2 2 2.5 5 1.5 3 1 5 .5 5-1.5 0-2.5-2-5.5-5-5.5z"/>`,
	},
	nature: {
		label: "Doğal Güzellikler",
		color: "#1f9fbf",
		glyph: `<circle cx="12" cy="9" r="3.5"/><path d="M12 2v1M4.5 5.5l.7.7M19.5 5.5l-.7.7"/><path d="M3 16c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 20c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/>`,
	},
	cave: {
		label: "Mağaralar",
		color: "#6b4e3d",
		glyph: `<path d="M3 4h18M3 21h18"/><path d="M7 4v4l1.5 3L10 8V4M14 4v5l1.5 4L17 9V4M9 21l1.5-5L12 21"/>`,
	},
};
