# Airtrek Robotics Dashboard

A prototype dashboard for monitoring Airtrek's autonomous aircraft towing fleet — fleet metrics, historical tow logs, a per-tow detail view, and an offline "Airtrek Insight" assistant that answers questions directly from the log data.

## Run locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

## Deploy

Pushing to `main` builds and publishes to GitHub Pages automatically via [.github/workflows/deploy.yml](.github/workflows/deploy.yml). In the repo settings, set **Pages → Source → GitHub Actions**.
