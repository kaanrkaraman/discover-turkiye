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
		glyph: `<path d="M6 5h12"/><path d="M6 5c-2 0-2 3 0 3M18 5c2 0 2 3 0 3"/><path d="M8 8h8"/><path d="M9.5 8v11M12 8v11M14.5 8v11"/><path d="M7 19h10M6 21h12"/>`,
	},
	monument: {
		label: "Tarihi Eserler",
		color: "#b8871f",
		glyph: `<path d="M4 21V4h16v17"/><path d="M4 8h16"/><path d="M8 21v-6.5a4 4 0 0 1 8 0V21"/><path d="M12 10.5v0"/>`,
	},
	castle: {
		label: "Kaleler",
		color: "#5d6470",
		glyph: `<path d="M7 21V9h10v12"/><path d="M6 9V4h2.5v2h2V4h3v2h2V4H18v5"/><path d="M10 21v-3a2 2 0 0 1 4 0v3"/><path d="M11 12.5h2"/>`,
	},
	museum: {
		label: "Müzeler",
		color: "#2f6f8f",
		glyph: `<path d="M9 3h6"/><path d="M10 3v3.2C7.2 7.3 6 10 6 13c0 3.4 2.4 6 6 6s6-2.6 6-6c0-3-1.2-5.7-4-6.8V3"/><path d="M8 6.5C5.5 6.5 5 9.5 6.5 11M16 6.5c2.5 0 3 3 1.5 4.5"/><path d="M9 21h6"/>`,
	},
	khan: {
		label: "Han ve Köprüler",
		color: "#7d8f3a",
		glyph: `<path d="M2 12c3-3.5 6.5-5 10-5s7 1.5 10 5"/><path d="M2 12v3M22 12v3"/><path d="M6 15a6 6 0 0 1 12 0"/><path d="M2 15h4M18 15h4"/><path d="M3 19.5c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 3 1 4.5 0"/>`,
	},
	park: {
		label: "Milli Parklar",
		color: "#4a7c4e",
		glyph: `<path d="M12 2 6.5 10H9l-4 6h14l-4-6h2.5z"/><path d="M12 16v6"/>`,
	},
	nature: {
		label: "Doğal Güzellikler",
		color: "#1f9fbf",
		glyph: `<path d="M2 16 8 7l4 5 3-3 7 7"/><path d="M3 20c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0"/>`,
	},
	cave: {
		label: "Mağaralar",
		color: "#6b4e3d",
		glyph: `<path d="M3 4h18M3 21h18"/><path d="M7 4v4l1.5 3L10 8V4M14 4v5l1.5 4L17 9V4M9 21l1.5-5L12 21"/>`,
	},
};
