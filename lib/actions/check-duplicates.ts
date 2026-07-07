'use server'

import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { eq, or } from 'drizzle-orm'

export async function checkDuplicateEmailOrPhone(
  email: string,
  phone?: string
): Promise<{
  isDuplicate: boolean
  duplicateType?: 'email' | 'phone' | 'both'
  message?: string
}> {
  try {
    // Build condition — check email always, phone only if provided
    const conditions = [eq(user.email, email.toLowerCase().trim())]
    if (phone?.trim()) {
      conditions.push(eq(user.phone, phone.trim()))
    }

    const existingUser = await db
      .select()
      .from(user)
      .where(conditions.length > 1 ? or(...conditions) : conditions[0])
      .limit(1)

    if (existingUser.length === 0) {
      return { isDuplicate: false }
    }

    // Determine what is duplicated
    const existing = existingUser[0]
    const emailMatch = existing.email === email.toLowerCase().trim()
    const phoneMatch = phone?.trim() && existing.phone === phone.trim()

    if (emailMatch && phoneMatch) {
      return {
        isDuplicate: true,
        duplicateType: 'both',
        message: 'Your email and phone number are already registered.',
      }
    } else if (emailMatch) {
      return {
        isDuplicate: true,
        duplicateType: 'email',
        message: 'Your email is already registered. Please sign in or use a different email.',
      }
    } else if (phoneMatch) {
      return {
        isDuplicate: true,
        duplicateType: 'phone',
        message: 'Your phone number is already registered. Please sign in or use a different phone number.',
      }
    }

    return { isDuplicate: false }
  } catch (error) {
    console.error('[v0] Error checking duplicates:', error)
    return {
      isDuplicate: false,
      message: 'Unable to verify availability. Please try again.',
    }
  }
}
