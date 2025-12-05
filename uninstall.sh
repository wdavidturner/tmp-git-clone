#!/usr/bin/env bash
set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

INSTALL_DIR="${HOME}/.local/share/tmp-git-clone"
SYMLINK_PATH="${HOME}/.local/bin/tmp-git-clone"

info() {
    echo -e "${BLUE}==>${NC} $1"
}

success() {
    echo -e "${GREEN}==>${NC} $1"
}

main() {
    echo ""
    echo -e "${BLUE}tmp-git-clone uninstaller${NC}"
    echo ""

    if [ -L "$SYMLINK_PATH" ] || [ -f "$SYMLINK_PATH" ]; then
        info "Removing symlink..."
        rm "$SYMLINK_PATH"
    fi

    if [ -d "$INSTALL_DIR" ]; then
        info "Removing installation directory..."
        rm -rf "$INSTALL_DIR"
    fi

    success "Uninstallation complete!"
    echo ""
    echo "Note: Config and history at ~/.tmp-git-clone/ were preserved."
    echo "Run 'rm -rf ~/.tmp-git-clone' to remove them."
    echo ""
}

main
