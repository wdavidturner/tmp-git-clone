# Clone and Explore Repository

Clone a git repository and provide an overview of the codebase.

## Arguments
- $ARGUMENTS: The git URL to clone (e.g., https://github.com/rails/rails)

## Instructions

1. Run `tmp-git-clone -q $ARGUMENTS` to clone the repository (quiet mode returns just the path)
2. Read the README file using the **Read** tool (DO NOT use cat or bash)
3. Find files using the **Glob** tool with patterns like `*` or `**/*.ts` (DO NOT use ls, tree, or find)
4. Provide a concise summary including:
   - What the project is/does (from README)
   - Tech stack (languages, frameworks)
   - Key directories and their purpose
   - How to get started (if mentioned)

**IMPORTANT**: Only use Read and Glob tools for file exploration. Do not use bash commands like ls, tree, cat, or find.

Keep the summary focused and scannable. The user can ask follow-up questions to dive deeper.
