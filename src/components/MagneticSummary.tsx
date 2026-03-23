'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface MagneticSummaryProps {
    content: string;
}

export default function MagneticSummary({ content }: MagneticSummaryProps) {
    if (!content) return null;

    // Remove the prefix if it exists in the string
    const displayContent = content.replace(/🔥 \[Magnetic Summary\]\s*/i, '').replace(/["']/g, '');

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-600/10 via-emerald-600/5 to-purple-600/10 border border-white/10 p-8 rounded-3xl relative overflow-hidden group mb-12 shadow-2xl backdrop-blur-sm"
        >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Sparkles size={80} />
            </div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
                        <Sparkles className="text-blue-400" size={18} />
                    </div>
                    <h2 className="text-sm font-bold tracking-widest text-blue-400 uppercase">Magnetic Summary</h2>
                </div>
                
                <p className="text-xl md:text-2xl text-gray-100 leading-relaxed font-semibold italic tracking-tight">
                    {displayContent}
                </p>
                
                <div className="mt-6 flex items-center gap-4 text-xs font-medium text-gray-500">
                    <span className="flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-blue-500" /> AI Generated
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-emerald-500" /> High Precision
                    </span>
                </div>
            </div>

            {/* Subtle light effect */}
            <div className="absolute -inset-x-20 -top-20 h-40 bg-white/5 blur-3xl rounded-full transform rotate-12 pointer-events-none" />
        </motion.div>
    );
}
