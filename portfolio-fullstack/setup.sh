#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "========================================"
echo "  Portfolio Full-Stack Setup Script"
echo "========================================"
echo ""

# Check Node.js
echo -e "${BLUE}[1/8]${NC} Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Node.js ${NODE_VERSION} found"
else
    echo -e "${RED}✗${NC} Node.js not found. Please install Node.js v16+ from https://nodejs.org"
    exit 1
fi

# Check npm
echo -e "${BLUE}[2/8]${NC} Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} npm ${NPM_VERSION} found"
else
    echo -e "${RED}✗${NC} npm not found"
    exit 1
fi

# Check MongoDB
echo -e "${BLUE}[3/8]${NC} Checking MongoDB..."
if command -v mongod &> /dev/null || command -v mongo &> /dev/null || command -v mongosh &> /dev/null; then
    echo -e "${GREEN}✓${NC} MongoDB found"
else
    echo -e "${YELLOW}⚠${NC}  MongoDB not found locally"
    echo "    You can:"
    echo "    1. Install MongoDB locally"
    echo "    2. Use Docker: docker run -d -p 27017:27017 mongo:7.0"
    echo "    3. Use MongoDB Atlas (cloud): https://cloud.mongodb.com"
    read -p "    Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Install root dependencies
echo -e "${BLUE}[4/8]${NC} Installing root dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Root dependencies installed"
else
    echo -e "${RED}✗${NC} Failed to install root dependencies"
    exit 1
fi

# Install backend dependencies
echo -e "${BLUE}[5/8]${NC} Installing backend dependencies..."
cd backend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Backend dependencies installed"
else
    echo -e "${RED}✗${NC} Failed to install backend dependencies"
    exit 1
fi

# Setup backend .env
if [ ! -f ".env" ]; then
    echo -e "${BLUE}[6/8]${NC} Creating backend .env file..."
    cp .env.example .env
    echo -e "${GREEN}✓${NC} Backend .env created"
    echo -e "${YELLOW}⚠${NC}  Please edit backend/.env with your configuration"
else
    echo -e "${BLUE}[6/8]${NC} Backend .env already exists"
fi

cd ..

# Install frontend dependencies
echo -e "${BLUE}[7/8]${NC} Installing frontend dependencies..."
cd frontend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Frontend dependencies installed"
else
    echo -e "${RED}✗${NC} Failed to install frontend dependencies"
    exit 1
fi

# Setup frontend .env
if [ ! -f ".env" ]; then
    echo -e "${BLUE}[8/8]${NC} Creating frontend .env file..."
    cp .env.example .env
    echo -e "${GREEN}✓${NC} Frontend .env created"
else
    echo -e "${BLUE}[8/8]${NC} Frontend .env already exists"
fi

cd ..

echo ""
echo "========================================"
echo -e "${GREEN}  ✅ Setup Complete!${NC}"
echo "========================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Configure environment variables:"
echo "   - Edit backend/.env with your MongoDB URI and secrets"
echo "   - Frontend .env is already configured"
echo ""
echo "2. Start MongoDB:"
echo "   mongod"
echo "   # OR with Docker:"
echo "   docker run -d -p 27017:27017 --name mongodb mongo:7.0"
echo ""
echo "3. Seed the database:"
echo "   npm run seed"
echo ""
echo "4. Start the application:"
echo "   npm run dev"
echo "   # This starts both backend and frontend"
echo ""
echo "5. Access the application:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000"
echo ""
echo "6. Login with default credentials:"
echo "   Email:    admin@portfolio.com"
echo "   Password: Admin@123456"
echo ""
echo "========================================"
echo ""
echo -e "${BLUE}For detailed instructions, see README.md${NC}"
echo ""
