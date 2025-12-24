# Floating Note

An Obsidian plugin that creates floating, always-on-top note windows perfect for quick notes, reference material, or keeping important information visible while you work.

## Features

-   **Always on Top**: Floating windows stay above other applications
-   **Quick Access**: Create new floating notes or float your current note
-   **Customizable Appearance**: Adjust window opacity to suit your workflow
-   **Clean Interface**: Streamlined UI with hidden tab headers and draggable window area
-   **Flexible Organization**: Configure default folder location and filename format

## Usage

### Commands

The plugin provides two commands accessible via the command palette (Cmd/Ctrl + P):

1. **Open new tab in floating window**: Creates a new note in a floating window
2. **Open current tab in floating window**: Opens the currently active note in a floating window

### Window Behavior

-   Floating windows are sized at 350x700 pixels for optimal side-by-side viewing
-   Windows stay on top of all other applications
-   Drag the header area to reposition the window
-   Each floating window is an independent Obsidian window

## Settings

Configure the plugin behavior in Settings → Floating Note:

### Title Format

Customize the filename format for new floating notes using moment.js format strings.

-   **Default**: `YYYY-MM-DD HH:mm:ss`
-   **Example**: Notes created on December 24, 2025 at 2:30 PM would be named `2025-12-24 14:30:00.md`

### Folder Path

Choose where new floating notes are saved.

-   **Default**: Vault root
-   **Options**: Any existing folder in your vault

### Window Opacity

Adjust the transparency of floating windows.

-   **Range**: 0.1 (very transparent) to 1.0 (fully opaque)
-   **Default**: 0.95

## Use Cases

-   **Quick Capture**: Jot down ideas without switching away from your current work
-   **Reference Material**: Keep documentation or notes visible while coding or writing
-   **Task Lists**: Maintain a visible todo list alongside your main workspace
-   **Meeting Notes**: Take notes in a floating window during video calls
-   **Code Snippets**: Keep frequently used snippets accessible

## Installation

### From Obsidian Community Plugins

1. Open Settings → Community Plugins
2. Disable Safe Mode
3. Browse and search for "Floating Note"
4. Install and enable the plugin

### Manual Installation

1. Download the latest release files: `main.js`, `manifest.json`, and `styles.css`
2. Create a folder named `floating-note` in your vault's `.obsidian/plugins/` directory
3. Copy the downloaded files into the folder
4. Reload Obsidian
5. Enable the plugin in Settings → Community Plugins

## Development

### Prerequisites

-   Node.js v22 or higher
-   npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/obsidian-floating-note.git

# Install dependencies
npm install

# Start development with hot reload
npm run dev
```

### Build

```bash
# Build for production
npm run build
```

### Testing

1. Copy `main.js`, `manifest.json`, and `styles.css` to your test vault's plugins folder
2. Reload Obsidian to see your changes

## Technical Details

-   **Desktop Only**: This plugin requires Electron features and is not available on mobile
-   **Electron Integration**: Uses `@electron/remote` for window manipulation
-   **Window Properties**:
    -   Always on top with `screen-saver` level
    -   Draggable header area using `-webkit-app-region`
    -   Persistent styles injected via JavaScript

## Compatibility

-   **Minimum Obsidian Version**: 0.15.0
-   **Platform**: Desktop only (Windows, macOS, Linux)

## Support

-   **Author**: LimTaehyun
-   **Website**: [limtaehyun.dev](https://limtaehyun.dev)
