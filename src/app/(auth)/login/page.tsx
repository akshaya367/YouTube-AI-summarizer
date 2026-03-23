import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Github, Mail, Chrome } from 'lucide-react';

export default async function Login({
    searchParams,
}: {
    searchParams: { message: string };
}) {
    const signIn = async (formData: FormData) => {
        'use server';
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const supabase = await createClient();

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return redirect('/login?message=Could not authenticate user');
        }

        return redirect('/dashboard');
    };

    const signUp = async (formData: FormData) => {
        'use server';
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const supabase = await createClient();

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
            },
        });

        if (error) {
            return redirect('/login?message=Could not authenticate user');
        }

        return redirect('/login?message=Check email to continue sign in process');
    };

    const signInWithProvider = async (formData: FormData) => {
        'use server';
        const provider = formData.get('provider') as 'google' | 'github';
        const supabase = await createClient();

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
            },
        });

        if (error) {
            return redirect('/login?message=OAuth error');
        }

        return redirect(data.url);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black px-6">
            <div className="w-full max-w-md bg-white/[0.03] border border-white/10 p-10 rounded-[32px] backdrop-blur-3xl shadow-2xl">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black mb-3 text-white tracking-tight">Welcome</h1>
                    <p className="text-gray-400 font-medium">Log in to your elite knowledge assistant</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <form action={signInWithProvider}>
                        <input type="hidden" name="provider" value="google" />
                        <button className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-3.5 rounded-2xl transition-all group">
                            <Chrome size={20} className="group-hover:scale-110 transition-transform" />
                            Google
                        </button>
                    </form>
                    <form action={signInWithProvider}>
                        <input type="hidden" name="provider" value="github" />
                        <button className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-3.5 rounded-2xl transition-all group">
                            <Github size={20} className="group-hover:scale-110 transition-transform" />
                            GitHub
                        </button>
                    </form>
                </div>

                <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/5"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                        <span className="px-4 bg-black text-gray-500">Or email</span>
                    </div>
                </div>

                <form className="space-y-4" action={signIn}>
                    <div className="space-y-3">
                        <input
                            className="w-full rounded-2xl bg-white/5 border border-white/10 px-5 py-4 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                            name="email"
                            type="email"
                            placeholder="Email address"
                            required
                        />
                        <input
                            className="w-full rounded-2xl bg-white/5 border border-white/10 px-5 py-4 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                        />
                    </div>

                    <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 mt-4">
                        Sign In
                    </button>

                    <button
                        formAction={signUp}
                        className="w-full text-gray-400 hover:text-white font-semibold py-2 transition-colors text-sm"
                    >
                        Create new account
                    </button>

                    {searchParams?.message && (
                        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                            <p className="text-red-400 text-sm text-center font-medium">
                                {searchParams.message}
                            </p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
