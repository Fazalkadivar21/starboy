#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import prompts from "prompts";
import chalk from "chalk";
import cliProgress from "cli-progress";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function copyTemplate(srcDir, destDir) {
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  const items = fs.readdirSync(srcDir);

  // Setup Progress Bar
  const bar = new cliProgress.SingleBar(
    {
      format: "🚧 creating [{bar}] {percentage}% | {value}/{total} files",
      barCompleteChar: "█",
      barIncompleteChar: "░",
      hideCursor: true,
    },
    cliProgress.Presets.shades_classic
  );

  bar.start(items.length, 0);

  let count = 0;
  for (const item of items) {
    const srcPath = path.join(srcDir, item);
    const destPath = path.join(destDir, item);
    const stats = fs.statSync(srcPath);

    if (stats.isDirectory()) {
      copyTemplate(srcPath, destPath);
    } else {
      const content = fs.readFileSync(srcPath, "utf-8");
      fs.writeFileSync(destPath, content);
    }

    count++;
    bar.update(count);
  }

  bar.stop();
}

(async () => {
  let rawArg = process.argv[2];

  let baseName;
  let isCurrentDir;

  if (!rawArg) {
    // 2. agar arg empty hai, toh prompt karo
    const response = await prompts({
      type: "text",
      name: "projectName",
      message: "Enter project name:",
      initial: "starboy-app",
    });
    baseName = response.projectName.toLowerCase(); // lowercase bhi kar dia
    isCurrentDir = false;
  } else if (rawArg === ".") {
    // 1. agar '.' hai toh current directory
    isCurrentDir = true;
    baseName = path.basename(process.cwd());
  } else if (rawArg === "dev") {
    const { spawn } = await import("child_process");
    const devProcess = spawn("node", [path.join(__dirname, "dev.js")], {
      stdio: "inherit",
    });
    return;
  } else {
    // 3. arg diya hai, use lowercase karo
    isCurrentDir = false;
    baseName = rawArg.toLowerCase();
  }

  const targetDir = isCurrentDir
    ? process.cwd()
    : path.join(process.cwd(), baseName);

  if (!isCurrentDir && fs.existsSync(targetDir)) {
    console.log(chalk.red(`❌ Folder "${baseName}" already exists.`));
    process.exit(1);
  }

  if (!isCurrentDir) fs.mkdirSync(targetDir);

  console.log(
    chalk.blue(
      `\n🚀 Creating project: ${baseName} in ${
        isCurrentDir ? "current directory" : targetDir
      }`
    )
  );

  const templatePath = path.join(__dirname, "templates");
  copyTemplate(templatePath, targetDir);

  ["README.md", "package.json"].forEach((fileName) => {
    const filePath = path.join(targetDir, fileName);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, "utf-8");
      content = content.replace(/{{projectName}}/g, baseName);
      fs.writeFileSync(filePath, content);
    }
  });

  console.log(chalk.green("\n✅ Project files created successfully!"));

  if (isCurrentDir) {
    console.log(
      chalk.yellow(`\n👉 You are already inside your project folder`)
    );
  } else {
    console.log(chalk.yellow(`\ncd ${baseName}`));
  }
  console.log(chalk.yellow(`pnpm install`));
  console.log(chalk.yellow(`pnpm dev\n`));
})();
