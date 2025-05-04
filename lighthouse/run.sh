#!/bin/sh

TARGET_URL="${1:-$TARGET_URL}"
RENDERING_TYPE="${2:-$RENDERING_TYPE}"
HOST_OS="${3:-$HOST_OS}"

# Check for missing values
if [ -z "$TARGET_URL" ] || [ -z "$RENDERING_TYPE" ] || [ -z "$HOST_OS" ]; then
  echo "Missing required environment variables or arguments."
  echo "Usage: ./run.sh <TARGET_URL> <RENDERING_TYPE> <HOST_OS>"
  exit 1
fi

export TARGET_URL
export RENDERING_TYPE
export HOST_OS

npm run build && node dist/lighthouse.js
