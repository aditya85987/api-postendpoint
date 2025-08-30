#!/bin/bash

# Test script for BFHL API
# Usage: ./test.sh [base-url]
# Default base URL is http://localhost:3000

BASE_URL=${1:-"http://localhost:3000"}
ENDPOINT="$BASE_URL/bfhl"

echo "Testing BFHL API at: $ENDPOINT"
echo "================================"

# Test Example A
echo -e "\n🧪 Test Example A:"
echo "Request: {\"data\":[\"a\",\"1\",\"334\",\"4\",\"R\",\"$\"]}"
echo "Response:"
curl -s -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{"data":["a","1","334","4","R","$"]}' | jq '.'

# Test Example B  
echo -e "\n🧪 Test Example B:"
echo "Request: {\"data\":[\"2\",\"a\",\"y\",\"4\",\"&\",\"-\",\"*\",\"5\",\"92\",\"b\"]}"
echo "Response:"
curl -s -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{"data":["2","a","y","4","&","-","*","5","92","b"]}' | jq '.'

# Test Example C
echo -e "\n🧪 Test Example C:"  
echo "Request: {\"data\":[\"A\",\"ABcD\",\"DOE\"]}"
echo "Response:"
curl -s -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{"data":["A","ABcD","DOE"]}' | jq '.'

# Test Error Case - Invalid JSON
echo -e "\n🧪 Test Error Case - Missing data field:"
echo "Request: {\"invalid\":[]}"
echo "Response:"
curl -s -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{"invalid":[]}' | jq '.'

# Test Error Case - Wrong method
echo -e "\n🧪 Test Error Case - GET method (should fail):"
echo "Response:"
curl -s -X GET "$ENDPOINT" | jq '.'

echo -e "\n✅ All tests completed!"