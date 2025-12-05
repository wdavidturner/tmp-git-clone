import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export interface Config {
  copy: boolean;
  depth: number;
  defaultBranch: string | null;
}

const DEFAULT_CONFIG: Config = {
  copy: false,
  depth: 1,
  defaultBranch: null,
};

/**
 * Get the config directory path.
 */
export function getConfigDir(): string {
  return join(homedir(), ".tmp-git-clone");
}

/**
 * Get the config file path.
 */
export function getConfigPath(): string {
  return join(getConfigDir(), "config.json");
}

/**
 * Ensure the config directory exists.
 */
export function ensureConfigDir(): void {
  const dir = getConfigDir();
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

/**
 * Load config from file, returning defaults if not found.
 */
export function loadConfig(): Config {
  const configPath = getConfigPath();

  if (!existsSync(configPath)) {
    return { ...DEFAULT_CONFIG };
  }

  try {
    const content = readFileSync(configPath, "utf-8");
    const parsed = JSON.parse(content);
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

/**
 * Save config to file.
 */
export function saveConfig(config: Config): void {
  ensureConfigDir();
  const configPath = getConfigPath();
  writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n");
}

/**
 * Print current config.
 */
export function printConfig(): void {
  const configPath = getConfigPath();

  if (!existsSync(configPath)) {
    console.log("No config file found.");
    console.log(`Create one at: ${configPath}`);
    console.log("\nDefault settings:");
    console.log(JSON.stringify(DEFAULT_CONFIG, null, 2));
    return;
  }

  console.log(`Config: ${configPath}\n`);
  const config = loadConfig();
  console.log(JSON.stringify(config, null, 2));
}
