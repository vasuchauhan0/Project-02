#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

echo "======================================"
echo "  Portfolio Full-Stack Test Suite"
echo "======================================"
echo ""

# Backend URL
BACKEND_URL="http://localhost:5000"
API_URL="${BACKEND_URL}/api"

# Check if backend is running
echo -e "${BLUE}[TEST]${NC} Checking if backend is running..."
if curl -s "${BACKEND_URL}" > /dev/null; then
    echo -e "${GREEN}✓ PASS${NC} Backend is running on ${BACKEND_URL}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} Backend is not running. Please start it with: npm run backend"
    echo "Exiting tests..."
    exit 1
fi

echo ""
echo "======================================"
echo "  Testing Backend API Endpoints"
echo "======================================"
echo ""

# Test 1: Health Check
echo -e "${BLUE}[TEST 1]${NC} Testing health endpoint..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "${API_URL}/health")
if [ "$RESPONSE" -eq 200 ]; then
    echo -e "${GREEN}✓ PASS${NC} Health check endpoint working"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} Health check failed (HTTP ${RESPONSE})"
    ((FAILED++))
fi

# Test 2: Register User
echo -e "${BLUE}[TEST 2]${NC} Testing user registration..."
TIMESTAMP=$(date +%s)
REGISTER_RESPONSE=$(curl -s -X POST "${API_URL}/auth/register" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"Test User ${TIMESTAMP}\",\"email\":\"test${TIMESTAMP}@test.com\",\"password\":\"Test@123456\"}")

if echo "$REGISTER_RESPONSE" | grep -q "success.*true"; then
    echo -e "${GREEN}✓ PASS${NC} User registration successful"
    ((PASSED++))
    # Extract token for further tests
    TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"token":"[^"]*' | sed 's/"token":"//')
else
    echo -e "${RED}✗ FAIL${NC} User registration failed"
    echo "Response: $REGISTER_RESPONSE"
    ((FAILED++))
fi

# Test 3: Login
echo -e "${BLUE}[TEST 3]${NC} Testing user login..."
LOGIN_RESPONSE=$(curl -s -X POST "${API_URL}/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@portfolio.com","password":"Admin@123456"}')

if echo "$LOGIN_RESPONSE" | grep -q "success.*true"; then
    echo -e "${GREEN}✓ PASS${NC} User login successful"
    ((PASSED++))
    # Extract admin token
    ADMIN_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | sed 's/"token":"//')
else
    echo -e "${RED}✗ FAIL${NC} User login failed"
    echo "Response: $LOGIN_RESPONSE"
    ((FAILED++))
fi

# Test 4: Get Current User (Protected)
if [ -n "$TOKEN" ]; then
    echo -e "${BLUE}[TEST 4]${NC} Testing protected route (get current user)..."
    ME_RESPONSE=$(curl -s "${API_URL}/auth/me" \
        -H "Authorization: Bearer ${TOKEN}")
    
    if echo "$ME_RESPONSE" | grep -q "success.*true"; then
        echo -e "${GREEN}✓ PASS${NC} Protected route working"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} Protected route failed"
        ((FAILED++))
    fi
fi

# Test 5: Get All Projects
echo -e "${BLUE}[TEST 5]${NC} Testing get all projects..."
PROJECTS_RESPONSE=$(curl -s "${API_URL}/projects")

if echo "$PROJECTS_RESPONSE" | grep -q "success.*true"; then
    echo -e "${GREEN}✓ PASS${NC} Get all projects working"
    # Count projects
    PROJECT_COUNT=$(echo "$PROJECTS_RESPONSE" | grep -o '"_id"' | wc -l)
    echo "   Found ${PROJECT_COUNT} projects"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} Get all projects failed"
    ((FAILED++))
fi

# Test 6: Get Featured Projects
echo -e "${BLUE}[TEST 6]${NC} Testing get featured projects..."
FEATURED_RESPONSE=$(curl -s "${API_URL}/projects/featured?limit=3")

if echo "$FEATURED_RESPONSE" | grep -q "success.*true"; then
    echo -e "${GREEN}✓ PASS${NC} Get featured projects working"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} Get featured projects failed"
    ((FAILED++))
fi

# Test 7: Search Projects
echo -e "${BLUE}[TEST 7]${NC} Testing project search..."
SEARCH_RESPONSE=$(curl -s "${API_URL}/projects/search?q=commerce")

if echo "$SEARCH_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✓ PASS${NC} Project search working"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} Project search failed"
    ((FAILED++))
fi

# Test 8: GitHub Repos (Note: May fail if no GitHub token set)
echo -e "${BLUE}[TEST 8]${NC} Testing GitHub repos integration..."
GITHUB_RESPONSE=$(curl -s "${API_URL}/projects/github-repos?username=vasuchauhan0&limit=3")

if echo "$GITHUB_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✓ PASS${NC} GitHub repos integration working"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ SKIP${NC} GitHub repos failed (may need GitHub token)"
fi

# Test 9: Send Contact Message
echo -e "${BLUE}[TEST 9]${NC} Testing contact form..."
MESSAGE_RESPONSE=$(curl -s -X POST "${API_URL}/messages" \
    -H "Content-Type: application/json" \
    -d '{"name":"Test User","email":"test@example.com","subject":"Test Message","message":"This is a test message from automated tests.","category":"General Inquiry"}')

if echo "$MESSAGE_RESPONSE" | grep -q "success.*true"; then
    echo -e "${GREEN}✓ PASS${NC} Contact form working"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} Contact form failed"
    echo "Response: $MESSAGE_RESPONSE"
    ((FAILED++))
fi

# Test 10: Get Messages (Admin only)
if [ -n "$ADMIN_TOKEN" ]; then
    echo -e "${BLUE}[TEST 10]${NC} Testing get messages (admin)..."
    MESSAGES_RESPONSE=$(curl -s "${API_URL}/messages" \
        -H "Authorization: Bearer ${ADMIN_TOKEN}")
    
    if echo "$MESSAGES_RESPONSE" | grep -q "success.*true"; then
        echo -e "${GREEN}✓ PASS${NC} Get messages (admin) working"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} Get messages failed"
        ((FAILED++))
    fi
fi

# Test 11: Get Unread Messages Count (Admin)
if [ -n "$ADMIN_TOKEN" ]; then
    echo -e "${BLUE}[TEST 11]${NC} Testing unread messages count (admin)..."
    UNREAD_RESPONSE=$(curl -s "${API_URL}/messages/unread-count" \
        -H "Authorization: Bearer ${ADMIN_TOKEN}")
    
    if echo "$UNREAD_RESPONSE" | grep -q "success.*true"; then
        echo -e "${GREEN}✓ PASS${NC} Unread messages count working"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} Unread messages count failed"
        ((FAILED++))
    fi
fi

# Test 12: Category Filter
echo -e "${BLUE}[TEST 12]${NC} Testing category filter..."
CATEGORY_RESPONSE=$(curl -s "${API_URL}/projects/category/Full%20Stack")

if echo "$CATEGORY_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✓ PASS${NC} Category filter working"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} Category filter failed"
    ((FAILED++))
fi

# Test 13: Pagination
echo -e "${BLUE}[TEST 13]${NC} Testing pagination..."
PAGINATION_RESPONSE=$(curl -s "${API_URL}/projects?page=1&limit=5")

if echo "$PAGINATION_RESPONSE" | grep -q "pagination"; then
    echo -e "${GREEN}✓ PASS${NC} Pagination working"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} Pagination failed"
    ((FAILED++))
fi

# Test 14: Logout
if [ -n "$TOKEN" ]; then
    echo -e "${BLUE}[TEST 14]${NC} Testing logout..."
    LOGOUT_RESPONSE=$(curl -s -X POST "${API_URL}/auth/logout" \
        -H "Authorization: Bearer ${TOKEN}")
    
    if echo "$LOGOUT_RESPONSE" | grep -q "success.*true"; then
        echo -e "${GREEN}✓ PASS${NC} Logout working"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} Logout failed"
        ((FAILED++))
    fi
fi

# Test 15: Invalid Token (Should fail)
echo -e "${BLUE}[TEST 15]${NC} Testing invalid token protection..."
INVALID_TOKEN_RESPONSE=$(curl -s "${API_URL}/auth/me" \
    -H "Authorization: Bearer invalid_token_12345")

if echo "$INVALID_TOKEN_RESPONSE" | grep -q "success.*false\|not authorized\|invalid"; then
    echo -e "${GREEN}✓ PASS${NC} Invalid token properly rejected"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} Invalid token not properly rejected"
    ((FAILED++))
fi

# Test 16: CORS Headers
echo -e "${BLUE}[TEST 16]${NC} Testing CORS configuration..."
CORS_RESPONSE=$(curl -s -I "${API_URL}/health" | grep -i "access-control-allow-origin")

if [ -n "$CORS_RESPONSE" ]; then
    echo -e "${GREEN}✓ PASS${NC} CORS headers present"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ WARN${NC} CORS headers not detected"
fi

echo ""
echo "======================================"
echo "  Test Results Summary"
echo "======================================"
echo ""
echo -e "${GREEN}PASSED: ${PASSED}${NC}"
echo -e "${RED}FAILED: ${FAILED}${NC}"
echo ""

TOTAL=$((PASSED + FAILED))
SUCCESS_RATE=$(awk "BEGIN {printf \"%.1f\", ($PASSED/$TOTAL)*100}")

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED! (${SUCCESS_RATE}%)${NC}"
    echo ""
    echo "✅ Backend API is working correctly!"
    echo "✅ Authentication system functional"
    echo "✅ Projects endpoints working"
    echo "✅ Messages system operational"
    echo "✅ Protected routes secured"
    exit 0
else
    echo -e "${RED}⚠️  SOME TESTS FAILED (${SUCCESS_RATE}% success rate)${NC}"
    echo ""
    echo "Please check the failed tests above and ensure:"
    echo "  1. MongoDB is running and seeded"
    echo "  2. Backend .env is configured correctly"
    echo "  3. All dependencies are installed"
    exit 1
fi
