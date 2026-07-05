#!/bin/bash
set -e

echo "===== Stopping PROD environment ====="

echo "Stopping containers..."

docker compose -f docker-compose.3prod.yml down

echo "PROD environment stopped."