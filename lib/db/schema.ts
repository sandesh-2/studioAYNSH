import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

// ── Better Auth required tables ─────────────────────────────────────────────

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  role: text('role').notNull().default('client'),
  phone: text('phone'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// ── App tables ───────────────────────────────────────────────────────────────

export const booking = pgTable('booking', {
  id: text('id').primaryKey(),
  userId: text('userId'),               // linked if client has an account
  clientName: text('clientName').notNull(),
  clientEmail: text('clientEmail').notNull(),
  clientPhone: text('clientPhone').notNull(),
  service: text('service').notNull(),
  eventDate: text('eventDate').notNull(),
  eventTime: text('eventTime'),
  location: text('location').notNull(),
  duration: text('duration'),
  budget: text('budget'),
  guestCount: text('guestCount'),
  shootTheme: text('shootTheme'),
  specialRequests: text('specialRequests'),
  howHeard: text('howHeard'),
  status: text('status').notNull().default('pending'),  // pending | confirmed | completed | cancelled
  // Progress tracking: enquiry_received | contract_signed | advance_received | shoot_scheduled | shoot_completed | editing_in_progress | final_delivery
  progressStage: text('progressStage').notNull().default('enquiry_received'),
  adminNotes: text('adminNotes'),
  totalAmount: text('totalAmount'),
  depositPaid: boolean('depositPaid').default(false),
  depositAmount: text('depositAmount'),
  confirmedAt: timestamp('confirmedAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const message = pgTable('message', {
  id: text('id').primaryKey(),
  bookingId: text('bookingId').notNull().references(() => booking.id, { onDelete: 'cascade' }),
  senderId: text('senderId').notNull(),
  senderRole: text('senderRole').notNull(),  // admin | client
  content: text('content').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export type User = typeof user.$inferSelect
export type Booking = typeof booking.$inferSelect
export type Message = typeof message.$inferSelect

export const PROGRESS_STAGES = [
  { key: 'enquiry_received',    label: 'Enquiry Received',    description: 'Your enquiry has been received and is under review.' },
  { key: 'contract_signed',     label: 'Contract Signed',     description: 'The contract has been signed and your booking is confirmed.' },
  { key: 'advance_received',    label: 'Advance Received',    description: 'Advance payment has been received and your date is locked.' },
  { key: 'shoot_scheduled',     label: 'Shoot Scheduled',     description: 'Your shoot has been scheduled. Please review the details.' },
  { key: 'shoot_completed',     label: 'Shoot Completed',     description: 'The shoot is complete. Post-processing has begun.' },
  { key: 'editing_in_progress', label: 'Editing In Progress', description: 'Your images are being carefully edited and curated.' },
  { key: 'final_delivery',      label: 'Final Delivery',      description: 'Your final gallery has been delivered. Enjoy your memories!' },
] as const

export type ProgressStageKey = typeof PROGRESS_STAGES[number]['key']
