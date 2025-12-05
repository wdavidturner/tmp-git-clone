#!/usr/bin/env bash
set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

REPO_URL="https://github.com/wdavidturner/tmp-git-clone.git"
INSTALL_DIR="${HOME}/.local/share/tmp-git-clone"
BIN_DIR="${HOME}/.local/bin"

info() {
    echo -e "${BLUE}==>${NC} $1"
}

success() {
    echo -e "${GREEN}==>${NC} $1"
}

warn() {
    echo -e "${YELLOW}==>${NC} $1"
}

error() {
    echo -e "${RED}==>${NC} $1"
    exit 1
}

# Check for required commands
check_dependencies() {
    info "Checking dependencies..."

    if ! command -v git &> /dev/null; then
        error "git is not installed. Please install git first."
    fi

    if ! command -v node &> /dev/null; then
        error "Node.js is not installed. Please install Node.js 18+ first."
    fi

    # Check Node.js version
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        error "Node.js 18+ is required. Found version $(node -v)"
    fi

    if ! command -v npm &> /dev/null; then
        error "npm is not installed. Please install npm first."
    fi

    success "Dependencies OK (git, node $(node -v), npm)"
}

# Clone or update the repository
install_repo() {
    if [ -d "$INSTALL_DIR" ]; then
        info "Updating existing installation..."
        cd "$INSTALL_DIR"
        git pull --ff-only origin main
    else
        info "Cloning repository..."
        mkdir -p "$(dirname "$INSTALL_DIR")"
        git clone "$REPO_URL" "$INSTALL_DIR"
        cd "$INSTALL_DIR"
    fi
}

# Build the project
build_project() {
    info "Installing npm dependencies..."
    npm install --silent

    info "Building..."
    npm run build --silent

    success "Build complete"
}

# Create symlink
create_symlink() {
    mkdir -p "$BIN_DIR"

    BINARY_PATH="$INSTALL_DIR/dist/index.js"
    SYMLINK_PATH="$BIN_DIR/tmp-git-clone"

    # Remove existing symlink if present
    if [ -L "$SYMLINK_PATH" ] || [ -f "$SYMLINK_PATH" ]; then
        rm "$SYMLINK_PATH"
    fi

    ln -s "$BINARY_PATH" "$SYMLINK_PATH"
    chmod +x "$BINARY_PATH"

    success "Created symlink at $SYMLINK_PATH"
}

# Check if bin directory is in PATH
check_path() {
    if [[ ":$PATH:" != *":$BIN_DIR:"* ]]; then
        warn "$BIN_DIR is not in your PATH"
        echo ""
        echo "Add this to your shell config (~/.bashrc, ~/.zshrc, etc.):"
        echo ""
        echo "  export PATH=\"\$HOME/.local/bin:\$PATH\""
        echo ""
    fi
}

# Main installation
main() {
    echo ""
    echo -e "${BLUE}tmp-git-clone installer${NC}"
    echo ""

    check_dependencies
    install_repo
    build_project
    create_symlink
    check_path

    echo ""
    success "Installation complete!"
    echo ""
    echo "  Usage: tmp-git-clone <owner/repo>"
    echo "  Example: tmp-git-clone rails/rails"
    echo ""
}

main
