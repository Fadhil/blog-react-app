# GitHub Actions Workflow for Google Artifact Registry

This directory contains a GitHub Actions workflow that builds a Docker image from your React application and pushes it to Google Artifact Registry (GAR).

## Workflow Overview

The workflow `docker-build-push.yml` does the following:

1. Triggers on pushes to the `main` branch, pull requests to `main`, or manual triggers
2. Sets up authentication to Google Cloud using a service account key
3. Builds a Docker image using the multi-stage Dockerfile
4. Tags the image with the commit SHA and `latest`
5. Pushes the image to Google Artifact Registry

## Required GitHub Secrets

You need to set up the following secrets in your GitHub repository:

- `GCP_PROJECT_ID`: Your Google Cloud Project ID
- `GAR_LOCATION`: The location of your Artifact Registry (e.g., `us-central1`)
- `GAR_REPOSITORY_NAME`: The name of your Artifact Registry repository
- `GCP_SA_KEY`: The JSON service account key (base64 encoded)

## Setup Instructions

### 1. Create a Google Artifact Registry Repository

```bash
gcloud artifacts repositories create [REPOSITORY_NAME] \
    --repository-format=docker \
    --location=[LOCATION] \
    --description="Docker repository for blog-react-app"
```

### 2. Create a Service Account and Generate Key

```bash
# Create a service account
gcloud iam service-accounts create "github-actions-sa" \
    --project="[PROJECT_ID]" \
    --description="Service account for GitHub Actions" \
    --display-name="GitHub Actions Service Account"

# Grant the service account permission to push to Artifact Registry
gcloud artifacts repositories add-iam-policy-binding [REPOSITORY_NAME] \
    --project="[PROJECT_ID]" \
    --location="[LOCATION]" \
    --member="serviceAccount:github-actions-sa@[PROJECT_ID].iam.gserviceaccount.com" \
    --role="roles/artifactregistry.writer"

# Create and download the service account key
gcloud iam service-accounts keys create key-file.json \
    --project="[PROJECT_ID]" \
    --iam-account="github-actions-sa@[PROJECT_ID].iam.gserviceaccount.com"
```

### 3. Add GitHub Secrets

Add the following secrets to your GitHub repository:

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Add the following repository secrets:
   - `GCP_PROJECT_ID`: Your Google Cloud Project ID
   - `GAR_LOCATION`: The location of your Artifact Registry (e.g., `us-central1`)
   - `GAR_REPOSITORY_NAME`: The name of your Artifact Registry repository
   - `GCP_SA_KEY`: The content of the downloaded `key-file.json` (base64 encoded)

   You can base64 encode the JSON file with:
   ```bash
   cat key-file.json | base64
   ```

   > Note: After adding the key to GitHub Secrets, delete the local key file for security.

After setting up these secrets, your GitHub Actions workflow will be able to authenticate to Google Cloud and push Docker images to Artifact Registry.

## Security Considerations

Using service account keys offers a simpler setup compared to Workload Identity Federation, but comes with some security trade-offs:

- Service account keys never expire unless manually rotated
- The key is stored as a GitHub Secret (although encrypted)
- If compromised, the key provides access to Google Cloud resources

Consider implementing key rotation policies and limiting the permissions of the service account to only what is necessary for the workflow. 