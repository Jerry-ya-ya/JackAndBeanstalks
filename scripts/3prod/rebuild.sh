#!/bin/bash
set -e

echo "===== Rebuilding PROD environment ====="

echo "Stopping old containers..."
docker compose -f docker-compose.3prod.yml down

echo "Building new images..."
docker compose -f docker-compose.3prod.yml build --no-cache

echo "Starting PROD environment..."
docker compose -f docker-compose.3prod.yml up -d

echo "PROD environment ready."