import { CATEGORIES } from "./categories";
import type { Category } from "./types";

const OCTAGON = Array.from({ length: 8 }, (_, i) => {
	const angle = ((22.5 + 45 * i) * Math.PI) / 180;
	return `${(32 + 28 * Math.cos(angle)).toFixed(1)},${(31 + 28 * Math.sin(angle)).toFixed(1)}`;
}).join(" ");

const SHADOW = `<defs><filter id="s" x="-25%" y="-25%" width="150%" height="160%"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#241f1a" flood-opacity=".3"/></filter></defs>`;

const CHECK = `<circle cx="50" cy="48" r="9" fill="#2d8a4e" stroke="#fff" stroke-width="2.5"/><path d="M46 48l3 3 5-6" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;

const wrap = (body: string) =>
	`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">${SHADOW}${body}</svg>`;

const rasterize = async (svg: string) => {
	const image = new Image(64, 64);
	image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
	await image.decode();
	return image;
};

export const badgeImage = (category: Category, visited: boolean) => {
	const { color, glyph } = CATEGORIES[category];
	const ink = visited ? "#fff" : color;
	return rasterize(
		wrap(
			`<polygon points="${OCTAGON}" fill="${visited ? color : "#fff"}" stroke="${ink}" stroke-width="3" stroke-linejoin="round" filter="url(#s)"/><g transform="translate(18 17) scale(1.17)" fill="none" stroke="${ink}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${glyph}</g>${visited ? CHECK : ""}`,
		),
	);
};

export const clusterImage = () =>
	rasterize(
		wrap(
			`<polygon points="${OCTAGON}" fill="#241f1a" stroke="#fff" stroke-width="3" stroke-linejoin="round" filter="url(#s)"/>`,
		),
	);
