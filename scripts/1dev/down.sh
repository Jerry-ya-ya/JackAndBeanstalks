#!/bin/bash
set -e

echo "===== Stopping DEV environment ====="

echo "Stopping containers..."

docker compose -f docker-compose.1dev.yml down

echo "DEV environment stopped."