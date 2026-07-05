# GitHub Markdown Formatter — Extension

Adds two buttons to every GitHub textarea: one that formats raw developer notes into clean Markdown using a rule-based pipeline, and one that runs the result through an AI model for grammar and clarity.

## How it works

The extension injects a Format button and a Format with AI button above any comment or description box on GitHub. Click Format and your raw notes are processed locally — no network request, no delay. Click Format with AI and the formatted output is sent to a Groq-hosted Llama model for an additional grammar pass.

The formatting pipeline runs in order. Issue references like `fixes 123` become `Fixes #123`. Code identifiers including `snake_case`, `CamelCase`, and `function()` calls are wrapped in backticks. Lines starting with action verbs become bullet points. The first letter of each line is capitalized.

## Installation

Clone the repo and load it as a temporary add-on in Firefox.

```bash
git clone https://github.com/taniy8/github-markdown-extension.git
```

Open `about:debugging` → This Firefox → Load Temporary Add-on → select `manifest.json`.

The extension is active immediately. It unloads when Firefox restarts.

## Permissions

`activeTab` is needed to read and update textarea content on the current tab. `https://github.com/*` is needed to inject buttons into GitHub pages. `https://github-markdown-formatter.vercel.app/*` is needed to reach the AI enhancement endpoint.

## Related

Web app — https://github-markdown-formatter.vercel.app

## License

MIT © [taniy8](https://github.com/taniy8)
