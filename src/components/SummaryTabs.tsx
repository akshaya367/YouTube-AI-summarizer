'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Download, Copy, Check, Share2 } from 'lucide-react';

interface SummaryTabsProps {
    summary: {
        short_summary: string;
        detailed_summary: string;
        bullet_points: string;
        key_takeaways: string;
        study_notes: string;
        sentiment?: string;
        learning_path?: string;
    };
}

export default function SummaryTabs({ summary }: SummaryTabsProps) {
    const [activeTab, setActiveTab] = useState<'mastery' | 'deep' | 'timeline' | 'action'>('mastery');
    const [copied, setCopied] = useState(false);

    const tabs = [
        { id: 'mastery', label: '🔥 Mastery' },
        { id: 'deep', label: '🧠 Deep Dive' },
        { id: 'timeline', label: '⏱ Timeline' },
        { id: 'action', label: '🚀 Take Action' },
    ];

    const getContent = () => {
        switch (activeTab) {
            case 'mastery':
                return `## Magnetic Summary\n${summary.short_summary}\n\n## 📌 Key Insights\n${summary.bullet_points}\n\n> 💡 **One Powerful Insight:** ${summary.sentiment || ''}`;
            case 'deep':
                return `## Deep Understanding\n${summary.detailed_summary}`;
            case 'timeline':
                return `## Key Moments\n${summary.study_notes}`;
            case 'action':
                return `## Actionable Takeaways\n${summary.key_takeaways}\n\n## 🎯 Strategic Roadmap\n${summary.learning_path || ''}`;
            default:
                return '';
        }
    };

    const currentContent = getContent();

    const handleCopy = async () => {
        await navigator.clipboard.writeText(currentContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([currentContent], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "summary.txt";
        document.body.appendChild(element);
        element.click();
    };

    return (
        <div className="bg-gray-950/50 rounded-3xl border border-white/5 overflow-hidden mt-8 backdrop-blur-3xl shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-white/5 p-4 overflow-x-auto">
                <div className="flex space-x-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`relative px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all whitespace-nowrap overflow-hidden ${activeTab === tab.id
                                    ? 'text-white'
                                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                }`}
                        >
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-emerald-600/20 border border-white/10"
                                    style={{ borderRadius: 16 }}
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{tab.label}</span>
                        </button>
                    ))}
                </div>
                <div className="flex space-x-2 pr-2">
                    <button onClick={handleCopy} className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/5" title="Copy text">
                        {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                    </button>
                    <button onClick={handleDownload} className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/5" title="Download">
                        <Download size={18} />
                    </button>
                </div>
            </div>

            <div className="p-8 prose prose-invert max-w-none">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                        <ReactMarkdown>{currentContent}</ReactMarkdown>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
