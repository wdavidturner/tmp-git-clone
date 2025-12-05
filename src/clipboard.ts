import { execSync } from "node:child_process";
import { platform } from "node:os";

/**
 * Copy text to clipboard.
 * Uses pbcopy on macOS, xclip on Linux.
 */
export function copyToClipboard(text: string): boolean {
  try {
    const os = platform();

    if (os === "darwin") {
      execSync("pbcopy", { input: text });
      return true;
    }

    if (os === "linux") {
      // Try xclip first, then xsel
      try {
        execSync("xclip -selection clipboard", { input: text });
        return true;
      } catch {
        try {
          execSync("xsel --clipboard --input", { input: text });
          return true;
        } catch {
          return false;
        }
      }
    }

    return false;
  } catch {
    return false;
  }
}
