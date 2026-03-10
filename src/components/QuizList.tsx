'use client';

import { useState } from 'react';
import { CheckCircle2, ChevronRight, XCircle } from 'lucide-react';

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

    if (showResult) {
        return (
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 text-center mt-8">
                <h3 className="text-2xl font-bold text-white mb-4">Quiz Completed!</h3>
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-6">
                    {score} / {questions.length}
                </div>
                <button
                    onClick={() => {
                        setCurrentQuestion(0);
                        setSelectedAnswer(null);
                        setShowResult(false);
                        setScore(0);
                    }}
                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors"
                >
                    Retake Quiz
                </button>
            </div>
        );
    }

    const question = questions[currentQuestion];

    return (
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 mt-8">
            <div className="flex justify-between items-center mb-6 text-sm font-medium text-gray-400">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span className="bg-gray-800 px-3 py-1 rounded-full text-blue-400">Score: {score}</span>
            </div>

            <h3 className="text-xl font-medium text-white mb-6 leading-relaxed">
                {question.question}
            </h3>

            <div className="space-y-3">
                {question.options.map((option, idx) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrect = option === question.answer;
                    let buttonClass = 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600';

                    if (selectedAnswer) {
                        if (isCorrect) buttonClass = 'bg-emerald-500/10 border-emerald-500 text-emerald-400';
                        else if (isSelected) buttonClass = 'bg-red-500/10 border-red-500 text-red-400';
                        else buttonClass = 'bg-gray-800 border-gray-800 text-gray-500 opacity-50';
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => handleSelect(option)}
                            disabled={!!selectedAnswer}
                            className={`w-full text-left p-4 rounded-xl border transition-all flex justify-between items-center ${buttonClass}`}
                        >
                            <span>{option}</span>
                            {selectedAnswer && isCorrect && <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />}
                            {selectedAnswer && isSelected && !isCorrect && <XCircle className="text-red-500 shrink-0" size={20} />}
                        </button>
                    );
                })}
            </div>

            {selectedAnswer && (
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={nextQuestion}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
                    >
                        {currentQuestion < questions.length - 1 ? 'Next Question' : 'View Results'}
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}
        </div>
    );
}
