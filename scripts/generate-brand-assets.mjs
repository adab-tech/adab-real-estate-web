/**
 * Generates PNG/ICO assets and the brand kit zip from brand sources.
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

async function optimizePrimaryLogo(sharp) {
  const logoPath = join(brandDir, "logo.png");
  const original = await readFile(logoPath);
  const meta = await sharp(original).metadata();

  if (meta.width && meta.width <= 800) {
    console.log(`  logo.png already optimized (${meta.width}px wide)`);
    return original;
  }

  const optimized = await sharp(original)
    .resize(720, null, { fit: "inside", withoutEnlargement: true })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();

  await writeFile(logoPath, optimized);
  console.log(
    `  logo.png optimized: ${original.length} → ${optimized.length} bytes`,
  );
  return optimized;
}

async function generateOgImage(sharp, logoBuffer) {
  const logoOnNavy = await sharp(logoBuffer)
    .resize(520, null, { fit: "inside" })
    .png()
    .toBuffer();

  const ogPath = join(brandDir, "og-image.png");
  const ogDownloadPath = join(downloadsDir, "og-image.png");

  await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: "#1B2A4A",
    },
  })
    .composite([{ input: logoOnNavy, gravity: "center" }])
    .png()
    .toFile(ogPath);

  await copyFile(ogPath, ogDownloadPath);
  console.log("  brand/og-image.png (from logo.png on navy)");
}

async function main() {
  const sharpMod = await ensureSharp();
  const sharp = sharpMod.default;

  await mkdir(downloadsDir, { recursive: true });

  console.log("Optimizing primary logo...");
  const logoBuffer = await optimizePrimaryLogo(sharp);

  const copies = [
    "logo-mark.svg",
    "logo-mark-white.svg",
    "favicon.svg",
    "nigeria-flag.svg",
    "cac-logo.png",
  ];

  for (const file of copies) {
    await copyFile(join(brandDir, file), join(downloadsDir, file));
  }

  console.log("Generating PNGs...");
  await writeFile(join(downloadsDir, "logo-primary.png"), logoBuffer);
  console.log("  brand/downloads/logo-primary.png (from logo.png)");
  await svgToPng(sharp, join(brandDir, "logo-mark.svg"), join(downloadsDir, "logo-mark.png"), 512);
  await svgToPng(sharp, join(brandDir, "logo-mark-white.svg"), join(downloadsDir, "logo-mark-white.png"), 512);
  await svgToPng(sharp, join(brandDir, "favicon.svg"), join(downloadsDir, "favicon-512.png"), 512);

  await generateOgImage(sharp, logoBuffer);

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
