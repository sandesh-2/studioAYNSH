import { auth } from '@/lib/auth'
import { AuthForm } from '@/components/auth-form'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Sign In — Studio AYNSH Client Portal',
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const [headersList, params] = await Promise.all([headers(), searchParams])
  const session = await auth.api.getSession({ headers: headersList })
  if (session?.user) redirect(params.redirect ?? '/portal')

  // Validate redirect URL — only allow relative paths on same origin (prevent open redirect)
  const rawRedirect = params.redirect ?? ''
  const safeRedirect =
    rawRedirect.startsWith('/') && !rawRedirect.startsWith('//') ? rawRedirect : '/portal'

  return <AuthForm mode="sign-in" redirectTo={safeRedirect} />
}
