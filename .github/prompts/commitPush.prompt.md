---
mode: agent
model: Claude Sonnet 4.5 (copilot)
tools: ["github/github-mcp-server/*"]
description: "Commit and push code changes based on the provided prompt and recent edits."

---
1. Create a markdown file under [features](../../docs/features/) folder that includes: 
- The last prompt text used to generate the code changes.
- A summary description of the changes made to the codebase, including new files created, modifications to existing files, and key functions or methods implemented.
- Any considerations for future maintenance or enhancements.
- Name the file based on the prompt topic, e.g., adoption-eligibility-implementation.md

2. #github/github-mcp-server/push_files to the remote of the current branch with a commit message that summarizes the changes made, e.g., "Implement adoption eligibility based on visit count".