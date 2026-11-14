import { rmSync } from "node:fs";
import { SveltePlugin } from "bun-plugin-svelte";
import tailwind from "bun-plugin-tailwind";

// Bun.build doesn't clear outdir; old hashed chunks would pile up.
rmSync("./dist", { recursive: true, force: true });

const result = await Bun.build({
	entrypoints: ["./index.html"],
	outdir: "./dist",
	minify: true,
	plugins: [SveltePlugin(), tailwind],
});

if (!result.success) {
	for (const log of result.logs) console.error(log);
	process.exit(1);
}
