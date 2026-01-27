# Smart Read AI

A modern Chrome extension built with TypeScript, React, and Vite.

## Features

- 🚀 **Fast Development**: Powered by Vite for instant HMR
- 📦 **TypeScript**: Full type safety with TypeScript
- ⚛️ **React**: Modern React 18 with hooks
- 🎨 **Beautiful UI**: Gradient design with smooth animations
- 🔧 **Manifest V3**: Uses the latest Chrome Extension API
- 🤖 **CI/CD**: Automated testing and deployment with GitHub Actions

## Project Structure

```
src/
├── background/     # Background service worker
├── content/        # Content scripts injected into web pages
├── popup/          # Extension popup UI (React)
├── options/        # Options/settings page (React)
├── icons/          # Extension icons
└── manifest.json   # Extension manifest (V3)
```

## Development

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Setup

1. Clone the repository:

```bash
git clone <your-repo-url>
cd smart-read-ai
```

2. Install dependencies:

```bash
pnpm install
```

3. Start development server:

```bash
pnpm dev
```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

### Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm type-check` - Run TypeScript type checking

## Building for Production

```bash
pnpm build
```

This will create an optimized build in the `dist` folder. You can then:

1. Zip the `dist` folder
2. Upload to Chrome Web Store

## CI/CD

This project uses GitHub Actions for automated CI/CD:

- **CI Pipeline**: Runs on every push and PR
  - Installs dependencies
  - Runs linting and type checking
  - Builds the extension

- **Release Pipeline**: Triggered by version tags (e.g., `v1.0.0`)
  - Builds production version
  - Creates zip package
  - Uploads to Chrome Web Store (requires setup)
  - Creates GitHub Release

### Setting up Chrome Web Store Auto-Publish

To enable automatic publishing to Chrome Web Store, you need to:

1. **Get Chrome Web Store API Credentials**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Chrome Web Store API
   - Create OAuth 2.0 credentials
   - Get your `CLIENT_ID` and `CLIENT_SECRET`

2. **Get Refresh Token**:
   - Use [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
   - Configure with your credentials
   - Authorize Chrome Web Store API
   - Exchange authorization code for refresh token

3. **Get Extension ID**:
   - Upload your extension to Chrome Web Store (first time manually)
   - Find your extension ID in the Developer Dashboard

4. **Add GitHub Secrets**:
   Go to your repository Settings → Secrets and add:
   - `CHROME_CLIENT_ID`
   - `CHROME_CLIENT_SECRET`
   - `CHROME_REFRESH_TOKEN`
   - `CHROME_EXTENSION_ID`

5. **Create a Release**:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite 5
- **Package Manager**: pnpm
- **Code Quality**: ESLint, Prettier, Husky
- **CI/CD**: GitHub Actions
- **Chrome API**: Manifest V3

## Architecture

### Message Passing

The extension uses Chrome's message passing API for communication:

```
Popup ←→ Background Worker ←→ Content Script
```

- **Popup**: User interface, sends messages to background/content
- **Background**: Service worker, handles extension logic
- **Content Script**: Runs in web pages, can manipulate DOM

### Storage

Uses `chrome.storage.local` for persistent data storage across sessions.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
