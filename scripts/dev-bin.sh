#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get the absolute path of the project root
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEV_BIN_PATH="/usr/local/bin/henv-dev"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Cleaning up development environment...${NC}"
    if [ -f "$DEV_BIN_PATH" ]; then
        sudo rm -f "$DEV_BIN_PATH"
        echo -e "${GREEN}✅ Removed temporary executable: $DEV_BIN_PATH${NC}"
    fi
    echo -e "${GREEN}✅ Development session ended${NC}"
}

# Set up cleanup trap
trap cleanup EXIT INT TERM

# Create the development executable wrapper
echo -e "${YELLOW}🛠️  Setting up development environment...${NC}"

# Create temporary executable that uses ts-node for live reloading
cat << EOF | sudo tee "$DEV_BIN_PATH" > /dev/null
#!/bin/bash
npx ts-node "$PROJECT_ROOT/src/index.ts" "\$@"
EOF

# Make it executable
sudo chmod +x "$DEV_BIN_PATH"

echo -e "${GREEN}✅ Development executable created: $DEV_BIN_PATH${NC}"
echo -e "${GREEN}🚀 You can now use 'henv-dev' from anywhere in your system${NC}"
echo -e "${YELLOW}📝 Live code changes will be reflected automatically${NC}"
echo -e "${YELLOW}🛑 Press Ctrl+C to exit and cleanup${NC}"
echo ""

# Keep the script running to maintain the executable
echo "Development mode active... (Press Ctrl+C to exit)"
while true; do
    sleep 1
done 