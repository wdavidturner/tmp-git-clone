# tmp-git-clone

A visually polished CLI tool for quickly cloning git repositories to `/tmp` for exploration.

## Features

- **Shallow clone** (`--depth 1`) for fast downloads
- **Organized storage** at `/tmp/tmp-git-clone/{owner}/{repo}`
- **Beautiful UI** with animated spinners and progress tracking
- **Real-time progress** parsing (Counting → Compressing → Receiving)
- **Auto-cleanup** - re-cloning removes existing directory first
- **Quiet mode** for scripting

## Installation

```bash
# Clone this repo
git clone https://github.com/wdavidturner/tmp-git-clone.git
cd tmp-git-clone

# Install dependencies and build
npm install
npm run build

# Link globally
npm link
```

## Usage

```bash
# Clone a repository
tmp-git-clone https://github.com/rails/rails

# SSH URLs work too
tmp-git-clone git@github.com:rails/rails.git

# Custom clone depth
tmp-git-clone --depth 10 https://github.com/rails/rails

# Quiet mode (outputs only the path)
tmp-git-clone -q https://github.com/rails/rails
```

## Output

The tool provides a clean, boxed output with real-time progress:

```
╭────────────────────────────────────────────────╮
│                                                │
│  rails/rails                                   │
│  github.com                                    │
│                                                │
╰────────────────────────────────────────────────╯

  ⠋ Receiving 67%  12.4 MiB

╭────────────────────────────────────────────────╮
│                                                │
│  ✔ Cloned successfully                         │
│                                                │
│  → /tmp/tmp-git-clone/rails/rails              │
│                                                │
╰────────────────────────────────────────────────╯
```

## Claude Code Integration

This tool pairs well with [Claude Code](https://claude.ai/claude-code). A slash command example is included to clone repos and automatically explore them.

### Installing the Slash Command

Copy the included command to your Claude commands directory:

```bash
cp clone-git-repo.md ~/.claude/commands/
```

### Auto-Approve Permissions (Optional)

To skip permission prompts, add this to your `~/.claude/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "Bash(tmp-git-clone:*)",
      "Glob(/tmp/tmp-git-clone/**)",
      "Read(/tmp/tmp-git-clone/**)"
    ]
  }
}
```

This allows Claude to clone repos, search files, and read files without prompting.

### Using the Slash Command

Once installed, use it in Claude Code:

```
/clone-git-repo https://github.com/rails/rails
```

This will:
1. Clone the repository
2. Read the README
3. Show the directory structure
4. Provide a summary of the project

## Options

| Option | Description |
|--------|-------------|
| `-d, --depth <n>` | Clone depth (default: 1) |
| `-q, --quiet` | Suppress output, print only the cloned path |
| `-V, --version` | Show version number |
| `-h, --help` | Show help |

## Why `/tmp`?

- Fast SSD-backed storage on most systems
- Auto-cleaned on reboot
- Keeps your workspace uncluttered
- Perfect for quick code exploration

## Requirements

- Node.js 18+
- Git

## License

MIT
