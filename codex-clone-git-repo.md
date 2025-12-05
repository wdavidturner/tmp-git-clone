# Clone and Explore Repository

Clone a git repository and provide an overview of the codebase.

## Arguments
- $ARGUMENTS: The git URL or owner/repo shorthand (e.g., rails/rails)

## Instructions

1. Run the shell command `tmp-git-clone -q $ARGUMENTS` to clone the repository. This outputs the cloned path.
2. Read the README file at the cloned path
3. List the directory structure to understand the project layout
4. Provide a concise summary including:
   - What the project is/does (from README)
   - Tech stack (languages, frameworks)
   - Key directories and their purpose
   - How to get started (if mentioned)

Keep the summary focused and scannable. The user can ask follow-up questions to dive deeper.
