import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const origin = requestUrl.origin
    const next = requestUrl.searchParams.get('next') ?? '/'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // Check if next is a relative path to prevent open redirect attacks
            const isRelative = next.startsWith('/')
            const redirectTo = isRelative ? `${origin}${next}` : `${origin}/`
            return NextResponse.redirect(redirectTo)
        } else {
            console.error('Auth code exchange error:', error.message)
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
