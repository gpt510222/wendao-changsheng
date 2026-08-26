import { cp, mkdir, rm, writeFile } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist/client/assets", { recursive: true });
await mkdir("dist/client/assets/qstyle-v2", { recursive: true });
await mkdir("dist/server", { recursive: true });
await mkdir("dist/.openai", { recursive: true });

for (const file of ["index.html", "q-style-preview.html", "styles.css", "q-style.css", "game.js"]) {
  await cp(file, `dist/client/${file}`);
}
const gameAssets = [
  "bgm-battle-user-v1.wav",
  "bgm-main-user-v4.wav",
  "bgm-sword-breakthrough-user-v1.wav",
  "bgm-title-user-v3.wav",
  "bgm-tribulation-success-v1.wav",
  "bgm-tribulation-failure-v1.wav",
];
for (const asset of gameAssets) {
  await cp(`assets/${asset}`, `dist/client/assets/${asset}`);
}
await cp("assets/qstyle-v2", "dist/client/assets/qstyle-v2", { recursive: true });
await cp(".openai/hosting.json", "dist/.openai/hosting.json");

await writeFile(
  "dist/server/index.js",
  `export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  }
};\n`,
);
