#!/bin/sh
# Run the integration test stack and test suite, then tear down.
# Defaults to port 18080 to avoid conflicts with a locally-running DHIS2.
# Override any variable before running:
#   DHIS2_HTTP_PORT=9090 yarn test:local

echo "Installing integration dependencies..."
yarn install

echo "Starting DHIS2 stack..."
docker compose up -d

echo "Running integration tests..."
set +e
DHIS2_BASE_URL="${DHIS2_BASE_URL:-http://localhost:18080}" \
  DHIS2_USERNAME="${DHIS2_USERNAME:-admin}" \
  DHIS2_PASSWORD="${DHIS2_PASSWORD:-district}" \
  DHIS2_API_VERSION="${DHIS2_API_VERSION:-43}" \
  yarn test
TEST_EXIT=$?
set -e

echo "Tearing down DHIS2 stack..."
docker compose down -v

exit $TEST_EXIT
