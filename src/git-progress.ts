export interface GitProgress {
  phase: "counting" | "compressing" | "receiving" | "resolving";
  percent?: number;
  size?: string;
}

const patterns = {
  counting: /(?:remote: )?Counting objects:\s*(\d+)/,
  compressing: /(?:remote: )?Compressing objects:\s*(\d+)%/,
  receiving: /Receiving objects:\s*(\d+)%(?:[^,]*,\s*([\d.]+\s*[KMG]i?B))?/,
  resolving: /Resolving deltas:\s*(\d+)%/,
};

export function parseGitProgress(line: string): GitProgress | null {
  for (const [phase, regex] of Object.entries(patterns)) {
    const match = line.match(regex);
    if (match) {
      return {
        phase: phase as GitProgress["phase"],
        percent: match[1] ? parseInt(match[1], 10) : undefined,
        size: match[2] || undefined,
      };
    }
  }
  return null;
}

export function formatProgress(progress: GitProgress): string {
  const phaseNames: Record<GitProgress["phase"], string> = {
    counting: "Counting",
    compressing: "Compressing",
    receiving: "Receiving",
    resolving: "Resolving",
  };

  let text = phaseNames[progress.phase];
  if (progress.percent !== undefined) {
    text += ` ${progress.percent}%`;
  }
  if (progress.size) {
    text += `  ${progress.size}`;
  }
  return text;
}
