import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..", "src");

const orderedReplacements = [
  // Site containers → shared utility
  [
    /relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8/g,
    "relative site-container py-20 tablet:py-28",
  ],
  [
    /relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8/g,
    "relative site-container py-20 tablet:py-24",
  ],
  [
    /mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8/g,
    "site-container grid gap-12 py-16 desktop:grid-cols-2",
  ],
  [
    /mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8/g,
    "site-container space-y-8 py-10",
  ],
  [
    /mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8/g,
    "site-container py-4",
  ],
  [
    /mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8/g,
    "site-container py-10",
  ],
  [
    /mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8/g,
    "site-container py-12",
  ],
  [
    /mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8/g,
    "site-container py-14",
  ],
  [
    /mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8/g,
    "site-container py-16",
  ],
  [
    /mx-auto max-w-6xl px-4 py-8 sm:px-6/g,
    "site-container py-8",
  ],
  [
    /mx-auto max-w-6xl px-4 py-12 sm:px-6/g,
    "site-container py-12",
  ],
  [
    /mx-auto max-w-6xl px-4 py-16 sm:px-6/g,
    "site-container py-16",
  ],
  [
    /mx-auto max-w-6xl px-4 sm:px-6 lg:px-8/g,
    "site-container",
  ],
  [
    /mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8/g,
    "site-container flex h-16 items-center justify-between gap-6",
  ],
  [
    /mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6/g,
    "site-container flex flex-wrap items-center justify-between gap-4 py-4",
  ],
  [
    /mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 text-sm text-adab-gray-500 sm:px-6/g,
    "site-container flex flex-wrap items-center justify-between gap-4 text-sm text-adab-gray-500",
  ],
  [
    /mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8/g,
    "site-container max-w-3xl py-12",
  ],
  [
    /portal-shell mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6 lg:px-8/g,
    "portal-shell site-container max-w-4xl flex-1 py-12",
  ],
  [
    /portal-shell mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6/g,
    "portal-shell site-container max-w-2xl flex-1 py-12",
  ],
  [
    /portal-shell mx-auto w-full max-w-lg flex-1 px-4 py-12 sm:px-6/g,
    "portal-shell site-container max-w-lg flex-1 py-12",
  ],
  [/max-w-6xl/g, "max-w-site"],

  // Navigation shows at desktop (991px+)
  [/hidden items-center gap-8 md:flex/g, "hidden items-center gap-8 desktop:flex"],

  // Composite grid patterns
  [/sm:grid-cols-2 lg:grid-cols-6/g, "tablet:grid-cols-2 desktop:grid-cols-6"],
  [/sm:grid-cols-2 lg:grid-cols-4/g, "tablet:grid-cols-2 desktop:grid-cols-4"],
  [/sm:grid-cols-2 lg:grid-cols-3/g, "tablet:grid-cols-2 desktop:grid-cols-3"],
  [/lg:grid-cols-\[1\.4fr_1fr\]/g, "desktop:grid-cols-[1.4fr_1fr]"],
  [/lg:grid-cols-2/g, "desktop:grid-cols-2"],
  [/md:grid-cols-3/g, "tablet:grid-cols-3"],

  // Forms and admin panels
  [/sm:col-span-2/g, "tablet:col-span-2"],
  [/sm:grid-cols-3/g, "tablet:grid-cols-3"],
  [/sm:grid-cols-2/g, "tablet:grid-cols-2"],

  // Flex layout shifts
  [
    /flex-col gap-8 sm:flex-row sm:items-start sm:justify-between/g,
    "flex-col gap-8 tablet:flex-row tablet:items-start tablet:justify-between",
  ],
  [
    /flex flex-col gap-6 rounded-2xl border border-adab-gray-300\/60 bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8/g,
    "flex flex-col gap-6 rounded-2xl border border-adab-gray-300/60 bg-white p-6 tablet:flex-row tablet:items-center tablet:justify-between tablet:p-8",
  ],
  [
    /flex flex-col gap-4 rounded-2xl border border-adab-gray-300 bg-white p-5 shadow-sm sm:flex-row/g,
    "flex flex-col gap-4 rounded-2xl border border-adab-gray-300 bg-white p-5 shadow-sm tablet:flex-row",
  ],
  [
    /flex flex-col items-start gap-2 sm:items-end sm:text-right/g,
    "flex flex-col items-start gap-2 tablet:items-end tablet:text-right",
  ],
  [/sm:flex-row/g, "tablet:flex-row"],
  [/sm:items-end/g, "tablet:items-end"],
  [/sm:items-center/g, "tablet:items-center"],
  [/sm:justify-between/g, "tablet:justify-between"],
  [/sm:text-right/g, "tablet:text-right"],
  [/sm:text-left/g, "tablet:text-left"],
  [/sm:p-8/g, "tablet:p-8"],

  // Typography scales from phone/desktop
  [/sm:text-5xl/g, "phone:text-5xl"],
  [/sm:text-4xl/g, "phone:text-4xl"],
  [/lg:text-6xl/g, "desktop:text-6xl"],

  // Element sizing
  [
    /h-28 w-full rounded-xl object-cover sm:w-36/g,
    "h-28 w-full rounded-xl object-cover tablet:w-36",
  ],
  [
    /flex h-28 w-full items-center justify-center rounded-xl bg-adab-cream text-xs text-adab-gray-500 sm:w-36/g,
    "flex h-28 w-full items-center justify-center rounded-xl bg-adab-cream text-xs text-adab-gray-500 tablet:w-36",
  ],
  [/sm:h-16 sm:w-16/g, "tablet:h-16 tablet:w-16"],
  [/sm:w-36/g, "tablet:w-36"],

  // Visibility / display
  [/sm:inline-flex/g, "phone:inline-flex"],
];

const fallbackReplacements = [
  [/2xl:/g, "wide:"],
  [/xl:/g, "wide:"],
  [/lg:/g, "desktop:"],
  [/md:/g, "tablet:"],
  [/sm:/g, "phone:"],
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(tsx|ts|css)$/.test(entry.name)) files.push(full);
  }
  return files;
}

let changedFiles = 0;

for (const file of walk(root)) {
  if (file.endsWith("globals.css")) continue;

  let content = fs.readFileSync(file, "utf8");
  const original = content;

  for (const [pattern, replacement] of orderedReplacements) {
    content = content.replace(pattern, replacement);
  }

  for (const [pattern, replacement] of fallbackReplacements) {
    content = content.replace(pattern, replacement);
  }

  if (content !== original) {
    fs.writeFileSync(file, content);
    changedFiles += 1;
    console.log("updated:", path.relative(root, file));
  }
}

console.log(`\nDone. ${changedFiles} file(s) updated.`);
