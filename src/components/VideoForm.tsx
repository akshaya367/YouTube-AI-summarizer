'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Link2, Loader2 } from 'lucide-react';

export default function VideoForm() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            router.push(`/video/${data.videoId}`);
        } catch (err: any) {
            alert(err.message);
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mt-8">
            <div className="relative flex items-center">
                <div className="absolute left-4 text-gray-400">
                    <Link2 size={20} />
                </div>
                <input
                    type="url"
                    required
                    placeholder="Paste YouTube Video URL here..."
                    className="w-full pl-12 pr-32 py-4 bg-gray-900/50 border border-gray-800 rounded-2xl focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 outline-none backdrop-blur-sm transition-all"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'Analyze'}
                </button>
            </div>
        </form>
    );
}
