#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "========================================"
echo "  CivitAI Model Manager - Setup Script"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} Node.js is not installed!"
    echo "Please download and install Node.js from https://nodejs.org/"
    echo "Recommended version: Node.js 20.x or higher"
    exit 1
fi

# Display Node.js version
echo -e "${BLUE}[INFO]${NC} Node.js detected:"
node --version
echo ""

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} npm is not available!"
    echo "Please reinstall Node.js from https://nodejs.org/"
    exit 1
fi

echo -e "${BLUE}[INFO]${NC} npm detected:"
npm --version
echo ""

# Install dependencies
echo -e "${YELLOW}[STEP 1/3]${NC} Installing dependencies..."
echo "This may take a few minutes..."
echo ""
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}[ERROR]${NC} Failed to install dependencies!"
    echo "Please check your internet connection and try again."
    exit 1
fi

echo ""
echo -e "${GREEN}[SUCCESS]${NC} Dependencies installed successfully!"
echo ""

# Check if .env file exists
if [ -f .env ]; then
    echo -e "${YELLOW}[STEP 2/3]${NC} .env file already exists, skipping..."
else
    if [ -f .env.example ]; then
        echo -e "${YELLOW}[STEP 2/3]${NC} Creating .env file from template..."
        cp .env.example .env
        echo -e "${GREEN}[SUCCESS]${NC} .env file created!"
        echo "Please edit .env file to add your configuration."
    else
        echo -e "${YELLOW}[STEP 2/3]${NC} No .env.example found, creating basic .env..."
        echo "PORT=5000" > .env
        echo "NODE_ENV=development" >> .env
        echo -e "${GREEN}[SUCCESS]${NC} Basic .env file created!"
    fi
fi
echo ""

# Setup complete
echo -e "${GREEN}[STEP 3/3]${NC} Setup complete!"
echo ""
echo "========================================"
echo "  Next Steps:"
echo "========================================"
echo ""
echo "1. Configure your settings:"
echo "   - Get your CivitAI API key from: https://civitai.com/user/account"
echo "   - Launch the app and go to Settings page"
echo "   - Enter your CivitAI API key"
echo "   - Optionally set your ComfyUI installation path"
echo ""
echo "2. Start the application:"
echo "   - Run: npm run dev"
echo "   - Or run: ./start.sh"
echo ""
echo "3. Access the application:"
echo "   - Open your browser and go to: http://localhost:5000"
echo ""
echo "========================================"
echo ""
echo "Would you like to start the application now? (y/n)"
read -r START_NOW

if [[ "$START_NOW" =~ ^[Yy]$ ]]; then
    echo ""
    echo "Starting CivitAI Model Manager..."
    echo "Press Ctrl+C to stop the server."
    echo ""
    npm run dev
else
    echo ""
    echo "You can start the application later by running: npm run dev"
    echo ""
fi
