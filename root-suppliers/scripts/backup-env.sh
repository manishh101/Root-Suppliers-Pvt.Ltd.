#!/bin/bash
# Environment Variables Backup Script
# Encrypts .env.local file for secure backup

set -e

ENV_FILE=".env.local"
ENCRYPTED_FILE=".env.local.gpg"
BACKUP_DIR="./env-backups"

# Check if .env.local exists
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Error: $ENV_FILE not found!"
    exit 1
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Generate timestamp
DATE=$(date +%Y%m%d_%H%M%S)

echo "🔐 Encrypting environment variables..."
echo ""
echo "You will be prompted to enter a passphrase."
echo "⚠️  IMPORTANT: Remember this passphrase! You'll need it to decrypt."
echo ""

# Encrypt with GPG (symmetric encryption)
gpg --symmetric --cipher-algo AES256 -o "$BACKUP_DIR/env-backup-$DATE.gpg" "$ENV_FILE"

echo ""
echo "✅ Backup created: $BACKUP_DIR/env-backup-$DATE.gpg"
echo ""
echo "To decrypt later, run:"
echo "  gpg --decrypt $BACKUP_DIR/env-backup-$DATE.gpg > .env.local"
echo ""
echo "📋 Next steps:"
echo "1. Store this encrypted file in a secure location"
echo "2. Add to git (encrypted files are safe to commit):"
echo "   git add $BACKUP_DIR/env-backup-$DATE.gpg"
echo "   git commit -m 'Encrypted env backup $DATE'"
