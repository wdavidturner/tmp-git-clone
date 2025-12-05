import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import yoctoSpinner from "yocto-spinner";
import pc from "picocolors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Get the project root directory.
 */
function getProjectRoot(): string {
  // We're in dist/, so go up one level
  return join(__dirname, "..");
}

/**
 * Run a command and return a promise.
 */
function runCommand(
  command: string,
  args: string[],
  cwd: string
): Promise<{ success: boolean; output: string }> {
  return new Promise((resolve) => {
    const proc = spawn(command, args, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let output = "";

    proc.stdout?.on("data", (data: Buffer) => {
      output += data.toString();
    });

    proc.stderr?.on("data", (data: Buffer) => {
      output += data.toString();
    });

    proc.on("close", (code) => {
      resolve({ success: code === 0, output });
    });

    proc.on("error", (err) => {
      resolve({ success: false, output: err.message });
    });
  });
}

/**
 * Check if this is a git repository.
 */
function isGitRepo(dir: string): boolean {
  return existsSync(join(dir, ".git"));
}

/**
 * Upgrade the installation.
 */
export async function upgrade(): Promise<void> {
  const projectRoot = getProjectRoot();

  console.log("");
  console.log(pc.blue("tmp-git-clone upgrade"));
  console.log("");

  // Check if this is a git repo (installed via curl installer)
  if (!isGitRepo(projectRoot)) {
    console.log(pc.yellow("This installation is not managed by git."));
    console.log("If installed via npm link, run:");
    console.log("");
    console.log("  cd <project-directory> && git pull && npm install && npm run build");
    console.log("");
    return;
  }

  // Step 1: Git pull
  const pullSpinner = yoctoSpinner({ text: "Fetching updates..." }).start();

  const pullResult = await runCommand("git", ["pull", "--ff-only", "origin", "main"], projectRoot);

  if (!pullResult.success) {
    pullSpinner.error("Failed to pull updates");
    console.log(pc.red(pullResult.output));
    process.exit(1);
  }

  if (pullResult.output.includes("Already up to date")) {
    pullSpinner.success("Already up to date");
    console.log("");
    return;
  }

  pullSpinner.success("Pulled latest changes");

  // Step 2: npm install
  const installSpinner = yoctoSpinner({ text: "Installing dependencies..." }).start();

  const installResult = await runCommand("npm", ["install", "--silent"], projectRoot);

  if (!installResult.success) {
    installSpinner.error("Failed to install dependencies");
    console.log(pc.red(installResult.output));
    process.exit(1);
  }

  installSpinner.success("Dependencies installed");

  // Step 3: npm run build
  const buildSpinner = yoctoSpinner({ text: "Building..." }).start();

  const buildResult = await runCommand("npm", ["run", "build", "--silent"], projectRoot);

  if (!buildResult.success) {
    buildSpinner.error("Build failed");
    console.log(pc.red(buildResult.output));
    process.exit(1);
  }

  buildSpinner.success("Build complete");

  console.log("");
  console.log(pc.green("Upgrade complete!"));
  console.log("");
}
