# GitHub Markdown Formatter

A Firefox extension that adds Format and Format with AI buttons to GitHub comment and PR description boxes, converting raw developer notes into clean GitHub-flavored Markdown.

## Features

- Converts action verb lines into bullet points
- Wraps code identifiers, snake_case, and CamelCase in backticks
- Converts issue references — `fixes 123` becomes `Fixes #123`
- Capitalizes sentences
- Optional AI enhancement via Groq for grammar and clarity improvements
- Works on PR descriptions, issue descriptions, review comments, and all GitHub textareas

## Installation

1. Clone the repository

```bash
git clone https://github.com/taniy8/github-markdown-extension.git
```

2. Open Firefox and go to `about:debugging`
3. Click **This Firefox**, then **Load Temporary Add-on**
4. Select `manifest.json` from the cloned folder

The extension is active immediately. It will be removed when Firefox restarts.

## Usage

1. Go to any GitHub PR, issue, or comment page
2. Click inside a description or comment box
3. Two buttons appear above the textarea — **Format** and **Format with AI**
4. Click **Format** for instant rule-based formatting
5. Click **Format with AI** to additionally improve grammar and clarity

## Permissions

- `activeTab` reads and modifies textarea content on the active tab
- `https://github.com/*` injects buttons into GitHub pages
- `https://github-markdown-formatter.vercel.app/*` calls the AI enhancement API

## Contributing

1. Fork the repository
2. Create a branch for your change
3. Commit with a descriptive message
4. Open a pull request

## License

MIT 
