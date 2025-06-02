import { spawn } from "child_process";
import chokidar from "chokidar";
import chalk from "chalk";

let serverProcess;

const startServer = () => {
  if (serverProcess) {
    serverProcess.kill();
  }

  serverProcess = spawn("node", ["src/index.js"], {
    stdio: "inherit",
    env: { ...process.env },
  });

  console.log(chalk.green("\n🚀 Server started!"));
};

const watchAndRestart = () => {
  const watcher = chokidar.watch(".", {
    ignored: /node_modules|\.git|dist/,
    persistent: true,
    ignoreInitial: true,
  });

  watcher.on("all", () => {
    startServer();
  });

  startServer();
};

watchAndRestart();
