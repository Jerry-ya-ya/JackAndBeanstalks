#!/bin/bash
set -e

echo "===== Rebuilding DEV environment ====="

echo "Stopping old containers..."
docker compose -f docker-compose.1dev.yml down

echo "Building new images..."
docker compose -f docker-compose.1dev.yml build --no-cache

echo "Starting DEV environment..."
docker compose -f docker-compose.1dev.yml up -d

echo "DEV environment ready."