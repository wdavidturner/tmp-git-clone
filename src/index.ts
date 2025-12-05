#!/usr/bin/env node
import { Command } from "commander";
import { cloneRepository } from "./clone.js";
import { isValidGitUrl } from "./url-parser.js";
import { checkGitInstalled } from "./utils.js";

const program = new Command();

program
  .name("tmp-git-clone")
  .description("Clone git repositories to /tmp using shallow clone")
  .version("1.0.0")
  .argument("<url>", "Git repository URL (HTTPS or SSH)")
  .option("-d, --depth <number>", "Clone depth", "1")
  .option("-q, --quiet", "Suppress verbose output")
  .action(async (url: string, options: { depth: string; quiet?: boolean }) => {
    // Check git is installed
    if (!checkGitInstalled()) {
      console.error("Error: git is not installed or not in PATH");
      process.exit(1);
    }

    // Validate URL format
    if (!isValidGitUrl(url)) {
      console.error("Error: Invalid Git URL format");
      console.error("Supported formats:");
      console.error("  - https://github.com/user/repo.git");
      console.error("  - https://github.com/user/repo");
      console.error("  - git@github.com:user/repo.git");
      process.exit(1);
    }

    const depth = parseInt(options.depth, 10);
    if (isNaN(depth) || depth < 1) {
      console.error("Error: Depth must be a positive integer");
      process.exit(1);
    }

    const result = await cloneRepository(url, {
      verbose: !options.quiet,
      depth,
    });

    if (!result.success) {
      process.exit(1);
    }

    // In quiet mode, just output the path for scripting
    if (options.quiet) {
      console.log(result.path);
    }
  });

program.parse();
