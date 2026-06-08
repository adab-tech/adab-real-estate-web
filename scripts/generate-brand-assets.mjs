/**
 * Generates PNG/ICO assets and the brand kit zip from SVG sources.
 * Run: node scripts/generate-brand-assets.mjs
 */
import { readFile, writeFile, copyFile, mkdir, readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const brandDir = join(__dirname, "..", "public", "brand");
const downloadsDir = join(brandDir, "downloads");

async function ensureSharp() {
  try {
    return await import("sharp");
  } catch {
    console.log("Installing sharp for asset generation...");
    execSync("npm install --no-save sharp", {
      cwd: join(__dirname, ".."),
      stdio: "inherit",
    });
    return await import("sharp");
  }
}

async function svgToPng(sharp, svgPath, pngPath, width) {
  const svg = await readFile(svgPath);
  await sharp(svg, { density: 300 })
    .resize(width)
    .png()
    .toFile(pngPath);
  console.log(`  ${pngPath.replace(brandDir, "brand")}`);
}

async function main() {
  const sharpMod = await ensureSharp();
  const sharp = sharpMod.default;

  await mkdir(downloadsDir, { recursive: true });

  const copies = [
    "logo-primary.svg",
    "logo-primary-white.svg",
    "logo-mark.svg",
    "logo-mark-white.svg",
    "favicon.svg",
    "nigeria-flag.svg",
    "og-image.svg",
  ];

  for (const file of copies) {
    await copyFile(join(brandDir, file), join(downloadsDir, file));
  }

  await copyFile(
    join(downloadsDir, "README.md"),
    join(downloadsDir, "README.md"),
  ).catch(() => {});

  console.log("Generating PNGs...");
  await svgToPng(sharp, join(brandDir, "logo-primary.svg"), join(brandDir, "logo.png"), 720);
  await svgToPng(sharp, join(brandDir, "logo-primary.svg"), join(downloadsDir, "logo-primary.png"), 720);
  await svgToPng(sharp, join(brandDir, "logo-primary-white.svg"), join(downloadsDir, "logo-primary-white.png"), 720);
  await svgToPng(sharp, join(brandDir, "logo-mark.svg"), join(downloadsDir, "logo-mark.png"), 512);
  await svgToPng(sharp, join(brandDir, "logo-mark-white.svg"), join(downloadsDir, "logo-mark-white.png"), 512);
  await svgToPng(sharp, join(brandDir, "favicon.svg"), join(downloadsDir, "favicon-512.png"), 512);
  await svgToPng(sharp, join(brandDir, "og-image.svg"), join(brandDir, "og-image.png"), 1200);
  await svgToPng(sharp, join(brandDir, "og-image.svg"), join(downloadsDir, "og-image.png"), 1200);

  console.log("Generating favicon.ico...");
  const faviconPng = await sharp(await readFile(join(brandDir, "favicon.svg")))
    .resize(32)
    .png()
    .toBuffer();
  await writeFile(join(brandDir, "favicon.ico"), faviconPng);
  await writeFile(join(downloadsDir, "favicon.ico"), faviconPng);

  console.log("Creating adab-brand-kit.zip...");
  const zipPath = join(brandDir, "adab-brand-kit.zip");
  const isWin = process.platform === "win32";
  if (isWin) {
    execSync(
      `powershell -NoProfile -Command "Compress-Archive -Path '${downloadsDir}\\*' -DestinationPath '${zipPath}' -Force"`,
      { stdio: "inherit" },
    );
  } else {
    execSync(`cd "${downloadsDir}" && zip -r "${zipPath}" .`, { stdio: "inherit" });
  }

  const files = await readdir(downloadsDir);
  console.log(`\nDone. ${files.length} files in downloads/, zip at brand/adab-brand-kit.zip`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
