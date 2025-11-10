
import React, { useState, useCallback } from 'react';
import { enhanceTextWithGemini } from './services/geminiService';

const SparkleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.25c.42 0 .8.3 1.01.68l.38 1.04-.3 1.08c-.2.72-.7 1.22-1.42 1.42l-1.08.3-1.04-.38A1.3 1.3 0 0 1 8.25 5c0-.42.3-.8.68-1.01l1.04-.38.3-1.08c.08-.27.26-.48.52-.6zM19.5 9a1.5 1.5 0 0 0-1.06 2.56l-3.38 3.38 3.38 3.38a1.5 1.5 0 1 0 2.12-2.12l-2.32-2.32 2.32-2.32A1.5 1.5 0 0 0 19.5 9zM4.5 9a1.5 1.5 0 0 1 1.06 2.56l2.32 2.32-2.32 2.32a1.5 1.5 0 1 1-2.12-2.12l3.38-3.38-3.38-3.38A1.5 1.5 0 0 1 4.5 9zm4.74 3.44c-.26-.08-.48-.26-.6-.52l-.3-1.08-1.04.38c-.38.14-.68.5-.68 1.01s.3.8.68 1.01l1.04.38.3 1.08c.08.27.26.48.52.6l1.08.3.38-1.04c.14-.38.5-.68 1.01-.68s.8.3 1.01.68l.38 1.04 1.08-.3c.27-.08.48-.26.6-.52l.3-1.08 1.04-.38c.38-.14.68-.5.68-1.01s-.3-.8-.68-1.01l-1.04-.38-.3-1.08c-.08-.27-.26-.48-.52-.6l-1.08-.3-.38 1.04c-.14.38-.5.68-1.01.68s-.8-.3-1.01-.68l-.38-1.04-1.08.3c-.27.08-.48.26-.6.52l-.3 1.08-1.04.38c-.38.14-.68.5-.68 1.01z" />
    </svg>
);

const SpinnerIcon: React.FC = () => (
    <svg className="animate-spin -ms-1 me-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);


export default function App() {
    const [userInput, setUserInput] = useState('');
    const [enhancedText, setEnhancedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    const handleSubmit = useCallback(async (event: React.FormEvent) => {
        event.preventDefault();
        if (!userInput || isLoading) return;

        setIsLoading(true);
        setError(null);
        setEnhancedText('');
        setIsCopied(false);

        try {
            const result = await enhanceTextWithGemini(userInput);
            setEnhancedText(result);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [userInput, isLoading]);

    const handleCopy = useCallback(() => {
        if (enhancedText) {
            navigator.clipboard.writeText(enhancedText);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2500);
        }
    }, [enhancedText]);

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
            <main className="w-full max-w-3xl mx-auto flex flex-col gap-8">
                <header className="text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-indigo-600 text-transparent bg-clip-text">
                        محسّن وصف الكود
                    </h1>
                    <p className="text-gray-400 mt-3 text-lg">
                        اكتب وصفًا للكود أو التطبيق، ودع الذكاء الاصطناعي يجعله أكثر احترافية ووضوحًا.
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                    <textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="مثال: دالة تأخذ مصفوفتين وتقوم بدمجهما معًا..."
                        className="w-full h-48 p-4 bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 resize-none placeholder-gray-500"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !userInput.trim()}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed disabled:text-gray-400 transition-all duration-200 shadow-lg shadow-indigo-600/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
                    >
                        {isLoading ? (
                            <>
                                <SpinnerIcon />
                                <span>جاري التحسين...</span>
                            </>
                        ) : (
                            <>
                                <SparkleIcon className="w-5 h-5" />
                                <span>تحسين النص</span>
                            </>
                        )}
                    </button>
                </form>

                {(enhancedText || error) && (
                    <section className="w-full p-1 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                        <div className="bg-gray-800 p-6 rounded-md">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-semibold text-gray-200">النتيجة</h2>
                                {enhancedText && !error && (
                                     <button
                                        onClick={handleCopy}
                                        className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors duration-200 ${
                                            isCopied 
                                                ? 'bg-green-600 text-white' 
                                                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                        }`}
                                    >
                                        {isCopied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                                        {isCopied ? 'تم النسخ!' : 'نسخ'}
                                    </button>
                                )}
                            </div>

                            {error && (
                                <div className="p-4 bg-red-900/50 border border-red-500 text-red-300 rounded-lg">
                                    <p className="font-semibold">خطأ</p>
                                    <p>{error}</p>
                                </div>
                            )}

                            {enhancedText && !error && (
                                <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap">
                                    {enhancedText}
                                </div>
                            )}
                        </div>
                    </section>
                )}
            </main>
             <footer className="w-full max-w-3xl mx-auto mt-12 text-center text-gray-500 text-sm">
                <p>مدعوم بواسطة Gemini API</p>
            </footer>
        </div>
    );
}
