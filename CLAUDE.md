# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js application that renders markdown content as styled PDFs using @react-pdf/renderer. The system supports theming, Google Cloud Storage integration, and custom markdown components for specialized rendering (particularly astrology-themed documents).

## Development Commands

### Local Development
```bash
# Start development server on port 3001
yarn dev
# or
make dev

# Build for production
yarn build
# or
make build

# Start production server
yarn start
# or
make start

# Lint
yarn lint
```

### Docker Deployment
```bash
# Build and push to Google Artifact Registry
make deploy

# Clean up Docker images
make clean
```

**Important**: Configure Google Artifact Registry variables in Makefile before deployment:
- `GAR_LOCATION` (default: us-central1)
- `GAR_PROJECT_ID` (default: bold-vortex-332122)
- `GAR_REPOSITORY` (default: astrall)
- `IMAGE_NAME` (default: pdf-renderer)

## Architecture

### PDF Generation Flow

1. **Entry Points**:
   - API Route: `/api/export-pdf` - Generates and saves PDF files
   - API Route: `/api/preview-pdf` - Returns base64-encoded PDF for preview
   - Frontend: `/pdf-preview` page for live preview

2. **Core Components**:
   - `MarkdownReportPDF` (src/components/PDFDocument/MarkdownReportPDF.tsx) - Main PDF document component that orchestrates rendering
   - Uses react-markdown to parse markdown with remark-gfm for GitHub-flavored markdown support

3. **Theming System**:
   - **Style Definitions**: `src/styles/pdfThemes.js` defines base styles for typography, spacing, and colors
   - **Theme Components**: `src/components/PDFDocument/themes/themeComponents.tsx` defines visual rendering for each theme
   - **Component Factory**: `src/components/PDFDocument/factory/componentsFactory.tsx` merges base components with theme overrides
   - Available themes: `default`, `astrology`, `professional`, `dark`
   - The astrology theme includes custom decorative SVG components (stars, moons, lines)

4. **Custom Markdown Components**:
   The system extends standard markdown with custom components identified by validators:
   - **strongTitle**: Bold text (e.g., `**Title**`) rendered with decorative elements in themed styles
   - **tagList**: Formatted as `title: tag1 - tag2 - tag3` or just `tag1 - tag2 - tag3`
   - Validators located in `src/components/PDFDocument/helpers/validators/`
   - `renderHelper.tsx` processes AST nodes to identify and render custom components

5. **Google Cloud Storage Integration**:
   - `GcpStorageService` (src/services/gcp-storage.ts) handles reading markdown from GCS and uploading generated PDFs
   - Authentication uses Google Cloud Storage SDK with default credentials

### Font System

The project uses Montserrat font family (weights 100-900) loaded from local TTF files in `/fonts/ttf/`. Fonts are registered in `src/styles/pdfThemes.js` using @react-pdf/renderer's Font.register API.

### API Request Format

The `/api/export-pdf` endpoint accepts:
```typescript
{
  // Content source (one required):
  sourceFilePath?: string,  // Local file path
  gcpFile?: { bucketName: string, filePath: string },

  // Output configuration:
  outputPath?: string,  // Custom output path (optional)
  outputStorageFilePath?: { bucketName: string, filePath: string },  // Upload to GCS

  // PDF metadata:
  theme?: 'default' | 'astrology' | 'professional' | 'dark',
  documentName?: string,
  userName?: string,
  birthDate?: string,
  birthTime?: string,
  location?: string
}
```

### Important Technical Details

1. **TypeScript Strictness**: The codebase uses `// @ts-nocheck` and `@ts-ignore` in some PDF components due to react-pdf/renderer type compatibility issues. This is expected.

2. **Cover Page**: The first page is a custom cover page with document metadata, followed by paginated content starting from page 2.

3. **Page Numbering**: Pages display `pageNumber - 2` to account for the cover page (see MarkdownReportPDF.tsx:91-96).

4. **Custom Component Detection**: The rendering system scans markdown AST for patterns matching custom components (validators return true/false for each child node).

5. **Wrapping & Orphan Control**: The system uses `minPresenceAhead`, `wrap={false}`, and `orphans` props to control page breaks and prevent awkward splits.

## Project Structure Highlights

- **API Routes**: Standard Next.js API routes in `src/pages/api/`
- **PDF Components**: All PDF-related code in `src/components/PDFDocument/`
  - `core/` - Base components
  - `themes/` - Theme-specific component overrides
  - `factory/` - Component composition logic
  - `helpers/` - Rendering utilities and validators
  - `assets/` - SVG decorative elements
- **Services**: `src/services/gcp-storage.ts` for GCP integration
- **CLI Scripts**: `src/cli/` (currently minimal/placeholder)

## Common Modifications

### Adding a New Theme
1. Define styles in `src/styles/pdfThemes.js`
2. Create theme function in `src/components/PDFDocument/themes/themeComponents.tsx`
3. Register in `themeRegistry` object
4. Export via `getAvailableThemes()`

### Adding a Custom Markdown Component
1. Create validator in `src/components/PDFDocument/helpers/validators/`
2. Register in `componentValidators` object (validators/index.ts)
3. Implement rendering in theme component overrides
4. The component will be detected and rendered via `renderTextWithStyles` in `renderHelper.tsx`

### Modifying Cover Page
Edit `MarkdownReportPDF.tsx` lines 58-89 (first Page component).
