import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SUPPORTED_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".avif",
  ".svg",
  ".gif",
]);

const makeLabel = (fileName: string) => {
  const extension = path.extname(fileName);
  const words = fileName
    .slice(0, -extension.length)
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return words.replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export async function GET() {
  try {
    const iconsDirectory = path.join(
      process.cwd(),
      "public",
      "images",
      "affiliate"
    );
    const entries = await fs.readdir(iconsDirectory, { withFileTypes: true });
    const icons = entries
      .filter(
        (entry) =>
          entry.isFile() &&
          SUPPORTED_EXTENSIONS.has(path.extname(entry.name).toLowerCase())
      )
      .map((entry) => ({
        fileName: entry.name,
        label: makeLabel(entry.name),
        url: `/images/affiliate/${encodeURIComponent(entry.name)}`,
      }))
      .sort((first, second) => first.label.localeCompare(second.label));

    return NextResponse.json(icons, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error: any) {
    if (error?.code === "ENOENT") {
      return NextResponse.json([], {
        headers: { "Cache-Control": "no-store, max-age=0" },
      });
    }

    return NextResponse.json(
      { error: "Affiliate icons could not be loaded" },
      { status: 500 }
    );
  }
}
