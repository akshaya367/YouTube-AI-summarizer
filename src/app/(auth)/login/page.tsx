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
        <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden px-6">
            {/* Animated Background Mesh */}
            <div className="absolute top-0 left-0 w-full h-full point-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-float-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/20 blur-[120px] rounded-full animate-float" />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-600/10 blur-[100px] rounded-full animate-pulse" />
            </div>

            <div className="w-full max-w-md bg-white/[0.03] border border-white/10 p-12 rounded-[40px] backdrop-blur-3xl shadow-2xl relative z-10">
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-600/30">
                        <Mail className="text-blue-400" size={32} />
                    </div>
                    <h1 className="text-5xl font-black mb-4 text-white tracking-tighter leading-none">Elevate.</h1>
                    <p className="text-gray-400 font-medium text-lg leading-snug">Sign in to your elite AI knowledge workspace</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-10">
                    <form action={signInWithProvider}>
                        <input type="hidden" name="provider" value="google" />
                        <button className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-4 rounded-[20px] transition-all group active:scale-95 shadow-lg">
                            <Chrome size={22} className="group-hover:rotate-12 transition-transform" />
                            Google
                        </button>
                    </form>
                    <form action={signInWithProvider}>
                        <input type="hidden" name="provider" value="github" />
                        <button className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-4 rounded-[20px] transition-all group active:scale-95 shadow-lg">
                            <Github size={22} className="group-hover:scale-110 transition-transform" />
                            GitHub
                        </button>
                    </form>
                </div>

                <div className="relative mb-10">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/5"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase tracking-[0.2em] font-black">
                        <span className="px-6 bg-transparent text-gray-500">OR MASTER VIA EMAIL</span>
                    </div>
                </div>

                <form className="space-y-5" action={signIn}>
                    <div className="space-y-4">
                        <div className="relative">
                            <input
                                className="w-full rounded-[20px] bg-white/5 border border-white/10 px-6 py-5 text-white placeholder-gray-600 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-lg"
                                name="email"
                                type="email"
                                placeholder="Email address"
                                required
                            />
                        </div>
                        <div className="relative">
                            <input
                                className="w-full rounded-[20px] bg-white/5 border border-white/10 px-6 py-5 text-white placeholder-gray-600 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-lg"
                                type="password"
                                name="password"
                                placeholder="Password"
                                required
                            />
                        </div>
                    </div>

                    <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-[22px] shadow-2xl shadow-blue-600/40 transition-all active:scale-95 mt-6 text-xl tracking-tight">
                        UNLEASH AI
                    </button>

                    <button
                        formAction={signUp}
                        className="w-full text-gray-500 hover:text-white font-bold py-2 transition-colors text-sm tracking-widest uppercase"
                    >
                        Create New Workspace
                    </button>

                    {searchParams?.message && (
                        <div className="mt-8 p-5 bg-red-500/10 border border-red-500/20 rounded-[24px] animate-shake">
                            <p className="text-red-400 text-sm text-center font-black">
                                {searchParams.message.toUpperCase()}
                            </p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
