#!/usr/bin/env node
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const vizRenderStringSync = require("@aduh95/viz.js/sync");

const rootDir = path.resolve(__dirname, "..");
const diagramsDir = path.join(rootDir, "diagrams");
let depcruiseBin = path.join(
  rootDir,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "depcruise.cmd" : "depcruise"
);
if (!fs.existsSync(depcruiseBin)) {
  depcruiseBin = path.join(rootDir, "node_modules", ".bin", "depcruise");
}
const configPath = path.join(rootDir, "dependency-cruiser.config.cjs");
const entryPoints = ["app", "components", "lib", "prisma", "reui", "middleware.ts"];

if (!fs.existsSync(depcruiseBin)) {
  console.error("depcruise binary not found. Did you run npm install?");
  process.exit(1);
}

if (!fs.existsSync(diagramsDir)) {
  fs.mkdirSync(diagramsDir, { recursive: true });
}

const commonArgs = ["--config", configPath, ...entryPoints];

function runDepcruise(outputType) {
  const { status, stdout, stderr } = spawnSync(depcruiseBin, ["--output-type", outputType, ...commonArgs], {
    cwd: rootDir,
    encoding: "utf-8",
    maxBuffer: 1024 * 1024 * 20,
  });

  if (status !== 0) {
    console.error(stderr || stdout);
    process.exit(status ?? 1);
  }

  return stdout;
}

const jsonOutput = runDepcruise("json");
fs.writeFileSync(path.join(diagramsDir, "dep-graph.json"), jsonOutput, "utf-8");

const dotOutput = runDepcruise("dot");
const svgOutput = vizRenderStringSync(dotOutput);
fs.writeFileSync(path.join(diagramsDir, "dep-graph.svg"), svgOutput, "utf-8");

console.log("Dependency graph exported to diagrams/dep-graph.json and diagrams/dep-graph.svg");
