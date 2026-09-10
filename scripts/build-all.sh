#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLATFORM_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "======================================================"
echo " Building Centralized CRM Platform"
echo " Root: $PLATFORM_ROOT"
echo "======================================================"

echo -e "\n[1/3] Building Centralized Spring Boot Backend..."
cd "$PLATFORM_ROOT/backend"
./mvnw clean package -DskipTests
echo "✓ Backend build succeeded"

echo -e "\n[2/3] Building Web Application (Vite + React)..."
cd "$PLATFORM_ROOT/apps/web"
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run build
echo "✓ Web build succeeded"

echo -e "\n[3/3] Building Desktop Application (Vite + React UI)..."
cd "$PLATFORM_ROOT/apps/desktop"
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run build
echo "✓ Desktop build succeeded"

echo -e "\n======================================================"
echo " ALL COMPONENTS BUILT SUCCESSFULLY!"
echo "======================================================"
