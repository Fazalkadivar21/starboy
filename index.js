#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import prompts from "prompts";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function copyTemplate(srcDir, destDir) {
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  const items = fs.readdirSync(srcDir);

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
  }
}

const configResponse = async () => {
  const responce = await prompts([
    {
      type: "select",
      name: "language",
      message: "Choose language:",
      choices: [
        { title: "JavaScript", value: "js" },
        { title: "TypeScript", value: "ts" },
      ],
      initial: 0,
    },
    {
      type: "select",
      name: "type",
      message: "Select type:",
      choices: [
        { title: "ES Modules", value: "modulejs" },
        { title: "CommonJS", value: "cjs" },
      ],
      initial: 0,
    },
  ]);

  return {
    language: responce.language.toLowerCase(),
    type: responce.type.toLowerCase(),
  };
};

(async () => {
  let rawArg = process.argv[2];

  let baseName;
  let isCurrentDir;
  let templateDir;

  if (!rawArg) {
    const response = await prompts({
      type: "text",
      name: "projectName",
      message: "Enter project name:",
      initial: "starboy-app",
    });

    baseName = response.projectName.toLowerCase();
    isCurrentDir = false;
  } else if (rawArg === ".") {
    isCurrentDir = true;
    baseName = path.basename(process.cwd());
  } else if (rawArg === "dev") {
    const { spawn } = await import("child_process");
    const devProcess = spawn("node", [path.join(__dirname, "dev.js")], {
      stdio: "inherit",
    });
    return;
  } else {
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

  const res = await configResponse();
  templateDir = `template-${res.language}-${res.type}`;
  const templatePath = path.join(__dirname, templateDir);

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

  if (!isCurrentDir) {
    console.log(chalk.yellow(`\ncd ${baseName}`));
  }
  console.log(chalk.green(`pnpm install`));
  console.log(chalk.green(`pnpm dev\n`));
})();
