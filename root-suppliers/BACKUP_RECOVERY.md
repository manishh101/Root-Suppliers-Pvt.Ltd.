# Backup and Recovery System

## 🛡️ Overview

This project includes automated backup and disaster recovery capabilities using **100% FREE** tools.

| Component | Backup Method | Frequency | Storage |
|-----------|---------------|-----------|---------|
| **Database** | MongoDB mongodump | Every 6 hours | GitHub Releases |
| **Media** | Cloudinary API download | Weekly | GitHub Releases |
| **Code** | Git mirror | On push | GitLab (optional) |
| **Secrets** | GPG encryption | Manual | Git (encrypted) |

**Total Cost: $0/month** ✅

---

## 🔧 Setup Instructions

### 1. Add Required GitHub Secrets

Go to your repository → Settings → Secrets and variables → Actions → New repository secret

**Required for MongoDB backup:**
- `MONGODB_URI` - Your MongoDB connection string

**Required for Cloudinary backup:**
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Your Cloudinary API key
- `CLOUDINARY_API_SECRET` - Your Cloudinary API secret

**Optional (for GitLab mirroring):**
- `GITLAB_TOKEN` - GitLab personal access token
- `GITLAB_USERNAME` - Your GitLab username
- `GITLAB_REPO` - Repository name on GitLab

**Optional (for Discord notifications):**
- `DISCORD_WEBHOOK_URL` - Discord webhook for failure alerts

### 2. ⚠️ CRITICAL: Configure MongoDB Atlas Network Access

**GitHub Actions uses dynamic IP addresses that change with each run.** You MUST configure MongoDB Atlas to allow connections:

#### Option A: Allow Access from Anywhere (Recommended for Free Tier)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Select your cluster
3. Click **Network Access** in the left sidebar
4. Click **+ ADD IP ADDRESS**
5. Click **ALLOW ACCESS FROM ANYWHERE**
6. This adds `0.0.0.0/0` to the whitelist
7. Click **Confirm**

> ⚠️ **Security Note:** This allows connections from any IP. Your database is still protected by username/password authentication. This is acceptable for most use cases but consider additional security measures for sensitive data.

#### Option B: Use MongoDB Atlas API (Advanced)

For stricter security, you can dynamically whitelist GitHub Actions IPs using the Atlas API. This requires additional setup with GitHub Actions to fetch and whitelist the runner's IP before backup.

### 3. Verify Atlas Cluster Settings

Ensure your MongoDB Atlas cluster:
- ✅ Is in the Free Tier (M0) or higher
- ✅ Has a database user with read/write permissions
- ✅ Connection string includes the database name

---

## 📅 Backup Schedule

| Workflow | Schedule | Description |
|----------|----------|-------------|
| MongoDB Backup | `0 */6 * * *` | Every 6 hours (00:00, 06:00, 12:00, 18:00 UTC) |
| Cloudinary Backup | `0 3 * * 0` | Weekly on Sunday at 3 AM UTC |
| GitLab Mirror | On push | Automatically on every push to main |

---

## 🔄 How to Restore

### Restore MongoDB Database

1. **Download the backup** from GitHub Releases
2. **Run the restore script:**
   ```bash
   chmod +x scripts/restore-mongodb.sh
   ./scripts/restore-mongodb.sh mongodb-backup-YYYYMMDD_HHMMSS.gz
   ```

3. **Or restore manually:**
   ```bash
   export MONGODB_URI="your-connection-string"
   mongorestore --uri="$MONGODB_URI" --archive=backup-file.gz --gzip --drop
   ```

### Restore Cloudinary Media

1. **Download the backup** from GitHub Releases
2. **Extract the archive:**
   ```bash
   tar -xzf cloudinary-backup-YYYYMMDD_HHMMSS.tar.gz
   ```
3. **Review manifest.json** for original public_ids
4. **Upload assets** using Cloudinary dashboard or API

### Restore Environment Variables

1. **Decrypt the backup:**
   ```bash
   gpg --decrypt env-backups/env-backup-YYYYMMDD_HHMMSS.gpg > .env.local
   ```
2. Enter the passphrase when prompted

---

## 📦 Backup Locations

| Type | Location | Retention |
|------|----------|-----------|
| MongoDB backups | GitHub Releases (`backup-*` tags) | Last 10 releases |
| Media backups | GitHub Releases (`media-backup-*` tags) | 90 days |
| Artifacts | GitHub Actions artifacts | 30-90 days |

---

## 🔔 Monitoring & Alerts

### Check Backup Status

1. Go to GitHub Actions page
2. View recent workflow runs
3. Green ✅ = Success, Red ❌ = Failed

### Set Up Failure Notifications

**Option 1: Discord (Recommended)**
1. Create a Discord webhook in your server
2. Add `DISCORD_WEBHOOK_URL` to GitHub Secrets

**Option 2: Email via Gmail**
1. Create Gmail App Password
2. Use GitHub Actions email notification action

---

## 🆘 Emergency Recovery

### Complete System Recovery

1. **Deploy application to new hosting:**
   ```bash
   git clone https://github.com/yourusername/root-suppliers.git
   cd root-suppliers
   npm install
   ```

2. **Restore environment variables:**
   ```bash
   gpg --decrypt env-backups/env-backup-latest.gpg > .env.local
   ```

3. **Restore database:**
   ```bash
   ./scripts/restore-mongodb.sh latest-backup.gz
   ```

4. **Deploy:**
   ```bash
   npm run build
   npm start
   ```

---

## 📊 Free Tier Limits

| Service | Free Limit | Current Usage |
|---------|------------|---------------|
| MongoDB Atlas M0 | 512 MB | Monitor in Atlas |
| Cloudinary | 25 GB storage, 25 GB bandwidth | Monitor in dashboard |
| GitHub Actions | 2,000 min/month (private repos) | Check Actions usage |
| GitHub Storage | Unlimited for releases | N/A |

---

## 🔐 Security Notes

- ⚠️ **Never commit `.env.local`** - Always use encrypted backups
- ✅ **MONGODB_URI in GitHub Secrets** is encrypted at rest
- ✅ **GPG encrypted files** are safe to commit to git
- ✅ **All backups** use TLS/HTTPS for transfer

---

## 📞 Troubleshooting

### MongoDB Backup Fails

**Error: "Cannot connect to MongoDB"**
1. ✅ Verify MongoDB Atlas Network Access allows `0.0.0.0/0`
2. ✅ Check MONGODB_URI secret is correctly set
3. ✅ Ensure connection string includes database name
4. ✅ Verify database user has read permissions

**Error: "MONGODB_URI secret is not configured"**
1. Go to GitHub repository Settings → Secrets → Actions
2. Add `MONGODB_URI` with your connection string

### Cloudinary Backup Fails

**Error: "Failed to connect to Cloudinary API"**
1. ✅ Verify all three secrets are set correctly:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
2. ✅ Check credentials in Cloudinary Dashboard → Settings → Access Keys

**Error: "No assets were downloaded"**
1. Check if Cloudinary account has any uploaded assets
2. Verify API key has admin access permissions

### General Issues

**Workflows not running on schedule**
- GitHub may delay scheduled workflows during high load
- Manually trigger to verify the workflow works

**Release creation fails**
- Ensure repository has Actions enabled
- Check if you've hit GitHub release limits

**Support:** If backup fails, check the GitHub Actions logs for detailed error messages.

---

*Last updated: February 2026*
