#!/bin/bash
set -e

echo "===== Stopping PROD environment ====="

docker compose -f docker-compose.3prod.yml stop

echo "PROD environment stopped."