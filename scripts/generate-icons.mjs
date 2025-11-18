#!/usr/bin/env node
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const svgPath = join(__dirname, "../src/public/icons/pullscope-icon.svg");
const outputDir = join(__dirname, "../src/public/icons");

const sizes = [16, 32, 48, 128];

const svg = readFileSync(svgPath, "utf-8");

console.log("Generating PNG icons from SVG...\n");

for (const size of sizes) {
    const outputPath = join(outputDir, `icon-${size}.png`);

    // Render SVG to PNG with resvg
    const resvg = new Resvg(svg, {
        fitTo: {
            mode: "width",
            value: size,
        },
    });

    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    writeFileSync(outputPath, pngBuffer);

    console.log(`✓ Generated ${size}x${size} icon: icon-${size}.png`);
}

console.log("\n✅ All icons generated successfully!");
