import {
  boolean,
  date,
  jsonb,
  numeric,
  pgTable,
  smallint,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

// Drizzle does not export `timestamptz` — use `timestamp` with { withTimezone: true }.
const timestamptz = (name: string) => timestamp(name, { withTimezone: true, mode: 'date' })

// ── Better Auth required tables ─────────────────────────────────────────────

export const user = pgTable('user', {
  id:            text('id').primaryKey(),
  name:          text('name').notNull(),
  email:         text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image:         text('image'),
  role:          text('role').notNull().default('client'),  // client | admin
  phone:         text('phone'),
  createdAt:     timestamp('createdAt').notNull().defaultNow(),
  updatedAt:     timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id:         text('id').primaryKey(),
  expiresAt:  timestamp('expiresAt').notNull(),
  token:      text('token').notNull().unique(),
  createdAt:  timestamp('createdAt').notNull().defaultNow(),
  updatedAt:  timestamp('updatedAt').notNull().defaultNow(),
  ipAddress:  text('ipAddress'),
  userAgent:  text('userAgent'),
  userId:     text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id:                      text('id').primaryKey(),
  accountId:               text('accountId').notNull(),
  providerId:              text('providerId').notNull(),
  userId:                  text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken:             text('accessToken'),
  refreshToken:            text('refreshToken'),
  idToken:                 text('idToken'),
  accessTokenExpiresAt:    timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt:   timestamp('refreshTokenExpiresAt'),
  scope:                   text('scope'),
  password:                text('password'),
  createdAt:               timestamp('createdAt').notNull().defaultNow(),
  updatedAt:               timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id:         text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value:      text('value').notNull(),
  expiresAt:  timestamp('expiresAt').notNull(),
  createdAt:  timestamp('createdAt').notNull().defaultNow(),
  updatedAt:  timestamp('updatedAt').notNull().defaultNow(),
})

// ── Core booking table ───────────────────────────────────────────────────────
// Holds identity, service type, workflow status, and progress stage.
// Event details → booking_event  |  Financials → booking_financials
// Admin notes   → booking_note   |  Audit trail → booking_activity_log

export const bookingV2 = pgTable('booking_v2', {
  id:            text('id').primaryKey(),
  userId:        text('userId').notNull().references(() => user.id, { onDelete: 'restrict' }),

  // Client snapshot at time of booking (denormalised for history safety)
  clientName:    text('clientName').notNull(),
  clientEmail:   text('clientEmail').notNull(),
  clientPhone:   text('clientPhone').notNull(),

  // Service: wedding | prewedding | portrait | fashion | drone | other
  service:       text('service').notNull(),

  // Workflow status: pending | confirmed | completed | cancelled
  status:        text('status').notNull().default('pending'),

  // Progress stage (see PROGRESS_STAGES constant below)
  progressStage: text('progressStage').notNull().default('enquiry_received'),

  confirmedAt:   timestamptz('confirmedAt'),
  createdAt:     timestamptz('createdAt').notNull().defaultNow(),
  updatedAt:     timestamptz('updatedAt').notNull().defaultNow(),
})

// ── Event / shoot details ────────────────────────────────────────────────────
// One-to-one with booking_v2 (cascade delete).

export const bookingEvent = pgTable('booking_event', {
  id:              text('id').primaryKey(),
  bookingId:       text('bookingId').notNull().references(() => bookingV2.id, { onDelete: 'cascade' }),

  eventDate:       date('eventDate').notNull(),    // stored as DATE, not text
  eventTime:       text('eventTime'),              // HH:MM user-entered string
  location:        text('location').notNull(),
  venue:           text('venue'),                  // specific hall / venue name
  duration:        text('duration'),               // e.g. "6 hours" | "Full Day"
  guestCount:      smallint('guestCount'),
  shootTheme:      text('shootTheme'),
  specialRequests: text('specialRequests'),
  howHeard:        text('howHeard'),

  createdAt:       timestamptz('createdAt').notNull().defaultNow(),
  updatedAt:       timestamptz('updatedAt').notNull().defaultNow(),
})

// ── Financials ───────────────────────────────────────────────────────────────
// One-to-one with booking_v2. Amounts stored as NUMERIC(12,2).
// balanceAmount is a generated column — never set it directly.

export const bookingFinancials = pgTable('booking_financials', {
  id:            text('id').primaryKey(),
  bookingId:     text('bookingId').notNull().unique().references(() => bookingV2.id, { onDelete: 'cascade' }),

  totalAmount:   numeric('totalAmount', { precision: 12, scale: 2 }),
  depositAmount: numeric('depositAmount', { precision: 12, scale: 2 }),
  depositPaid:   boolean('depositPaid').notNull().default(false),
  depositPaidAt: timestamptz('depositPaidAt'),
  // balanceAmount is GENERATED ALWAYS AS in Postgres — read-only from Drizzle
  paymentNotes:  text('paymentNotes'),

  createdAt:     timestamptz('createdAt').notNull().defaultNow(),
  updatedAt:     timestamptz('updatedAt').notNull().defaultNow(),
})

// ── Admin notes log ───────────────────────────────────────────────────────────
// Append-only: every note is a new row; full history is preserved.

export const bookingNote = pgTable('booking_note', {
  id:        text('id').primaryKey(),
  bookingId: text('bookingId').notNull().references(() => bookingV2.id, { onDelete: 'cascade' }),
  authorId:  text('authorId').notNull().references(() => user.id, { onDelete: 'restrict' }),
  content:   text('content').notNull(),
  createdAt: timestamptz('createdAt').notNull().defaultNow(),
})

// ── Immutable audit / activity log ───────────────────────────────────────────
// Every status change, progress update, financial edit, and note addition is
// recorded here. Rows are never updated or deleted.
// eventType: booking_created | status_changed | progress_changed |
//            financials_updated | note_added

export const bookingActivityLog = pgTable('booking_activity_log', {
  id:            text('id').primaryKey(),
  bookingId:     text('bookingId').notNull().references(() => bookingV2.id, { onDelete: 'cascade' }),
  actorId:       text('actorId').references(() => user.id, { onDelete: 'set null' }),
  actorRole:     text('actorRole').notNull(),  // admin | system
  eventType:     text('eventType').notNull(),
  previousValue: text('previousValue'),
  newValue:      text('newValue'),
  metadata:      jsonb('metadata'),
  createdAt:     timestamptz('createdAt').notNull().defaultNow(),
})

// ── Inferred types ────────────────────────────────────────────────────────────

export type User             = typeof user.$inferSelect
export type BookingV2        = typeof bookingV2.$inferSelect
export type BookingEvent     = typeof bookingEvent.$inferSelect
export type BookingFinancials = typeof bookingFinancials.$inferSelect
export type BookingNote      = typeof bookingNote.$inferSelect
export type BookingActivityLog = typeof bookingActivityLog.$inferSelect

// Convenience composite type used throughout the app
export type FullBooking = BookingV2 & {
  event:      BookingEvent | null
  financials: BookingFinancials | null
  notes:      BookingNote[]
}

// ── Progress stages ───────────────────────────────────────────────────────────

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

// ── Service labels ────────────────────────────────────────────────────────────

export const SERVICE_LABELS: Record<string, string> = {
  wedding:    'Wedding Photography',
  prewedding: 'Pre-Wedding Photography',
  portrait:   'Portrait Session',
  fashion:    'Fashion Editorial',
  drone:      'Drone Cinematography',
  other:      'Other',
}
