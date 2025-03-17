.PHONY: help build start dev generate-example-pdf generate-gcp-pdf

# Variables
EXAMPLE_FILE = ./examples/example-report.md
OUTPUT_DIR = ./public/exports
OUTPUT_FILE = $(OUTPUT_DIR)/example-report.pdf
GCP_BUCKET_NAME ?= astrall-reports
GCP_DOC_TYPE ?= report
GCP_AREA ?= general
GCP_NAME ?= "gabriel_bermúdez"
GCP_FORMAT ?= "full"
GCP_INPUT_PATH ?= reports/$(GCP_DOC_TYPE)/$(GCP_AREA)/$(GCP_NAME)_$(GCP_FORMAT).txt
GCP_OUTPUT_PATH ?= pdf/$(GCP_DOC_TYPE)/$(GCP_AREA)/$(GCP_NAME)_$(GCP_FORMAT).pdf

help:
	@echo "Available commands:"
	@echo "  make build               - Build the Next.js application"
	@echo "  make start               - Start the Next.js application"
	@echo "  make dev                 - Start the Next.js application in development mode"
	@echo "  make generate-example-pdf - Generate an example PDF from local markdown file"
	@echo "  make generate-gcp-pdf    - Generate a PDF from a file stored in GCP"
	@echo "                             Usage: make generate-gcp-pdf GCP_BUCKET_NAME=bucket GCP_DOC_TYPE=type"
	@echo "                                   GCP_AREA=area GCP_NAME=name GCP_FORMAT=format"

build:
	yarn build

start:
	yarn start

dev:
	yarn dev

# Create example directory and file if they don't exist
$(EXAMPLE_FILE):
	mkdir -p ./examples
	@echo "# Sample Astrological Report\n\n## Introduction\nThis is a sample report generated from markdown.\n\n## Astrological Analysis\n\nYour Sun is in Pisces, which gives you a sensitive and intuitive nature.\n\n> \"The stars incline, but do not compel.\"\n\n## Recommendations\n\n1. Practice mindfulness meditation\n2. Explore creative pursuits\n3. Connect with water elements regularly" > $(EXAMPLE_FILE)

# Create output directory if it doesn't exist
$(OUTPUT_DIR):
	mkdir -p $(OUTPUT_DIR)

generate-example-pdf: $(EXAMPLE_FILE) $(OUTPUT_DIR)
	@echo "Generating example PDF..."
	yarn generate-pdf \
		"$(EXAMPLE_FILE)" \
		"Sample Astrological Report" \
		"Jane Smith" \
		"1990-05-15" \
		"New York, USA" \
		"08:30" \
		"$(OUTPUT_FILE)"
	@echo "Example PDF generated at $(OUTPUT_FILE)"

generate-gcp-pdf:
	@echo "Generating PDF from GCP file..."
	@echo "Source: $(GCP_BUCKET_NAME):$(GCP_INPUT_PATH)"
	@echo "Output: $(GCP_BUCKET_NAME):$(GCP_OUTPUT_PATH)"
	yarn generate-pdf \
		"$(GCP_BUCKET_NAME):$(GCP_INPUT_PATH)" \
		"Astrological Report" \
		"Jane Smith" \
		"1990-05-15" \
		"New York, USA" \
		"08:30" \
		"$(OUTPUT_DIR)/gcp-report.pdf" \
		"$(GCP_BUCKET_NAME):$(GCP_OUTPUT_PATH)"
