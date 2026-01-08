# 🔧 MongoDB Atlas IP Whitelist Fix

## Problem
Your application cannot connect to MongoDB Atlas because your current IP address is not whitelisted in the cluster's network access settings.

**Error Message:**
```
MongooseServerSelectionError: Could not connect to any servers in your MongoDB Atlas cluster. 
One common reason is that you're trying to access the database from an IP that isn't whitelisted.
```

---

## Solution: Add Your IP to MongoDB Atlas

### Step 1: Go to MongoDB Atlas
1. Open your browser and go to: **https://cloud.mongodb.com/**
2. Log in with your credentials
3. Select your organization and project

### Step 2: Navigate to Network Access
1. In the left sidebar, click on **"Network Access"** (under SECURITY section)
2. You'll see a list of whitelisted IP addresses

### Step 3: Add Your IP Address

**Option A: Allow Access From Anywhere (Easiest for Development)**
1. Click the **"+ ADD IP ADDRESS"** button
2. In the modal, click **"ALLOW ACCESS FROM ANYWHERE"**
3. This will add `0.0.0.0/0` (all IPs)
4. Add a comment: "Development - Allow All"
5. Click **"Confirm"**

**Option B: Add Your Current IP (More Secure)**
1. Click the **"+ ADD IP ADDRESS"** button
2. Click **"ADD CURRENT IP ADDRESS"**
3. MongoDB will auto-detect your IP
4. Add a comment: "My Development Machine"
5. Click **"Confirm"**

### Step 4: Wait for Changes to Propagate
⏱️ **Wait 1-2 minutes** for the changes to take effect across all MongoDB servers.

---

## Test the Connection

After whitelisting your IP, run this command to test:

```bash
cd /home/manish/Documents/Root_Suppliers/root-suppliers-v2
npx tsx scripts/test-mongodb.ts
```

**Alternative: Test by starting the dev server**
```bash
pnpm dev
```
Then visit http://localhost:3000/admin - if you see the login page (not a connection error), MongoDB is connected!

You should see:
```
✅ Successfully connected to MongoDB Atlas!
```

---

## Restart Your Development Server

After fixing the IP whitelist:

```bash
# Stop the current server (Ctrl+C if running)
# Then restart:
pnpm dev
```

Your admin panel should now work at:
- Login: http://localhost:3000/admin/login
- Dashboard: http://localhost:3000/admin

---

## Troubleshooting

### If You Still Can't Connect:

**1. Check Your MongoDB URI**
Open `.env.local` and verify:
```bash
MONGODB_URI=mongodb+srv://musk02029_db_user:root-suppliers@root-suppliers.qpmsjgy.mongodb.net/root-suppliers?retryWrites=true&w=majority&appName=root-suppliers
```

**2. Verify Database User Exists**
1. In MongoDB Atlas, go to **"Database Access"**
2. Check if user `musk02029_db_user` exists
3. If not, create it:
   - Username: `musk02029_db_user`
   - Password: `root-suppliers`
   - Database User Privileges: **"Atlas Admin"** or **"Read and write to any database"**

**3. Check Cluster Status**
1. Go to **"Database"** in MongoDB Atlas
2. Make sure your cluster **"root-suppliers"** is running (green status)
3. If paused, click **"Resume"**

**4. Dynamic IP Address**
If your internet IP changes frequently:
- Use Option A (Allow Access From Anywhere) for development
- Or add multiple IPs for different locations (home, office, etc.)

**5. VPN/Proxy Issues**
If you're using a VPN:
- Disconnect the VPN temporarily
- Add your real IP to whitelist
- Then reconnect VPN

---

## Quick Commands Reference

```bash
# Test MongoDB connection
npx tsx scripts/test-mongodb.ts

# Create admin user (after MongoDB is working)
npx tsx scripts/seed-admin.ts

# Start development server
pnpm dev

# Build for production
pnpm build
```

---

## Next Steps After Fix

1. ✅ Whitelist IP in MongoDB Atlas
2. ✅ Test connection: `npx tsx scripts/test-mongodb.ts`
3. ✅ Create admin user: `npx tsx scripts/seed-admin.ts`
4. ✅ Start server: `pnpm dev`
5. ✅ Access admin: http://localhost:3000/admin/login
6. ✅ Login with: admin@rootsuppliers.com / Admin@2024!

---

## Support

If you continue to have issues:
1. Check MongoDB Atlas status: https://status.mongodb.com/
2. Review MongoDB connection string format: https://www.mongodb.com/docs/manual/reference/connection-string/
3. Verify firewall settings on your machine
