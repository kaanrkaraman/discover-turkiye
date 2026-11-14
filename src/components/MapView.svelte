<script lang="ts">
import {
	type ExpressionSpecification,
	type GeoJSONSource,
	Map as MapGL,
	NavigationControl,
	type PaddingOptions,
	setWorkerUrl,
} from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs" with {
	type: "file",
};
import { onMount } from "svelte";
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

const toCollection = (list: readonly Place[]) => ({
	type: "FeatureCollection" as const,
	features: list.map((p) => ({
		type: "Feature" as const,
		geometry: { type: "Point" as const, coordinates: [p.lng, p.lat] },
		properties: {
			id: p.id,
			name: p.name,
			category: p.category,
			color: CATEGORIES[p.category].color,
			visited: visited.has(p.id),
		},
	})),
});

let container: HTMLDivElement;
let map: MapGL | undefined;
let ready = $state(false);
let home: Home | null = null;

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
		bounds: [
			[25.5, 35.8],
			[45, 42.2],
		],
		fitBoundsOptions: { padding: padding() },
		attributionControl: { compact: true },
		maxPitch: 0,
	});
	map = instance;
	instance.addControl(
		new NavigationControl({ showCompass: false }),
		"top-right",
	);

	instance.on("load", async () => {
		instance.setMinZoom(instance.getZoom());
		instance.addImage("dt-cluster", await clusterImage(), { pixelRatio: 2 });
		for (const key of CATEGORY_KEYS) {
			instance.addImage(`dt-${key}`, await badgeImage(key, false), {
				pixelRatio: 2,
			});
			instance.addImage(`dt-${key}-visited`, await badgeImage(key, true), {
				pixelRatio: 2,
			});
		}
		instance.addSource("places", {
			type: "geojson",
			data: toCollection([]),
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

$effect(() => {
	if (!ready) return;
	map?.getSource<GeoJSONSource>("places")?.setData(toCollection(places));
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
