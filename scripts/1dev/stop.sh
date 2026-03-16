#!/bin/bash
set -e

echo "===== Stopping DEV environment ====="

docker compose -f docker-compose.1dev.yml stop

echo "DEV environment stopped."