# Studio AYNSH Booking System — Complete Setup Guide

## 📍 Quick Links

- **Admin Dashboard**: `https://your-production-url.com/admin`
- **Client Portal**: `https://your-production-url.com/portal`
- **Booking Form**: `https://your-production-url.com/booking`
- **Sign Up**: `https://your-production-url.com/sign-up`
- **Sign In**: `https://your-production-url.com/sign-in`

---

## 1️⃣ ACCESS THE ADMIN PANEL

### Step 1: Create Your Admin Account
1. Go to **`/sign-up`** on your site
2. Create an account with your email (e.g., `samratgupta7754@gmail.com`)
3. Create a strong password (minimum 8 characters)
4. You will be redirected to `/portal`

### Step 2: Set Your Role to "admin"
Once logged in, you need to mark your account as an admin in the database:

**Option A: Via Neon Dashboard (Recommended)**
1. Go to **https://console.neon.tech**
2. Sign in with your account
3. Select your project **"gentle-term-89687267"**
4. Open the **SQL Editor**
5. Run this SQL command:
   ```sql
   UPDATE public."user" 
   SET role = 'admin' 
   WHERE email = 'samratgupta7754@gmail.com';
   ```
6. Click **Execute**
7. Go back to your site and refresh. You should now see the Admin Dashboard at `/admin`

**Option B: Via Vercel Postgres Client (if available)**
- Use Vercel's database dashboard under your project settings

### Step 3: Access Admin Dashboard
1. Navigate to **`/admin`** on your site
2. You'll see all bookings from clients
3. You can:
   - View all booking details
   - Change booking status (pending → confirmed → completed)
   - Write notes visible to clients
   - Set pricing and deposit amounts
   - Message clients directly

---

## 2️⃣ DATABASE LOCATION & ACCESS

### Where is the Database Stored?
Your database is stored on **Neon**, a PostgreSQL serverless database hosted in the cloud.

**Database Details:**
- **Provider**: Neon (https://neon.tech)
- **Type**: PostgreSQL (open-source relational database)
- **Region**: US (or configured region)
- **Connection String**: Automatically managed in your environment variables

### How to Access the Database

**Via Neon Console (Web UI):**
1. Go to **https://console.neon.tech**
2. Sign in with your Neon account
3. Select project **"gentle-term-89687267"**
4. Click **SQL Editor** to run queries
5. View tables, data, and run custom queries

**Direct SQL Query Example:**
```sql
-- View all bookings
SELECT * FROM public."booking" ORDER BY "createdAt" DESC;

-- View all clients
SELECT id, name, email, phone, role FROM public."user";

-- View messages for a specific booking
SELECT * FROM public."message" WHERE "bookingId" = 'YOUR_BOOKING_ID';
```

### Database Tables

Your system uses 6 tables:

| Table | Purpose |
|-------|---------|
| **user** | Client & admin accounts (name, email, phone, role) |
| **session** | Active user login sessions (auto-managed) |
| **account** | Password hashes & auth tokens (auto-managed) |
| **verification** | Email verification (auto-managed) |
| **booking** | All booking enquiries with complete client details |
| **message** | Messages between admin and clients |

---

## 3️⃣ HOW TO KNOW WHO MADE A BOOKING

### Method 1: Admin Dashboard (Easiest)
1. Go to `/admin`
2. All bookings are listed with client names and details
3. Click any booking to see full details:
   - Client name, email, phone
   - Service type
   - Event date, time, location
   - Budget, guest count, theme
   - Special requests
   - How they found you

### Method 2: Email Notification (Automatic)
When a client books:
1. **You receive an instant email** to `samratgupta7754@gmail.com` with:
   - Client name, email, phone
   - Full session details
   - All their special requests
   - Link to admin dashboard to respond

2. **Client receives confirmation email** with:
   - Booking reference number
   - Session details summary
   - Portal link to track status

### Method 3: Message Thread (In Admin Dashboard)
1. Go to `/admin`
2. Select a booking
3. Scroll to **"Send a Message to Client"**
4. You can see conversation history
5. Client can also message you from their portal

**Note**: To enable email notifications, you need to:
1. Add `RESEND_API_KEY` in your Vercel project settings
2. Get a free key from **https://resend.com**
3. Verify your domain in Resend (takes ~5 minutes)

---

## 4️⃣ BOOKING INFORMATION FLOW

### When a Client Books:

```
1. Client fills booking form at /booking
   ↓
2. Form data validated server-side (cannot be tampered with)
   ↓
3. Booking saved to database with:
   - Client name, email, phone
   - Service type
   - Event date & time
   - Location, duration, budget
   - Guest count, shoot theme
   - Special requests
   - How they heard about you
   ↓
4. Two emails sent:
   
   EMAIL 1: To CLIENT
   - Booking confirmation
   - Reference number
   - Portal link to track status
   - Your contact info
   
   EMAIL 2: To YOU (Studio Owner)
   - All client details
   - Full booking information
   - Direct links to phone/email
   - Admin dashboard link
   ↓
5. Data appears in Admin Dashboard
   - Available immediately at /admin
   - Search/filter by status, date, service
   - Message client directly
   - Update status and pricing
```

### Complete Booking Data Saved:
- ✅ Client name
- ✅ Client email
- ✅ Client phone number
- ✅ Service type (wedding, portrait, etc.)
- ✅ Event date
- ✅ Event time
- ✅ Event location
- ✅ Duration of session
- ✅ Budget range
- ✅ Guest count
- ✅ Shoot theme/concept
- ✅ Special requests/vision
- ✅ How they found you (marketing source)
- ✅ Booking status (pending/confirmed/completed)
- ✅ Timestamp when booked
- ✅ Admin notes (you can add)
- ✅ Total amount & deposit info

---

## 5️⃣ CLIENT PORTAL (for Clients)

Clients can:
1. Sign up at `/sign-up`
2. View their bookings at `/portal`
3. Track booking status in real-time
4. Send messages to you
5. View your notes and updates

**Note**: Clients can also see bookings made BEFORE they had an account, matched by email address.

---

## 6️⃣ SECURITY & BEST PRACTICES

### Your System Has:
✅ Encrypted passwords (never stored in plain text)  
✅ Secure sessions (auto-expire after inactivity)  
✅ Server-side validation (clients can't fake data)  
✅ Role-based access (clients can't see admin panel)  
✅ Input sanitization (prevents malicious code)  
✅ Database isolation (each user sees only their own data)  

### What NOT to Do:
❌ Don't share your admin password  
❌ Don't modify user roles directly (use the SQL command above)  
❌ Don't expose your database credentials  
❌ Don't delete bookings from the database (mark as 'cancelled' instead)  

---

## 7️⃣ ENVIRONMENT VARIABLES (What You Need to Set)

In your Vercel project settings → **Settings → Environment Variables**, add:

### Required:
- `DATABASE_URL` ✅ **Already set** (Neon connection)
- `BETTER_AUTH_SECRET` ✅ **Already set** (session signing key)

### Optional but Recommended:
- `RESEND_API_KEY` → Get from **https://resend.com** (for email notifications)

---

## 8️⃣ TROUBLESHOOTING

### Portal shows "This page can't be loaded"
1. Make sure you're signed in (redirects to `/sign-in` if not)
2. Check that your `DATABASE_URL` is set in Vercel
3. Verify tables were created in Neon (use SQL editor to check)

### Not receiving booking emails
1. Check `RESEND_API_KEY` is set in Vercel
2. Verify your domain is confirmed in Resend
3. Check spam folder
4. Check admin dashboard — bookings are always saved there, even if email fails

### Can't access admin dashboard
1. Make sure your role is set to 'admin' (run the SQL command in Step 2)
2. Sign out and sign back in
3. Check in Neon that your user has `role = 'admin'`

---

## 9️⃣ SUMMARY

You now have a **complete, production-ready booking system** with:

1. ✅ Public booking form that captures all details
2. ✅ Database storing all client information securely
3. ✅ Email notifications to you when clients book
4. ✅ Admin dashboard to manage all bookings
5. ✅ Client portal for clients to track status
6. ✅ Messaging system for admin-client communication
7. ✅ Security & data protection built-in

**Next Steps:**
1. Get your Resend API key (optional but recommended for emails)
2. Verify your admin role in the database
3. Test the booking form
4. Test receiving an email notification
5. View the booking in your admin dashboard
6. Start receiving real bookings!

---

**Need help?** Check your admin dashboard or contact Vercel support.

Studio AYNSH Booking System v1.0 ✨
