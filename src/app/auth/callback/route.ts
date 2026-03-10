import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
        const supabase = await createClient();
        await supabase.auth.exchangeCodeForSession(code);
    }

    return redirect(requestUrl.origin);
}

export async function POST(request: Request) {
    const requestUrl = new URL(request.url);
    const action = requestUrl.searchParams.get('action');

    if (action === 'logout') {
        const supabase = await createClient();
        await supabase.auth.signOut();
    }

    return redirect(requestUrl.origin);
}
