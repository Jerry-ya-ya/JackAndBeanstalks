#!/bin/bash
set -e

echo "===== Stopping TEST environment ====="

docker compose -f docker-compose.2test.yml stop

echo "TEST environment stopped."