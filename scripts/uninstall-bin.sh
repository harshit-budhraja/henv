#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

BIN_PATH="/usr/local/bin/henv"
DEV_BIN_PATH="/usr/local/bin/henv-dev"

echo -e "${YELLOW}🗑️  Uninstalling henv from system bin...${NC}"

# Remove production executable
if [ -f "$BIN_PATH" ]; then
    sudo rm -f "$BIN_PATH"
    echo -e "${GREEN}✅ Removed production executable: $BIN_PATH${NC}"
else
    echo -e "${YELLOW}ℹ️  Production executable not found at: $BIN_PATH${NC}"
fi

# Remove development executable if it exists
if [ -f "$DEV_BIN_PATH" ]; then
    sudo rm -f "$DEV_BIN_PATH"
    echo -e "${GREEN}✅ Removed development executable: $DEV_BIN_PATH${NC}"
else
    echo -e "${YELLOW}ℹ️  Development executable not found at: $DEV_BIN_PATH${NC}"
fi

echo -e "${GREEN}✅ Uninstallation complete${NC}" 