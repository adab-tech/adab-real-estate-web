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
const publicDir = join(__dirname, "..", "public");

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

async function readPrimaryLogo(sharp) {
  const logoPath = join(brandDir, "logo.png");
  const original = await readFile(logoPath);
  const meta = await sharp(original).metadata();
  console.log(
    `  logo.png source: ${original.length} bytes${meta.width ? `, ${meta.width}px wide` : ""}`,
  );
  return original;
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

async function generateFavicons(sharp, logoBuffer) {
  console.log("Generating favicons from logo.png...");

  const favicon32 = await sharp(logoBuffer)
    .resize(32, 32, { fit: "contain", background: "#1B2A4A" })
    .png()
    .toBuffer();

  const favicon512 = await sharp(logoBuffer)
    .resize(512, 512, { fit: "contain", background: "#1B2A4A" })
    .png()
    .toBuffer();

  const faviconIcoPath = join(brandDir, "favicon.ico");
  const faviconDownloadIcoPath = join(downloadsDir, "favicon.ico");
  const favicon32Path = join(brandDir, "favicon-32.png");
  const favicon512Path = join(downloadsDir, "favicon-512.png");
  const publicFaviconPath = join(publicDir, "favicon.ico");

  await writeFile(faviconIcoPath, favicon32);
  await writeFile(faviconDownloadIcoPath, favicon32);
  await writeFile(favicon32Path, favicon32);
  await writeFile(favicon512Path, favicon512);
  await writeFile(publicFaviconPath, favicon32);

  console.log("  brand/favicon.ico");
  console.log("  brand/favicon-32.png");
  console.log("  brand/downloads/favicon-512.png");
  console.log("  public/favicon.ico");
}

async function main() {
  const sharpMod = await ensureSharp();
  const sharp = sharpMod.default;

  await mkdir(downloadsDir, { recursive: true });

  console.log("Reading primary logo (logo.png is never overwritten)...");
  const logoBuffer = await readPrimaryLogo(sharp);

  const copies = ["nigeria-flag.svg", "cac-logo.png"];

  for (const file of copies) {
    await copyFile(join(brandDir, file), join(downloadsDir, file));
  }

  console.log("Generating PNGs...");
  await writeFile(join(downloadsDir, "logo-primary.png"), logoBuffer);
  console.log("  brand/downloads/logo-primary.png (from logo.png)");

  await generateOgImage(sharp, logoBuffer);
  await generateFavicons(sharp, logoBuffer);

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
