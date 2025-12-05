import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ensureConfigDir, getConfigDir } from "./config.js";

export interface HistoryEntry {
  url: string;
  path: string;
  clonedAt: string;
}

interface HistoryFile {
  repos: HistoryEntry[];
}

const MAX_HISTORY = 50;

/**
 * Get the history file path.
 */
export function getHistoryPath(): string {
  return join(getConfigDir(), "history.json");
}

/**
 * Load history from file.
 */
export function loadHistory(): HistoryEntry[] {
  const historyPath = getHistoryPath();

  if (!existsSync(historyPath)) {
    return [];
  }

  try {
    const content = readFileSync(historyPath, "utf-8");
    const parsed: HistoryFile = JSON.parse(content);
    return parsed.repos || [];
  } catch {
    return [];
  }
}

/**
 * Save history to file.
 */
function saveHistory(entries: HistoryEntry[]): void {
  ensureConfigDir();
  const historyPath = getHistoryPath();
  const data: HistoryFile = { repos: entries };
  writeFileSync(historyPath, JSON.stringify(data, null, 2) + "\n");
}

/**
 * Add an entry to history.
 */
export function addToHistory(url: string, path: string): void {
  const entries = loadHistory();

  // Remove existing entry for same URL if present
  const filtered = entries.filter((e) => e.url !== url);

  // Add new entry at the beginning
  filtered.unshift({
    url,
    path,
    clonedAt: new Date().toISOString(),
  });

  // Trim to max size
  const trimmed = filtered.slice(0, MAX_HISTORY);

  saveHistory(trimmed);
}

/**
 * Clear all history.
 */
export function clearHistory(): void {
  saveHistory([]);
}

/**
 * Print history.
 */
export function printHistory(): void {
  const entries = loadHistory();

  if (entries.length === 0) {
    console.log("No clone history.");
    return;
  }

  console.log("Clone history:\n");

  for (const entry of entries) {
    const date = new Date(entry.clonedAt).toLocaleDateString();
    console.log(`  ${entry.url}`);
    console.log(`  └─ ${entry.path} (${date})`);
    console.log("");
  }
}
