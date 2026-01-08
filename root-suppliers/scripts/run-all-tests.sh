#!/bin/bash

# API Test Runner Script
# Runs all API tests sequentially
# Usage: ./run-all-tests.sh

API_BASE="${NEXT_PUBLIC_API_URL:-http://localhost:3000}"

echo "=========================================="
echo "🧪 Running All API Tests"
echo "=========================================="
echo "API Base URL: $API_BASE"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

run_test() {
    local test_name=$1
    local test_file=$2
    
    echo ""
    echo -e "${BLUE}▶ Running ${test_name} Tests...${NC}"
    echo "----------------------------------------"
    
    NEXT_PUBLIC_API_URL=$API_BASE npx tsx scripts/${test_file}
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ ${test_name} Tests Completed${NC}"
    else
        echo -e "${RED}✗ ${test_name} Tests Failed${NC}"
    fi
    
    echo ""
    read -p "Press Enter to continue to next test..."
}

# Run all tests
run_test "Categories" "test-categories-api.ts"
run_test "Blogs" "test-blogs-api.ts"
run_test "Products" "test-products-api.ts"
run_test "Brands" "test-brands-api.ts"
run_test "Inquiries" "test-inquiries-api.ts"

echo ""
echo "=========================================="
echo "🎉 All API Tests Completed"
echo "=========================================="
echo ""
echo "Review the results above for detailed information."
echo "Check COMPLETE_API_TEST_SUMMARY.md for full documentation."
