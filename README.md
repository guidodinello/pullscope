# Pullscope

> Automatically apply custom filters to GitHub Pull Request pages with real-time sync across all tabs.

<p align="center">
  <img src="public/icons/pullscope-icon.svg" alt="Pullscope Logo" width="128" height="128">
</p>

## 🎯 Overview

Pullscope is a browser extension that streamlines your GitHub PR workflow by automatically applying custom search filters when you visit Pull Request pages. No more manually typing the same filters over and over!

### Key Features

✨ **Automatic Filter Application** - Filters apply instantly when you visit any GitHub PR page
🔄 **Real-Time Sync** - Toggle filters on/off and see results update immediately across all open tabs
✅ **Smart Validation** - Validates GitHub search syntax before saving filters
🎨 **Clean UI** - Simple popup and options page for managing filters
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
# For Chrome/Chromium
pnpm build

# For Firefox
pnpm build:firefox
```

4. Load the extension:

**Chrome/Chromium:**

- Open `chrome://extensions/`
- Enable "Developer mode"
- Click "Load unpacked"
- Select the `.output/chrome-mv3` directory

**Firefox:**

- Open `about:debugging#/runtime/this-firefox`
- Click "Load Temporary Add-on"
- Select the `manifest.json` file from `.output/firefox-mv2`

### Development Mode

```bash
# Chrome with hot reload
pnpm dev

# Firefox with hot reload
pnpm dev:firefox
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

### Managing Filters

**From Popup:**

- Click extension icon to open popup
- Toggle filters on/off with the switch
- Click "Manage Filters" for full management

**From Options Page:**

- Right-click extension icon → "Options"
- Add, edit, or delete filters
- Enable/disable filters
- Changes sync instantly to all open GitHub PR tabs

### Real-Time Sync

When you enable or disable a filter:

- ✅ All open GitHub PR tabs update **immediately**
- ✅ Filters are added/removed from the search input
- ✅ Search executes automatically
- ✅ Toast notification confirms the action

## 🏗️ Architecture

### Technology Stack

- **[WXT](https://wxt.dev/)** - Cross-browser extension framework
- **[Svelte 5](https://svelte.dev/)** - Reactive UI framework with runes API
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first styling
- **[Vite](https://vitejs.dev/)** - Fast build tool

### Project Structure

```
pullscope/
├── src/
│   ├── entrypoints/          # Extension entry points
│   │   ├── background.ts     # Background service worker
│   │   ├── content.ts        # Content script loader
│   │   ├── content/
│   │   │   └── GithubPRFilter.svelte  # Main content script
│   │   ├── popup/
│   │   │   ├── popup.ts      # Popup entry
│   │   │   └── Popup.svelte  # Popup UI
│   │   └── options/
│   │       ├── options.ts    # Options page entry
│   │       └── Options.svelte # Options UI
│   ├── lib/
│   │   ├── types/            # TypeScript types
│   │   │   └── filter.ts
│   │   ├── stores/           # Svelte stores
│   │   │   └── filters.ts    # Filter state management
│   │   ├── utils/            # Utility functions
│   │   │   ├── logger.ts     # Logging framework
│   │   │   ├── dom.ts        # DOM utilities
│   │   │   └── validation.ts # Filter validation
│   │   ├── components/       # Shared UI components
│   │   │   ├── ErrorDisplay.svelte
│   │   │   ├── Toast.svelte
│   │   │   └── FilterEditor.svelte
│   │   ├── github.ts         # GitHub integration
│   │   └── storage.ts        # Storage API wrapper
│   └── assets/               # Icons and images
├── wxt.config.ts             # WXT configuration
├── tailwind.config.ts        # Tailwind configuration
└── tsconfig.json             # TypeScript configuration
```

### Key Components

**Filter Store** (`src/lib/stores/filters.ts`)

- Centralized state management
- Automatic sync with browser storage
- Real-time updates across components
- Storage change listener for cross-tab sync

**GitHub Integration** (`src/lib/github.ts`)

- Multiple fallback selectors for robustness
- Token-based duplicate detection
- Form submission triggering
- Proper event dispatching

**Content Script** (`src/entrypoints/content/GithubPRFilter.svelte`)

- Waits for DOM elements properly
- Debounced URL change handler
- Real-time filter toggle listener
- Toast notifications

## 🛠️ Development

### Available Scripts

```bash
# Development with hot reload
pnpm dev              # Chrome
pnpm dev:firefox      # Firefox

# Production build
pnpm build            # Chrome
pnpm build:firefox    # Firefox

# Create distribution zip
pnpm zip              # Chrome
pnpm zip:firefox      # Firefox

# Type checking
pnpm check

# Clean build artifacts
pnpm clean
```

### Code Quality

- ✅ Full TypeScript coverage
- ✅ Professional logging framework
- ✅ Comprehensive validation
- ✅ ARIA labels for accessibility
- ✅ Zero console.log in production
- ✅ Proper error handling

### Architecture Highlights

- **State Management**: Centralized Svelte store with automatic sync
- **Type Safety**: Full TypeScript with strict mode
- **Error Handling**: Consistent error boundaries and user feedback
- **Performance**: Debounced handlers, efficient observers
- **Accessibility**: ARIA labels, keyboard navigation, focus management

See [ARCHITECTURAL_IMPROVEMENTS.md](ARCHITECTURAL_IMPROVEMENTS.md) for detailed architecture documentation.

## 🐛 Bug Fixes

All known bugs have been fixed! See [BUGFIXES.md](BUGFIXES.md) for the complete list of fixes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

1. Fork the repository
2. Clone your fork
3. Install dependencies: `pnpm install`
4. Create a branch: `git checkout -b feature/your-feature`
5. Make your changes
6. Test thoroughly in both Chrome and Firefox
7. Commit: `git commit -m "Add your feature"`
8. Push: `git push origin feature/your-feature`
9. Create a Pull Request

### Guidelines

- Follow the existing code style
- Add TypeScript types for all new code
- Use the logger instead of console.log
- Add ARIA labels for accessibility
- Test in both Chrome and Firefox
- Update documentation as needed

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

## 👤 Author

**Guido Dinello**

- GitHub: [@guidodinello](https://github.com/guidodinello)
- Extension ID: `pullscope@guidodinello.dev`

## 🙏 Acknowledgments

- Built with [WXT](https://wxt.dev/) by [@aklinker1](https://github.com/aklinker1)
- Inspired by the need for better GitHub PR filtering
- Thanks to the Svelte and Tailwind CSS teams

## 📚 Resources

- [GitHub Search Syntax](https://docs.github.com/en/search-github/searching-on-github/searching-issues-and-pull-requests)
- [WXT Documentation](https://wxt.dev/)
- [Svelte 5 Documentation](https://svelte.dev/)

## 🔗 Links

- [Report Issues](https://github.com/guidodinello/pullscope/issues)
- [Request Features](https://github.com/guidodinello/pullscope/issues/new)

---

Made with ❤️ for developers who spend too much time manually filtering GitHub PRs
