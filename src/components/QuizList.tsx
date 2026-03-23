'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, XCircle, Award, RotateCcw } from 'lucide-react';

interface QuizQuestion {
    question: string;
    options: string[];
    answer: string;
}

export default function QuizList({ questions }: { questions: QuizQuestion[] }) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);

    const handleSelect = (option: string) => {
        if (selectedAnswer) return;
        setSelectedAnswer(option);
        if (option === questions[currentQuestion].answer) setScore(score + 1);
    };

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
        } else {
            setShowResult(true);
        }
    };

    const progress = ((currentQuestion + 1) / questions.length) * 100;

    if (showResult) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/[0.03] backdrop-blur-3xl rounded-[32px] border border-white/10 p-12 text-center mt-8 shadow-2xl relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Award size={120} />
                </div>
                
                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
                    <Award size={40} />
                </div>
                
                <h3 className="text-3xl font-black text-white mb-2 tracking-tight">Quiz Complete!</h3>
                <p className="text-gray-400 font-medium mb-8">You've mastered the core concepts of this video.</p>
                
                <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-10 tracking-tighter">
                    {score} / {questions.length}
                </div>
                
                <button
                    onClick={() => {
                        setCurrentQuestion(0);
                        setSelectedAnswer(null);
                        setShowResult(false);
                        setScore(0);
                    }}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all border border-white/10 active:scale-95"
                >
                    <RotateCcw size={20} /> Retake Assessment
                </button>
            </motion.div>
        );
    }

    const question = questions[currentQuestion];

    return (
        <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[32px] border border-white/10 p-8 mt-8 shadow-2xl relative overflow-hidden">
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
                />
            </div>

            <div className="flex justify-between items-center mb-10 text-xs font-black uppercase tracking-widest text-gray-500">
                <span className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white">{currentQuestion + 1}</span>
                    of {questions.length}
                </span>
                <span className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">Precision: {Math.round((score / (currentQuestion || 1)) * 100)}%</span>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >
                    <h3 className="text-2xl font-black text-white mb-10 leading-snug tracking-tight">
                        {question.question}
                    </h3>

                    <div className="space-y-4">
                        {question.options.map((option, idx) => {
                            const isSelected = selectedAnswer === option;
                            const isCorrect = option === question.answer;
                            
                            let buttonStyle = "bg-white/[0.02] border-white/5 text-gray-400 hover:bg-white/5 hover:border-white/10";
                            
                            if (selectedAnswer) {
                                if (isCorrect) buttonStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]";
                                else if (isSelected) buttonStyle = "bg-red-500/10 border-red-500 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.1)]";
                                else buttonStyle = "bg-transparent border-transparent text-gray-600 opacity-30 grayscale";
                            }

                            return (
                                <motion.button
                                    key={idx}
                                    whileHover={!selectedAnswer ? { x: 8 } : {}}
                                    onClick={() => handleSelect(option)}
                                    disabled={!!selectedAnswer}
                                    className={`w-full text-left p-6 rounded-2xl border transition-all flex justify-between items-center font-bold text-lg ${buttonStyle}`}
                                >
                                    <span className="flex items-center gap-4">
                                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs border ${isSelected ? 'border-current' : 'border-white/10 bg-white/5'}`}>
                                            {String.fromCharCode(65 + idx)}
                                        </span>
                                        {option}
                                    </span>
                                    <AnimatePresence>
                                        {selectedAnswer && isCorrect && (
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="shrink-0 text-emerald-500 bg-emerald-500/10 p-1.5 rounded-full">
                                                <CheckCircle2 size={24} />
                                            </motion.div>
                                        )}
                                        {selectedAnswer && isSelected && !isCorrect && (
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="shrink-0 text-red-500 bg-red-500/10 p-1.5 rounded-full">
                                                <XCircle size={24} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>
            </AnimatePresence>

            <AnimatePresence>
                {selectedAnswer && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-10 flex justify-end"
                    >
                        <button
                            onClick={nextQuestion}
                            className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black tracking-tight transition-all flex items-center gap-2 shadow-2xl shadow-blue-500/30 active:scale-95 group"
                        >
                            {currentQuestion < questions.length - 1 ? 'NEXT QUESTION' : 'CHECK FINAL SCORE'}
                            <ChevronRight className="group-hover:translate-x-1 transition-transform" size={24} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
