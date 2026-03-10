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
    };
}

export default function SummaryTabs({ summary }: SummaryTabsProps) {
    const [activeTab, setActiveTab] = useState<'short' | 'detailed' | 'notes'>('short');
    const [copied, setCopied] = useState(false);

    const tabs = [
        { id: 'short', label: 'Short Summary' },
        { id: 'detailed', label: 'Detailed Summary' },
        { id: 'notes', label: 'Study Notes' },
    ];

    const getContent = () => {
        switch (activeTab) {
            case 'short':
                return `# Quick Summary\n${summary.short_summary}\n\n# Key Takeaways\n${summary.key_takeaways}\n\n# Bullet Points\n${summary.bullet_points}`;
            case 'detailed':
                return `# Detailed Explanation\n${summary.detailed_summary}`;
            case 'notes':
                return `# Study Notes\n${summary.study_notes}`;
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
        // Basic download as txt file for now. jspdf can be implemented later.
        const element = document.createElement("a");
        const file = new Blob([currentContent], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "summary.txt";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    };

    return (
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden mt-8">
            <div className="flex justify-between items-center border-b border-gray-800 p-2 overflow-x-auto">
                <div className="flex space-x-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-blue-600/20 text-blue-400'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="flex space-x-2 pr-2">
                    <button onClick={handleCopy} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors" title="Copy text">
                        {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                    </button>
                    <button onClick={handleDownload} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors" title="Download as text">
                        <Download size={18} />
                    </button>
                </div>
            </div>

            <div className="p-6 prose prose-invert max-w-none">
                <ReactMarkdown>{currentContent}</ReactMarkdown>
            </div>
        </div>
    );
}
