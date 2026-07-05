#!/bin/bash
set -e

echo "===== Stopping TEST environment ====="

echo "Stopping containers..."

docker compose -f docker-compose.2test.yml down

echo "TEST environment stopped."