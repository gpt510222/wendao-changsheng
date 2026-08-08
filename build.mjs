import { cp, mkdir, rm, writeFile } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist/client/assets", { recursive: true });
await mkdir("dist/server", { recursive: true });
await mkdir("dist/.openai", { recursive: true });

for (const file of ["index.html", "styles.css", "game.js"]) {
  await cp(file, `dist/client/${file}`);
}
const gameAssets = [
  "battle-demon-v3.png", "battle-dragon-v3.png", "battle-human-v3.png",
  "battle-immortal-v3.png", "battle-player-female-v3.png",
  "battle-player-male-v3.png", "battle-yao-v3.png",
  "bgm-battle-user-v1.wav", "bgm-main-user-v4.wav", "bgm-title-user-v3.wav",
  "body-icon-v2.png", "cultivation-bg-v2.png", "spirit-icon-v2.png", "title-bg.png",
  "element-earth-v2.png", "element-fire-v2.png", "element-metal-v2.png",
  "element-water-v2.png", "element-wood-v2.png",
  "female-character-outfit-1-v12.png", "female-character-outfit-2-v12.png",
  "female-character-outfit-3-v12.png", "male-character-outfit-1-v12.png",
  "male-character-outfit-2-v12.png", "male-character-outfit-3-v12.png",
  "nav-arts-v1.png", "nav-bag-v1.png", "nav-cave-v1.png",
  "nav-experience-v1.png", "nav-sect-v1.png", "nav-spirit-root-v1.png",
  "resource-dao-child-v1.png", "resource-food-v1.png",
  "resource-meteor-iron-v1.png", "resource-spirit-jade-v1.png",
  "resource-spirit-stone-v1.png", "resource-wood-v1.png",
  "sect-npc-sheet-v2.png", "sect-token-v1.png", "spirit-pool-v3.png",
];
for (const asset of gameAssets) {
  await cp(`assets/${asset}`, `dist/client/assets/${asset}`);
}
await cp(".openai/hosting.json", "dist/.openai/hosting.json");

await writeFile(
  "dist/server/index.js",
  `export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  }
};\n`,
);
