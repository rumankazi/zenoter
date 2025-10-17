# Build Assets

This directory contains assets needed for building platform-specific installers.

## Required Files (TODO)

### Windows
- `icon.ico` - Application icon (256x256, .ico format)

### macOS
- `icon.icns` - Application icon bundle

### Linux
- `icon.png` - Application icon (512x512 PNG)

## Current Status

⚠️ **Icons not yet created** - electron-builder will use default icons until proper icons are added.

## Creating Icons

1. Design a 1024x1024 PNG logo
2. Use tools like:
   - https://www.electronforge.io/guides/create-and-add-icons
   - https://github.com/electron-userland/electron-icon-maker
   - Online converters for .ico and .icns formats

## Notes

Icons are optional for development builds. The application will build successfully without them, but will use default Electron icons.
