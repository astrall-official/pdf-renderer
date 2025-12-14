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

# Google Artifact Registry Configuration - PLEASE FILL THESE IN!
GAR_LOCATION   ?= us-central1
GAR_PROJECT_ID ?= bold-vortex-332122
GAR_REPOSITORY ?= astrall
IMAGE_NAME     ?= pdf-renderer
IMAGE_TAG      ?= latest

# Full image path in GAR
GAR_IMAGE_PATH = $(GAR_LOCATION)-docker.pkg.dev/$(GAR_PROJECT_ID)/$(GAR_REPOSITORY)/$(IMAGE_NAME)

help:
	@echo "Available commands:"
	@echo "  make build                   - Build the Next.js application (yarn build)"
	@echo "  make start                   - Start the Next.js application (yarn start)"
	@echo "  make dev                     - Start the Next.js application in development mode (yarn dev)"
	@echo "  make generate-example-pdf    - Generate an example PDF from local markdown file"
	@echo "  make generate-gcp-pdf        - Generate a PDF from a file stored in GCP"
	@echo "                                 Usage: make generate-gcp-pdf GCP_BUCKET_NAME=bucket GCP_DOC_TYPE=type ..."
	@echo "  make tag                     - Tag the locally built Docker image for GAR (for manual push)."
	@echo "  make push                    - Push the locally built and tagged Docker image to GAR."
	@echo "  make deploy                  - Build and push a image to GAR."
	@echo "  make clean                   - Remove locally built Docker images."
	@echo ""
	@echo "Configuration (can be overridden with environment variables or by editing this file):"
	@echo "  GAR_LOCATION   : $(GAR_LOCATION)"
	@echo "  GAR_PROJECT_ID : $(GAR_PROJECT_ID)"
	@echo "  GAR_REPOSITORY : $(GAR_REPOSITORY)"
	@echo "  IMAGE_NAME     : $(IMAGE_NAME)"
	@echo "  IMAGE_TAG      : $(IMAGE_TAG)"
	@echo "Output: $(GCP_BUCKET_NAME):$(GCP_OUTPUT_PATH)"

build:
	yarn build

start:
	yarn start

dev:
	yarn dev


# Tag the Docker image for Google Artifact Registry
tag:
	@echo "Tagging image $(IMAGE_NAME):$(IMAGE_TAG) as $(GAR_IMAGE_PATH):$(IMAGE_TAG)"
	docker tag $(IMAGE_NAME):$(IMAGE_TAG) $(GAR_IMAGE_PATH):$(IMAGE_TAG)
	@echo "Successfully tagged image for GAR."

# Push the Docker image to Google Artifact Registry
# This assumes you have already configured gcloud and Docker authentication for GAR.
# Run: gcloud auth configure-docker $(GAR_LOCATION)-docker.pkg.dev
push: tag
	@echo "Pushing image $(GAR_IMAGE_PATH):$(IMAGE_TAG) to Google Artifact Registry..."
	@if [ "$(GAR_LOCATION)" = "your-gar-location" ] || \
	   [ "$(GAR_PROJECT_ID)" = "your-gcp-project-id" ] || \
	   [ "$(GAR_REPOSITORY)" = "your-gar-repository-name" ] || \
	   [ "$(IMAGE_NAME)" = "your-image-name" ]; then \
	    echo "ERROR: Please fill in GAR_LOCATION, GAR_PROJECT_ID, GAR_REPOSITORY, and IMAGE_NAME in the Makefile."; \
	    exit 1; \
	fi
	docker push $(GAR_IMAGE_PATH):$(IMAGE_TAG)
	@echo "Successfully pushed $(GAR_IMAGE_PATH):$(IMAGE_TAG) to GAR."

# Build and push a (amd64, arm64) image to Google Artifact Registry
docker-build:
	@echo "Building and pushing image to GAR..."
	@echo "Target image: $(GAR_IMAGE_PATH) with tags: $(IMAGE_TAG), latest"
	@if [ "$(GAR_LOCATION)" = "your-gar-location" ] || \
	   [ "$(GAR_PROJECT_ID)" = "your-gcp-project-id" ] || \
	   [ "$(GAR_REPOSITORY)" = "your-gar-repository-name" ] || \
	   [ "$(IMAGE_NAME)" = "pdf-renderer" ] && [ "$(IMAGE_NAME)" = "your-image-name" ]; then \
	    echo "ERROR: Please ensure GAR_LOCATION, GAR_PROJECT_ID, GAR_REPOSITORY are correctly set in the Makefile."; \
	    echo "       And IMAGE_NAME is set if it was 'your-image-name'. Current IMAGE_NAME: $(IMAGE_NAME)"; \
	    exit 1; \
	fi
	docker pull $(GAR_IMAGE_PATH):$(IMAGE_TAG) || true
	docker build \
	  -t $(GAR_IMAGE_PATH):$(IMAGE_TAG) \
	  --cache-from $(GAR_IMAGE_PATH):$(IMAGE_TAG) \
	  .
	@echo "Successfully built image $(GAR_IMAGE_PATH):$(IMAGE_TAG) and $(GAR_IMAGE_PATH):$(IMAGE_TAG) to GAR."

# Deploy: Build and push image
deploy: docker-build
	@echo "deployment complete for $(GAR_IMAGE_PATH)"
	docker push $(GAR_IMAGE_PATH):$(IMAGE_TAG)

# Clean up local Docker image
clean:
	@echo "Removing local Docker image $(IMAGE_NAME):$(IMAGE_TAG)"
	docker rmi $(IMAGE_NAME):$(IMAGE_TAG) || true
	@echo "Removing local Docker image $(GAR_IMAGE_PATH):$(IMAGE_TAG)"
	docker rmi $(GAR_IMAGE_PATH):$(IMAGE_TAG) || true
	@echo "Clean up complete."

# Default target
all: help
