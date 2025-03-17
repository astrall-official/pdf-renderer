# PDF Renderer

A tool for generating PDF documents from markdown content.

## Features

- API endpoint for PDF generation
- Command-line interface for batch processing
- Support for files stored in GCP buckets or local filesystem
- Customizable themes for PDF output

## Usage

### API Endpoint

Make a POST request to `/api/export-pdf` with the following payload:

```json
{
  "gcpFile": {
    "bucketName": "your-bucket-name",
    "filePath": "path/to/your/file.md"
  }
}
```

Or with direct document data:

```json
{
  "documentData": {
    "title": "Document Title",
    "content": "# Your Markdown Content",
    "author": "Author Name"
  }
}
```

### Command Line Interface

Generate PDFs directly from the command line:

```bash
yarn generate-pdf <source> <documentName> <userName> <birthDate> <location> <birthTime> [outputPath]
```

#### Parameters:

- `source`: Path to source file. Can be either:
  - A local file path (e.g., "./content/report.md")
  - A GCP bucket and file path separated by ":" (e.g., "my-bucket:reports/report.md")
- `documentName`: Name of the report document (e.g., "Interpretación Astrológica")
- `userName`: Name of the person (e.g., "Jane Doe")
- `birthDate`: Birth date in YYYY-MM-DD format (e.g., "1985-03-04")
- `location`: Birth location (e.g., "Santiago, Chile")
- `birthTime`: Birth time (e.g., "14:40")
- `outputPath` (optional): Path where the PDF will be saved (default: public/exports/username-timestamp.pdf)

#### Examples:

Using a local file:
```bash
yarn generate-pdf ./content/report.md "Astrological Report" "John Smith" "1990-05-15" "New York, USA" "08:30" ./output/john-report.pdf
```

Using a file in GCP:
```bash
yarn generate-pdf my-bucket:reports/john.md "Astrological Report" "John Smith" "1990-05-15" "New York, USA" "08:30" ./output/john-report.pdf
```

### Using the Makefile

This project includes a Makefile with helpful commands:

```bash
# Build the Next.js application
make build

# Start the Next.js application
make start

# Start the Next.js application in development mode
make dev

# Generate an example PDF from the included example file
make generate-example-pdf
```

The `generate-example-pdf` command will create a sample markdown file (if it doesn't exist) and generate a PDF from it.

## Development

```bash
# Start the development server
yarn dev

# Build for production
yarn build

# Start the production server
yarn start
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3001/api/hello](http://localhost:3001/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
