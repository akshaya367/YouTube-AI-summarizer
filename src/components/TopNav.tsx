import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { LogOut, LayoutDashboard, Sparkles } from 'lucide-react';

export default async function TopNav() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center gap-2">
                        <Sparkles className="text-blue-500" size={24} />
                        <span className="font-bold text-xl text-white tracking-tight">YouTube AI</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="text-gray-300 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors"
                                >
                                    <LayoutDashboard size={18} />
                                    Dashboard
                                </Link>
                                <form action="/auth/callback?action=logout" method="POST">
                                    <button type="submit" className="text-gray-300 hover:text-red-400 flex items-center gap-2 text-sm font-medium transition-colors">
                                        <LogOut size={18} />
                                        Sign Out
                                    </button>
                                </form>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/login"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
