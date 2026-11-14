<script lang="ts">
import {
	type ExpressionSpecification,
	type GeoJSONSource,
	LngLat,
	type LngLatBoundsLike,
	Map as MapGL,
	NavigationControl,
	type PaddingOptions,
	setWorkerUrl,
} from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs" with {
	type: "file",
};
import { onMount, untrack } from "svelte";
import { CATEGORIES } from "../lib/categories";
import { badgeImage, clusterImage } from "../lib/icons";
import { CATEGORY_KEYS, type Place } from "../lib/types";

interface Props {
	places: readonly Place[];
	selected: Place | null;
	visited: ReadonlySet<number>;
	onselect: (id: number) => void;
}

const { places, selected, visited, onselect }: Props = $props();

interface Home {
	center: [number, number];
	zoom: number;
	padding: PaddingOptions;
}

const SELECT_ZOOM = 10;
const TURKIYE: LngLatBoundsLike = [
	[25.5, 35.8],
	[45, 42.2],
];
const REPO = "https://github.com/kaanrkaraman/discover-turkiye";
const FONT = ["Noto Sans Regular"];
const NO_SELECTION: ExpressionSpecification = ["==", ["get", "id"], -1];
const SINGLE: ExpressionSpecification = ["!", ["has", "point_count"]];

const desktop = matchMedia("(min-width: 768px)");
const reduced = matchMedia("(prefers-reduced-motion: reduce)");

const padding = (): PaddingOptions =>
	desktop.matches
		? { top: 40, bottom: 40, left: 420, right: 40 }
		: { top: 40, bottom: innerHeight * 0.55, left: 20, right: 20 };

const ease = (t: number) =>
	t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

const clamp = (value: number, min: number, max: number) =>
	Math.min(Math.max(value, min), max);

const toFeature = (p: Place) => ({
	type: "Feature" as const,
	id: p.id,
	geometry: { type: "Point" as const, coordinates: [p.lng, p.lat] },
	properties: {
		id: p.id,
		name: p.name,
		category: p.category,
		color: CATEGORIES[p.category].color,
		visited: visited.has(p.id),
	},
});

let container: HTMLDivElement;
let map: MapGL | undefined;
let ready = $state(false);
let home: Home | null = null;
// Ids currently in the source and their last-synced visited state, so updates send diffs only.
let shown = new Set<number>();
let marked = new Set<number>();

// Smallest zoom that still shows all of Türkiye beside the panel.
const fitZoom = () =>
	map?.cameraForBounds(TURKIYE, { padding: padding() })?.zoom ?? 0;

const fly = (options: Parameters<MapGL["flyTo"]>[0]) =>
	map?.flyTo({
		...options,
		speed: 0.8,
		curve: 1.4,
		maxDuration: 2800,
		easing: ease,
		essential: true,
		...(reduced.matches && { duration: 0 }),
	});

onMount(() => {
	setWorkerUrl(workerUrl);
	const instance = new MapGL({
		container,
		style: "https://tiles.openfreemap.org/styles/positron",
		bounds: TURKIYE,
		fitBoundsOptions: { padding: padding() },
		attributionControl: {
			compact: true,
			customAttribution: `<a href="${REPO}" target="_blank" rel="noopener">GitHub</a>`,
		},
		// Page is lang="tr"; screen readers read these labels.
		locale: {
			"Map.Title": "Harita",
			"NavigationControl.ZoomIn": "Yakınlaştır",
			"NavigationControl.ZoomOut": "Uzaklaştır",
			"AttributionControl.ToggleAttribution": "Kaynakları göster",
		},
		maxPitch: 0,
		dragRotate: false,
		pitchWithRotate: false,
		// Keep the camera centre over Türkiye so it can't be panned out of view.
		transformConstrain: (center, zoom) => ({
			center: new LngLat(
				clamp(center.lng, 25.5, 45),
				clamp(center.lat, 35.8, 42.2),
			),
			zoom: clamp(zoom, map?.getMinZoom() ?? 0, 22),
		}),
	});
	map = instance;
	instance.touchZoomRotate.disableRotation();
	instance.keyboard.disableRotation();
	instance.on("resize", () => instance.setMinZoom(fitZoom()));
	instance.addControl(
		new NavigationControl({ showCompass: false }),
		"top-right",
	);

	instance.on("load", async () => {
		instance.setMinZoom(fitZoom());
		const images = await Promise.all([
			clusterImage().then((image) => ["dt-cluster", image] as const),
			...CATEGORY_KEYS.flatMap((key) =>
				[false, true].map((done) =>
					badgeImage(key, done).then(
						(image) => [`dt-${key}${done ? "-visited" : ""}`, image] as const,
					),
				),
			),
		]);
		for (const [name, image] of images)
			instance.addImage(name, image, { pixelRatio: 2 });
		instance.addSource("places", {
			type: "geojson",
			data: { type: "FeatureCollection", features: [] },
			cluster: true,
			clusterRadius: 44,
			clusterMaxZoom: SELECT_ZOOM - 1,
		});
		instance.addLayer({
			id: "selection",
			type: "circle",
			source: "places",
			filter: ["all", SINGLE, NO_SELECTION],
			paint: {
				"circle-radius": 26,
				"circle-color": ["get", "color"],
				"circle-opacity": 0.2,
			},
		});
		instance.addLayer({
			id: "clusters",
			type: "symbol",
			source: "places",
			filter: ["has", "point_count"],
			layout: {
				"icon-image": "dt-cluster",
				"icon-size": ["step", ["get", "point_count"], 0.8, 10, 0.95, 30, 1.1],
				"icon-allow-overlap": true,
				"text-field": ["get", "point_count_abbreviated"],
				"text-font": FONT,
				"text-size": 12,
			},
			paint: { "text-color": "#fff" },
		});
		instance.addLayer({
			id: "places",
			type: "symbol",
			source: "places",
			filter: SINGLE,
			layout: {
				"icon-image": [
					"concat",
					"dt-",
					["get", "category"],
					["case", ["get", "visited"], "-visited", ""],
				],
				"icon-size": ["interpolate", ["linear"], ["zoom"], 5, 0.72, 9, 1],
				"icon-allow-overlap": true,
				"text-field": ["step", ["zoom"], "", 6.5, ["get", "name"]],
				"text-font": FONT,
				"text-size": 12,
				"text-anchor": "top",
				"text-offset": [0, 1.3],
				"text-optional": true,
			},
			paint: {
				"text-color": "#241f1a",
				"text-halo-color": "#fff",
				"text-halo-width": 1.6,
			},
		});

		instance.on("click", "places", (event) => {
			const id = event.features?.[0]?.properties?.id;
			if (typeof id === "number") onselect(id);
		});
		instance.on("click", "clusters", async (event) => {
			const feature = event.features?.[0];
			const source = instance.getSource<GeoJSONSource>("places");
			if (!feature || !source) return;
			const zoom = await source.getClusterExpansionZoom(
				Number(feature.properties?.cluster_id),
			);
			instance.easeTo({
				center: event.lngLat,
				zoom,
				duration: reduced.matches ? 0 : 600,
			});
		});
		for (const layer of ["places", "clusters"]) {
			instance.on("mouseenter", layer, () => {
				instance.getCanvas().style.cursor = "pointer";
			});
			instance.on("mouseleave", layer, () => {
				instance.getCanvas().style.cursor = "";
			});
		}
		ready = true;
	});

	return () => {
		instance.remove();
		map = undefined;
	};
});

// Filter change: add/remove only the places that entered or left the list.
$effect(() => {
	if (!ready) return;
	const next = new Set(places.map((p) => p.id));
	const remove = [...shown].filter((id) => !next.has(id));
	const add = untrack(() =>
		places.filter((p) => !shown.has(p.id)).map(toFeature),
	);
	shown = next;
	if (remove.length || add.length)
		map?.getSource<GeoJSONSource>("places")?.updateData({ remove, add });
});

// Visited toggle: patch the one changed property instead of resending the data.
$effect(() => {
	if (!ready) return;
	const now = new Set(visited);
	const changed = [
		...[...now].filter((id) => !marked.has(id)),
		...[...marked].filter((id) => !now.has(id)),
	];
	marked = now;
	if (changed.length)
		map?.getSource<GeoJSONSource>("places")?.updateData({
			update: changed.map((id) => ({
				id,
				addOrUpdateProperties: [{ key: "visited", value: now.has(id) }],
			})),
		});
});

$effect(() => {
	if (!ready || !map) return;
	if (selected) {
		if (!home) {
			const center = map.getCenter();
			home = {
				center: [center.lng, center.lat],
				zoom: map.getZoom(),
				padding: map.getPadding(),
			};
		}
		map.setFilter("selection", [
			"all",
			SINGLE,
			["==", ["get", "id"], selected.id],
		]);
		fly({
			center: [selected.lng, selected.lat],
			zoom: Math.max(map.getZoom(), SELECT_ZOOM),
			padding: padding(),
		});
	} else {
		map.setFilter("selection", ["all", SINGLE, NO_SELECTION]);
		if (home) fly(home);
		home = null;
	}
});
</script>

<div class="fixed inset-0">
	<div bind:this={container} class="size-full"></div>
</div>
