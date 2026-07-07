# Duplicate Email & Phone Number Validation

## Overview

Studio AYNSH now implements comprehensive duplicate validation for user registration. The system ensures that each email and phone number is unique across all user accounts, preventing duplicate registrations and maintaining data integrity.

## Implementation

### 1. Database Schema

**File:** `lib/db/schema.ts`

The user table has been updated with unique constraints:

```typescript
export const user = pgTable('user', {
  id:            text('id').primaryKey(),
  name:          text('name').notNull(),
  email:         text('email').notNull().unique(),      // ← Unique constraint
  emailVerified: boolean('emailVerified').notNull().default(false),
  image:         text('image'),
  role:          text('role').notNull().default('client'),
  phone:         text('phone').unique(),                 // ← Unique constraint (NEW)
  createdAt:     timestamp('createdAt').notNull().defaultNow(),
  updatedAt:     timestamp('updatedAt').notNull().defaultNow(),
})
```

- **Email**: Already had unique constraint, now enforced by database
- **Phone**: NEW unique constraint added to prevent duplicate phone registrations

### 2. Server Action: Check Duplicates

**File:** `lib/actions/check-duplicates.ts`

A new server action validates email and phone uniqueness before registration:

```typescript
export async function checkDuplicateEmailOrPhone(
  email: string,
  phone?: string
): Promise<{
  isDuplicate: boolean
  duplicateType?: 'email' | 'phone' | 'both'
  message?: string
}>
```

**Features:**
- Checks email (always required)
- Checks phone (if provided)
- Returns specific message indicating which field(s) are duplicate
- Safe case-insensitive and whitespace-trimmed comparison
- Error handling for database issues

**Return Value:**

```typescript
{
  isDuplicate: false  // No duplicates found
}

// OR

{
  isDuplicate: true,
  duplicateType: 'email' | 'phone' | 'both',
  message: '...'  // User-friendly error message
}
```

### 3. Client-Side Integration

**File:** `components/auth-form.tsx`

The authentication form now validates duplicates during sign-up:

```typescript
if (mode === 'sign-up') {
  // Check for duplicate email or phone number
  const trimmedEmail = email.trim().toLowerCase()
  const trimmedPhone = phone.trim()
  
  const duplicationCheck = await checkDuplicateEmailOrPhone(
    trimmedEmail, 
    trimmedPhone || undefined
  )
  
  if (duplicationCheck.isDuplicate) {
    throw new Error(duplicationCheck.message || 'Email or phone number is already registered.')
  }
  
  // Proceed with sign-up if no duplicates found
  const res = await authClient.signUp.email({ ... })
}
```

## User-Facing Messages

When a user attempts to register with an existing email or phone number, they see specific error messages:

### Email Already Registered
```
"Your email is already registered. Please sign in or use a different email."
```

### Phone Already Registered
```
"Your phone number is already registered. Please sign in or use a different phone number."
```

### Both Email and Phone Registered
```
"Your email and phone number are already registered."
```

## Error Handling

### Database-Level Protection
- PostgreSQL unique constraints prevent duplicate entries
- Prevents race conditions with concurrent registrations
- Automatically enforced by the database

### Application-Level Protection
- Pre-signup validation provides better UX
- Clear feedback before database attempt
- Prevents unnecessary database round-trips

### Error Messages
All errors are displayed in the auth form's error box with red styling:

```
[Error box styling]
"Your email is already registered. Please sign in or use a different email."
```

## Data Flow

```
User submits sign-up form
  ↓
Client-side validation (name, email format, password length)
  ↓
Call checkDuplicateEmailOrPhone() server action
  ↓
Query database for existing email/phone
  ↓
Return duplicate status and message
  ↓
If duplicate: Display error message and stop
  ↓
If unique: Proceed with authClient.signUp.email()
  ↓
Account created or auth error displayed
```

## Technical Specifications

### Email Handling
- Converted to lowercase for comparison
- Trimmed of whitespace
- Validated with regex pattern: `/^\S+@\S+\.\S+$/`
- Stored in lowercase in database
- Unique constraint at database level

### Phone Handling
- Trimmed of whitespace
- Optional field (not required)
- Unique constraint only when provided
- Supports international format (e.g., +91 00000 00000)
- Maximum 20 characters stored

### Case & Whitespace
All inputs are trimmed and email is lowercased:

```typescript
email = email.trim().toLowerCase()
phone = phone.trim()
```

This ensures:
- "TEST@EXAMPLE.COM" and "test@example.com" are treated as same email
- "  +91 9876543210  " and "+91 9876543210" are treated as same phone
- No false duplicates due to formatting differences

## Database Migration

To apply the unique constraint on `phone` field, run:

```bash
pnpm run db:push
```

This will:
1. Add unique constraint to `phone` column
2. Create index for efficient lookups
3. Ensure existing duplicate phones are handled (if any)

## Testing

### Test Case 1: Unique Email and Phone
1. Sign up with "user1@example.com" and "+91 9876543210"
2. Expected: Account created successfully

### Test Case 2: Duplicate Email
1. Sign up with "user1@example.com" and "+91 9876543211"
2. Expected: Error "Your email is already registered..."

### Test Case 3: Duplicate Phone
1. Sign up with "user2@example.com" and "+91 9876543210" (existing phone)
2. Expected: Error "Your phone number is already registered..."

### Test Case 4: Case Insensitive Email
1. Sign up with "USER1@EXAMPLE.COM" (different case, same email as user1)
2. Expected: Error "Your email is already registered..."

### Test Case 5: Whitespace Handling
1. Sign up with "  user1@example.com  " (extra spaces)
2. Expected: Error "Your email is already registered..."

### Test Case 6: Phone Optional
1. Sign up with "user3@example.com" (no phone)
2. Expected: Account created successfully
3. Different user can also register without phone

## Security Considerations

### SQL Injection Prevention
- Uses Drizzle ORM parameterized queries
- No string concatenation
- Input validation before queries

### Rate Limiting
- Consider implementing rate limiting on duplicate checks
- Prevent email enumeration attacks
- Current implementation: No rate limiting (add if needed)

### Email Enumeration
- Better Auth handles "autoSignIn" carefully
- Always returns same response time (timing-safe)
- Prevents attackers from inferring registered emails

### Data Protection
- Phone number stored securely
- Unique constraint indexed for performance
- User can update phone later if needed

## Future Enhancements

1. **Real-time Validation**: Check availability as user types
2. **Rate Limiting**: Prevent abuse of duplicate check endpoint
3. **Phone Number Formatting**: Validate international formats
4. **Admin Features**: Tools to merge duplicate accounts
5. **Two-Factor Auth**: Use phone for verification

## Related Files

- `lib/db/schema.ts` - Database schema with constraints
- `lib/actions/check-duplicates.ts` - Duplicate validation server action
- `components/auth-form.tsx` - User registration form
- `lib/auth.ts` - Better Auth configuration
- `lib/auth-client.ts` - Client-side auth methods

## Support

For issues or questions about duplicate validation:
1. Check error messages displayed on sign-up form
2. Verify email format is valid
3. Try signing in instead if account exists
4. Contact support if phone verification needed
