import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Github, Mail } from 'lucide-react'; // Can swap github for google

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
        const origin = (await headers()).get('origin');
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const supabase = await createClient();

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${origin}/auth/callback`,
            },
        });

        if (error) {
            return redirect('/login?message=Could not authenticate user');
        }

        return redirect('/login?message=Check email to continue sign in process');
    };

    // Google OAuth would require enabling it in Supabase Dashboard and calling auth.signInWithOAuth

    return (
        <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mt-20 mx-auto">
            <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-xl">
                <h1 className="text-2xl font-bold mb-6 text-center">Welcome Back</h1>

                <form
                    className="flex-1 flex flex-col w-full justify-center gap-4 text-gray-300"
                    action={signIn}
                >
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-1.5 block" htmlFor="email">
                                Email
                            </label>
                            <input
                                className="w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 mb-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                name="email"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1.5 block" htmlFor="password">
                                Password
                            </label>
                            <input
                                className="w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button className="bg-blue-600 hover:bg-blue-700 font-semibold text-white px-4 py-3 rounded-xl transition-colors w-full mt-2">
                        Sign In
                    </button>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
                        </div>
                    </div>

                    <button
                        formAction={signUp}
                        className="border border-gray-700 bg-gray-800 hover:bg-gray-700 font-semibold px-4 py-3 rounded-xl transition-colors w-full flex justify-center items-center gap-2"
                    >
                        Create an Account
                    </button>

                    {searchParams?.message && (
                        <p className="mt-4 p-4 bg-red-900/20 text-red-400 border border-red-900/50 rounded-xl text-center text-sm">
                            {searchParams.message}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}
