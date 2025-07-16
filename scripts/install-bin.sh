#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get the absolute path of the project root
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BIN_PATH="/usr/local/bin/henv"
BUILT_EXECUTABLE="$PROJECT_ROOT/dist/index.js"

echo -e "${YELLOW}📦 Installing henv to system bin...${NC}"

# Check if built executable exists
if [ ! -f "$BUILT_EXECUTABLE" ]; then
    echo -e "${RED}❌ Built executable not found at: $BUILT_EXECUTABLE${NC}"
    echo -e "${YELLOW}💡 Run 'npm run build' first to compile the project${NC}"
    exit 1
fi

# Check if henv already exists and ask for confirmation
if [ -f "$BIN_PATH" ]; then
    echo -e "${YELLOW}⚠️  henv executable already exists at: $BIN_PATH${NC}"
    read -p "Do you want to overwrite it? (y/N): " -r
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Installation cancelled${NC}"
        exit 0
    fi
fi

# Create the production executable wrapper
cat << EOF | sudo tee "$BIN_PATH" > /dev/null
#!/bin/bash
node "$PROJECT_ROOT/dist/index.js" "\$@"
EOF

# Make it executable
sudo chmod +x "$BIN_PATH"

echo -e "${GREEN}✅ henv installed successfully to: $BIN_PATH${NC}"
echo -e "${GREEN}🚀 You can now use 'henv' from anywhere in your system${NC}"
echo -e "${YELLOW}💡 Run 'npm run uninstall-bin' to remove it later${NC}" 