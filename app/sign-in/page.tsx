import { auth } from '@/lib/auth'
import { AuthForm } from '@/components/auth-form'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Sign In — Studio AYNSH Client Portal',
}

export default async function SignInPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect('/portal')
  return <AuthForm mode="sign-in" />
}
