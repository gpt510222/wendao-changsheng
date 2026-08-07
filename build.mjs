import { cp, mkdir, rm, writeFile } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist/client/assets", { recursive: true });
await mkdir("dist/server", { recursive: true });
await mkdir("dist/.openai", { recursive: true });

for (const file of ["index.html", "styles.css", "game.js"]) {
  await cp(file, `dist/client/${file}`);
}
await cp("assets", "dist/client/assets", { recursive: true });
await cp(".openai/hosting.json", "dist/.openai/hosting.json");

await writeFile(
  "dist/server/index.js",
  `export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  }
};\n`,
);
