export interface ParsedGitUrl {
  originalUrl: string;
  repoName: string;
  owner: string;
  host: string;
}

/**
 * Parse a Git URL and extract repository information.
 * Supports HTTPS, SSH, and git:// protocols.
 */
export function parseGitUrl(url: string): ParsedGitUrl {
  const normalizedUrl = url.trim();

  // Pattern for SSH URLs: git@host:owner/repo.git
  const sshPattern = /^git@([^:]+):([^/]+)\/(.+?)(?:\.git)?$/;

  // Pattern for HTTPS/git URLs: https://host/owner/repo.git
  const httpsPattern =
    /^(?:https?|git):\/\/([^/]+)\/([^/]+)\/(.+?)(?:\.git)?$/;

  let match = normalizedUrl.match(sshPattern);
  if (match) {
    return {
      originalUrl: normalizedUrl,
      host: match[1],
      owner: match[2],
      repoName: match[3],
    };
  }

  match = normalizedUrl.match(httpsPattern);
  if (match) {
    return {
      originalUrl: normalizedUrl,
      host: match[1],
      owner: match[2],
      repoName: match[3],
    };
  }

  throw new Error(`Invalid Git URL format: ${url}`);
}

/**
 * Validate that a string is a valid Git URL.
 */
export function isValidGitUrl(url: string): boolean {
  try {
    parseGitUrl(url);
    return true;
  } catch {
    return false;
  }
}
