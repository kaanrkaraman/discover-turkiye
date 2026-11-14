declare module "*.css";

declare module "maplibre-gl/dist/maplibre-gl-worker.mjs" {
	const url: string;
	export default url;
}
