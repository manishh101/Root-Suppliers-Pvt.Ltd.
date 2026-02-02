#!/bin/bash
# MongoDB Restore Script
# Restores database from a backup file

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔄 MongoDB Restore Script"
echo "========================="
echo ""

# Check if backup file is provided
if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: Please provide a backup file path${NC}"
    echo ""
    echo "Usage: ./scripts/restore-mongodb.sh <backup-file.gz>"
    echo ""
    echo "Example:"
    echo "  ./scripts/restore-mongodb.sh mongodb-backup-20260202_120000.gz"
    exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}❌ Error: Backup file not found: $BACKUP_FILE${NC}"
    exit 1
fi

# Check if MONGODB_URI is set
if [ -z "$MONGODB_URI" ]; then
    # Try to load from .env.local
    if [ -f ".env.local" ]; then
        export $(grep -v '^#' .env.local | xargs)
    fi
    
    if [ -z "$MONGODB_URI" ]; then
        echo -e "${RED}❌ Error: MONGODB_URI environment variable not set${NC}"
        echo ""
        echo "Set it with:"
        echo "  export MONGODB_URI='mongodb+srv://...' "
        echo ""
        echo "Or create a .env.local file with MONGODB_URI"
        exit 1
    fi
fi

# Warning
echo -e "${YELLOW}⚠️  WARNING: This will REPLACE all data in your database!${NC}"
echo ""
echo "Backup file: $BACKUP_FILE"
echo "Target database: $(echo $MONGODB_URI | sed 's/mongodb+srv:\/\/[^@]*@/mongodb+srv:\/\/***@/')"
echo ""
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Restore cancelled."
    exit 0
fi

echo ""
echo "🔄 Starting restore..."

# Restore with mongorestore
mongorestore --uri="$MONGODB_URI" --archive="$BACKUP_FILE" --gzip --drop

echo ""
echo -e "${GREEN}✅ Restore complete!${NC}"
echo ""
echo "Please verify your data:"
echo "  1. Check the website is working"
echo "  2. Verify products, categories, and settings are correct"
echo "  3. Test user authentication"
