#!/bin/sh

TARGET_URL="${1:-$TARGET_URL}"
RENDERING_TYPE="${2:-$RENDERING_TYPE}"
HOST_OS="${3:-$HOST_OS}"
ITERATION_GROUP="${4:-$ITERATION_GROUP}"
PAGE="${5:-$PAGE}"
THROTTLING_METHOD="${6:-$THROTTLING_METHOD}"

# Check for missing values
if [ -z "$TARGET_URL" ] || [ -z "$RENDERING_TYPE" ] || [ -z "$HOST_OS" ] || [ -z "$ITERATION_GROUP" ] || [ -z "$PAGE" ] || [ -z "$THROTTLING_METHOD" ]; then
  echo "Missing required environment variables or arguments."
  echo "Usage: ./run.sh <TARGET_URL> <RENDERING_TYPE> <HOST_OS> <ITERATION_GROUP> <PAGE> <THROTTLING_METHOD>"
  exit 1
fi

export TARGET_URL
export RENDERING_TYPE
export HOST_OS
export ITERATION_GROUP
export PAGE
export THROTTLING_METHOD

npm run build && node dist/lighthouse.js
