# Studio AYNSH Booking System - Quick Start

## System Status: READY

All systems are configured and live. Here's how to use your booking management system.

---

## 1. Client Booking Flow

**Clients visit:**
- `yourdomain.com/booking` — Fill out booking form
- Form captures: name, email, phone, service type, event date/time, location, budget, guest count, theme, special requests
- On submit: Booking is saved to database + confirmation email sent to client

**What happens automatically:**
1. Booking data saved to Neon PostgreSQL database
2. Client receives confirmation email: "Thank you for your booking"
3. Studio owner receives detailed notification email with ALL booking details
4. Booking appears in Admin Dashboard instantly

---

## 2. Client Portal

**Clients can sign up and access:** `yourdomain.com/portal`

**In the portal, clients see:**
- List of all their bookings
- Current status (Pending, Confirmed, Completed, Cancelled)
- Full booking details
- Admin notes (for confirmed bookings)
- Message box to communicate with studio

**How booking matching works:**
- If client signs up with same email they used for booking → booking automatically appears
- If they book before signing up → booking linked when they sign up with same email

---

## 3. Admin Dashboard

**Access:** `yourdomain.com/admin`

**To set yourself as admin:**

1. Sign up at `/sign-up` with your email
2. Go to Neon console: https://console.neon.tech
3. Click "SQL Editor" and run:
   ```sql
   UPDATE public."user" 
   SET role = 'admin' 
   WHERE email = 'your-email@example.com';
   ```
4. Refresh the page and visit `/admin`

**In the admin dashboard, you can:**
- View all bookings (search by client name, email, service, date)
- Change booking status: Pending → Confirmed → Completed
- Set total amount and deposit amount
- Mark deposit as paid
- Write internal admin notes (visible to client)
- Send direct messages to clients per booking
- View all registered clients

---

## 4. Email Notifications

### Client Receives:
- **On booking:** Confirmation email with booking reference
- **Status updates:** When admin confirms or completes booking
- **Messages:** Direct replies from studio

### Studio Owner Receives:
- **New booking alert:** ALL client details + session info
- Email goes to: `samratgupta7754@gmail.com`

**To change studio email:**
- Edit `/app/actions/booking.ts` line 225
- Change: `const studioEmail = 'samratgupta7754@gmail.com'`
- To your email

---

## 5. Database Overview

Your Neon PostgreSQL database contains 6 tables:

| Table | Purpose |
|-------|---------|
| `user` | Client & admin accounts with roles |
| `session` | Login sessions (auto-expire) |
| `account` | Passwords & auth tokens |
| `verification` | Email verification codes |
| `booking` | All booking details (date, service, budget, notes, etc.) |
| `message` | Client-admin messages per booking |

**Access database:**
- Go to: https://console.neon.tech
- Project: gentle-term-89687267
- Use SQL Editor to query data

**Example queries:**

```sql
-- View all pending bookings
SELECT clientName, eventDate, clientEmail FROM booking WHERE status = 'pending' ORDER BY createdAt DESC;

-- Count bookings by service
SELECT service, COUNT(*) FROM booking GROUP BY service;

-- View all messages for a booking
SELECT * FROM message WHERE bookingId = 'your-booking-id' ORDER BY createdAt;

-- List all admin users
SELECT email, phone FROM "user" WHERE role = 'admin';
```

---

## 6. Troubleshooting

### Portal shows "This page can't be loaded"
- **Cause:** Not signed in
- **Fix:** Go to `/sign-up` first, create account, then access `/portal`

### Admin dashboard access denied
- **Cause:** User role not set to 'admin'
- **Fix:** Run SQL command above to set your role as admin

### Emails not sending
- **Cause:** Resend API key not verified in Resend dashboard
- **Fix:** Go to https://resend.com/emails, verify your email domain

### Booking not appearing in portal
- **Cause:** Client used different email for signup vs booking
- **Fix:** Email addresses must match exactly (case-insensitive)

---

## 7. Production Deployment

Your site is deployed on Vercel. Each time you push to GitHub:
1. Vercel rebuilds the site automatically
2. Database is live (Neon)
3. Emails send via Resend

**No additional setup needed** — everything is configured!

---

## 8. Key Features

✓ Real-time booking updates  
✓ Email notifications to studio & clients  
✓ Secure client authentication  
✓ Role-based access (admin/client)  
✓ Message threading per booking  
✓ Status tracking (pending → confirmed → completed)  
✓ Deposit tracking  
✓ SQL injection prevention  
✓ Server-side input validation  
✓ Mobile responsive design  

---

## 9. Next Steps

1. **Test the flow:**
   - Go to `/booking` → submit a test booking
   - Check your email for studio notification
   - Go to `/admin` → see the booking appear
   - Change status to "Confirmed"

2. **Customize studio email:**
   - Edit `/app/actions/booking.ts` line 225
   - Change email address
   - Deploy (or it updates on next git push)

3. **Share with team:**
   - Admin dashboard: `yourdomain.com/admin` (admin-only)
   - Client portal: `yourdomain.com/portal` (clients sign up here)

---

**Questions?** Check `/SETUP_GUIDE.md` for detailed step-by-step instructions.
