export const CATEGORY_KEYS = [
	"ancient",
	"monument",
	"castle",
	"museum",
	"khan",
	"park",
	"nature",
	"cave",
] as const;

export type Category = (typeof CATEGORY_KEYS)[number];

export interface Place {
	id: number;
	name: string;
	category: Category;
	province: string;
	lng: number;
	lat: number;
	summary: string;
	verified: boolean;
}
