# Clone and Explore Repository

Clone a git repository and provide an overview of the codebase.

## Instructions

When the user provides a GitHub repository (URL or owner/repo format):

1. Run `tmp-git-clone -q <repo>` in the terminal to clone. This outputs the cloned path.
2. Read the README.md file at the cloned path
3. Explore the directory structure
4. Provide a concise summary including:
   - What the project is/does (from README)
   - Tech stack (languages, frameworks)
   - Key directories and their purpose
   - How to get started (if mentioned)

## Example

User: "Clone and explore rails/rails"

1. Run: `tmp-git-clone -q rails/rails`
2. Output: `/tmp/tmp-git-clone/rails/rails`
3. Read `/tmp/tmp-git-clone/rails/rails/README.md`
4. Summarize the project

Keep summaries focused and scannable.
