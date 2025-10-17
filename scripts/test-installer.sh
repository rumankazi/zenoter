#!/usr/bin/env bash
# Test if Windows installer artifacts are generated correctly
# Run this manually: pnpm test:installer

set -e

COLOR_RED='\033[0;31m'
COLOR_GREEN='\033[0;32m'
COLOR_YELLOW='\033[1;33m'
COLOR_BLUE='\033[0;34m'
COLOR_RESET='\033[0m'

echo -e "${COLOR_BLUE}🔨 Testing Windows installer build...${COLOR_RESET}"
echo ""

# Clean previous build
echo -e "${COLOR_YELLOW}🧹 Cleaning previous build artifacts...${COLOR_RESET}"
rm -rf dist/ dist-electron/

# Run the build
echo -e "${COLOR_BLUE}📦 Building application (this may take a few minutes)...${COLOR_RESET}"
if ! pnpm dist:win; then
  echo -e "${COLOR_RED}❌ Build failed!${COLOR_RESET}"
  exit 1
fi

echo ""
echo -e "${COLOR_BLUE}🔍 Checking for installer artifacts...${COLOR_RESET}"
echo ""

# Check for NSIS installer
NSIS_INSTALLER=$(ls dist/Zenoter-Setup-*.exe 2>/dev/null | head -n 1)
if [ -z "$NSIS_INSTALLER" ]; then
  echo -e "${COLOR_RED}❌ NSIS installer (.exe) not found in dist/${COLOR_RESET}"
  echo "Expected: dist/Zenoter-Setup-*.exe"
  ls -la dist/ 2>/dev/null || echo "dist/ directory doesn't exist"
  exit 1
else
  SIZE=$(du -h "$NSIS_INSTALLER" | cut -f1)
  echo -e "${COLOR_GREEN}✓ NSIS Installer: $NSIS_INSTALLER ($SIZE)${COLOR_RESET}"
fi

# Check for portable version
PORTABLE_ZIP=$(ls dist/Zenoter-*-win.zip 2>/dev/null | head -n 1)
if [ -z "$PORTABLE_ZIP" ]; then
  echo -e "${COLOR_RED}❌ Portable version (.zip) not found in dist/${COLOR_RESET}"
  echo "Expected: dist/Zenoter-*-win.zip"
  ls -la dist/ 2>/dev/null || echo "dist/ directory doesn't exist"
  exit 1
else
  SIZE=$(du -h "$PORTABLE_ZIP" | cut -f1)
  echo -e "${COLOR_GREEN}✓ Portable Version: $PORTABLE_ZIP ($SIZE)${COLOR_RESET}"
fi

echo ""
echo -e "${COLOR_GREEN}✅ All installer artifacts generated successfully!${COLOR_RESET}"
echo ""
echo -e "${COLOR_BLUE}📊 Summary:${COLOR_RESET}"
echo -e "  NSIS Installer: ${COLOR_GREEN}$NSIS_INSTALLER${COLOR_RESET}"
echo -e "  Portable ZIP:   ${COLOR_GREEN}$PORTABLE_ZIP${COLOR_RESET}"
echo ""
echo -e "${COLOR_YELLOW}💡 Tip: These files are what get uploaded to GitHub releases${COLOR_RESET}"
