# Pullscope

> Automatically apply custom filters to GitHub Pull Request pages with real-time sync across all tabs.

<p align="center">
  <img src="src/public/icons/pullscope-icon.svg" alt="Pullscope Logo" width="128" height="128">
</p>

## 🎯 Overview

Pullscope is a browser extension that streamlines your GitHub PR workflow by automatically applying custom search filters when you visit Pull Request pages.

### Key Features

✨ **Automatic Filter Application** - Filters apply instantly when you visit any GitHub PR page

🔄 **Real-Time Sync** - Toggle filters on/off and see results update immediately across all open tabs

🚀 **Cross-Browser** - Works on Chrome, Firefox, and other Chromium-based browsers

⚡ **Fast & Lightweight** - Built with modern web technologies for optimal performance

## 📦 Installation

### From Source

1. Clone the repository:

```bash
git clone https://github.com/guidodinello/pullscope.git
cd pullscope
```

2. Install dependencies:

```bash
pnpm install
```

3. Build the extension:

```bash
pnpm build # For Chrome/Chromium

pnpm build:firefox # For Firefox
```

4. Load the extension:

**Chrome/Chromium:**

-   Open `chrome://extensions/`
-   Enable "Developer mode"
-   Click "Load unpacked"
-   Select the `.output/chrome-mv3` directory

**Firefox:**

-   Open `about:debugging#/runtime/this-firefox`
-   Click "Load Temporary Add-on"
-   Select the `manifest.json` file from `.output/firefox-mv2`

### Development Mode

```bash
pnpm dev # Chrome with hot reload

pnpm dev:firefox # Firefox with hot reload
```

## 🚀 Usage

### Quick Start

1. **Install the extension** using the instructions above
2. **Visit any GitHub PR page** (e.g., `https://github.com/facebook/react/pulls`)
3. **Click the extension icon** to open the popup
4. **Click "Manage Filters"** to add your first filter
5. **Create a filter** with a name and GitHub search syntax:
    - Name: `Hide Dependabot PRs`
    - Value: `-author:app/dependabot`
6. **Save** and refresh the PR page - filter applies automatically!

### Filter Examples

```
# Hide Dependabot PRs
-author:app/dependabot

# Only show open PRs
is:open

# PRs assigned to you
assignee:@me

# PRs with specific label
label:"bug"

# Combine multiple filters
is:open -author:app/dependabot label:"priority"
```

See [GitHub's search syntax documentation](https://docs.github.com/en/search-github/searching-on-github/searching-issues-and-pull-requests) for all available qualifiers.

## 🏗️ Technology Stack

-   **[WXT](https://wxt.dev/)** - Cross-browser extension framework
-   **[Svelte 5](https://svelte.dev/)** - Reactive UI framework with runes API
-   **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
-   **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first styling
-   **[Vite](https://vitejs.dev/)** - Fast build tool

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

1. Fork the repository
2. Clone your fork
3. Install dependencies: `pnpm install`
4. Create a branch: `git checkout -b feature/your-feature`
5. Make your changes
6. Test in both Chrome and Firefox
7. Commit: `git commit -m "Add your feature"`
8. Push: `git push origin feature/your-feature`
9. Create a Pull Request

### Guidelines

-   Follow the existing code style
-   Use technology standards
-   Update documentation as needed

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

## 👤 Author

**Guido Dinello**

-   GitHub: [@guidodinello](https://github.com/guidodinello)
-   Extension ID: `pullscope@guidodinello.dev`

## 🙏 Acknowledgments

-   Built with [WXT](https://wxt.dev/)
-   Template used [oneezy/svelte-5-extension](https://github.com/oneezy/svelte-5-extension)
