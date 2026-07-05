#!/bin/bash
set -e

echo "===== Rebuilding TEST environment ====="

echo "Stopping old containers..."
docker compose -f docker-compose.2test.yml down

echo "Building new images..."
docker compose -f docker-compose.2test.yml build --no-cache

echo "Starting test environment..."
docker compose -f docker-compose.2test.yml up -d

echo "Test environment ready."