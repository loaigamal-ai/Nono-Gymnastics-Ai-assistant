<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>نونو مساعد اكاديمية نور للجمباز الذكي</title>
    
    <!-- SEO & Social Media Meta Tags -->
    <meta name="description" content="نونو، مساعد ذكي لأكاديمية نور للجمباز. يساعدك في الإجابة على استفساراتك حول الفصول، المواعيد، التكاليف، والمزيد باللغة العربية." />
    <meta name="theme-color" content="#6d28d9">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="نونو | مساعد أكاديمية نور للجمباز الذكي">
    <meta property="og:description" content="نونو، مساعد ذكي لأكاديمية نور للجمباز. يساعدك في الإجابة على استفساراتك حول الفصول، المواعيد، التكاليف، والمزيد باللغة العربية.">
    <meta property="og:image" content="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='200' height='200'%3e%3ccircle cx='50' cy='50' r='48' fill='%236d28d9' stroke='%23fff' stroke-width='4'/%3e%3ctext x='50' y='68' font-family='Arial, sans-serif' font-size='50' fill='white' text-anchor='middle' font-weight='bold'%3eN%3c/text%3e%3cpath d='M 20 40 Q 50 20, 80 40' stroke='white' stroke-width='4' fill='none' stroke-linecap='round' /%3e%3c/svg%3e">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:title" content="نونو | مساعد أكاديمية نور للجمباز الذكي">
    <meta property="twitter:description" content="نونو، مساعد ذكي لأكاديمية نور للجمباز. يساعدك في الإجابة على استفساراتك حول الفصول، المواعيد، التكاليف، والمزيد باللغة العربية.">
    <meta property="twitter:image" content="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='200' height='200'%3e%3ccircle cx='50' cy='50' r='48' fill='%236d28d9' stroke='%23fff' stroke-width='4'/%3e%3ctext x='50' y='68' font-family='Arial, sans-serif' font-size='50' fill='white' text-anchor='middle' font-weight='bold'%3eN%3c/text%3e%3cpath d='M 20 40 Q 50 20, 80 40' stroke='white' stroke-width='4' fill='none' stroke-linecap='round' /%3e%3c/svg%3e">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- React & Babel -->
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: system-ui, -apple-system, sans-serif; }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
    </style>
</head>
<body class="bg-gray-100">
    <div id="root"></div>

    <script type="text/babel">
        const { useState, useEffect, useRef, useCallback } = React;

        // أنواع البيانات الأساسية
        const UserType = {
            User: 'user',
            Bot: 'bot'
        };

        // مكون رسالة المحادثة
        const ChatMessage = ({ message }) => {
            const isBot = message.sender === UserType.Bot;
            
            return React.createElement('div', {
                className: `flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`
            },
                React.createElement('div', {
                    className: `max-w-lg px-4 py-3 rounded-lg ${
                        isBot 
                            ? 'bg-white text-gray-800 rounded-bl-none border border-gray-200 shadow-sm' 
                            : 'bg-purple-600 text-white rounded-br-none'
                    }`
                },
                    React.createElement('div', { className: 'flex items-start space-x-3 space-x-reverse' },
                        isBot && React.createElement('div', {
                            className: 'w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0'
                        }, 'ن'),
                        React.createElement('div', { className: 'flex-1' },
                            React.createElement('p', { className: 'text-sm leading-relaxed whitespace-pre-line' }, 
                                message.text
                            )
                        ),
                        !isBot && React.createElement('div', {
                            className: 'w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0'
                        }, 'أنت')
                    )
                )
            );
        };

        // الخدمات الأساسية
        const createChatSession = (knowledgeText) => {
            return {
                sendMessage: async ({ message }) => {
                    // محاكاة للرد - في الواقع هتتواصل مع Gemini API
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            resolve({
                                text: `هذا رد تجريبي على: "${message}". سيتم توصيله بـ Gemini API لاحقاً.`
                            });
                        }, 1000);
                    });
                }
            };
        };

        // المكون الرئيسي
        const App = () => {
            const [messages, setMessages] = useState([]);
            const [userInput, setUserInput] = useState('');
            const [isLoading, setIsLoading] = useState(false);
            const [isChatLoading, setIsChatLoading] = useState(true);
            const [isCopied, setIsCopied] = useState(false);
            const chatSessionRef = useRef(null);
            const chatEndRef = useRef(null);

            const initializeChat = useCallback(async () => {
                setIsChatLoading(true);
                setMessages([]);
                try {
                    const response = await fetch('./data/knowledge.txt');
                    if (!response.ok) throw new Error('Failed to load knowledge base file.');
                    const text = await response.text();
                    chatSessionRef.current = createChatSession(text);
                    setMessages([{
                        id: 'initial-message',
                        text: 'أهلاً بيك! أنا نونو، مساعدك الذكي في أكاديمية نور للجمباز. أنا هنا عشان أجاوب على استفساراتك وأساعدك. خد بالك، أنا لسه بتعلم وممكن أغلط ساعات، بس هعمل كل اللي أقدر عليه عشان أساعدك صح!',
                        sender: UserType.Bot,
                    }]);
                } catch (error) {
                    console.error('Error initializing chat session:', error);
                    setMessages(prev => [...prev, {
                        id: 'kb-error',
                        text: 'عذراً، حدث خطأ أثناء تهيئة المحادثة. قد لا أتمكن من الإجابة على أسئلتك بدقة.',
                        sender: UserType.Bot
                    }]);
                } finally {
                    setIsChatLoading(false);
                }
            }, []);

            useEffect(() => { initializeChat(); }, [initializeChat]);
            useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

            const handleShare = useCallback(() => {
                navigator.clipboard.writeText(window.location.href).then(() => {
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                }).catch(err => console.error('Failed to copy URL: ', err));
            }, []);

            const handleNewChat = useCallback(() => { initializeChat(); }, [initializeChat]);

            const handleSubmit = useCallback(async (e) => {
                e.preventDefault();
                if (!userInput.trim() || isLoading || isChatLoading || !chatSessionRef.current) return;

                const userMessage = { id: `user-${Date.now()}`, text: userInput, sender: UserType.User };
                setMessages(prev => [...prev, userMessage]);
                const currentInput = userInput;
                setUserInput('');
                setIsLoading(true);

                try {
                    const response = await chatSessionRef.current.sendMessage({ message: currentInput });
                    const botMessage = { id: `bot-${Date.now()}`, text: response.text, sender: UserType.Bot };
                    setMessages(prev => [...prev, botMessage]);
                } catch (error) {
                    console.error('Error getting answer:', error);
                    const errorMessage = { id: `error-${Date.now()}`, text: 'عذراً، حدث خطأ ما. الرجاء المحاولة مرة أخرى.', sender: UserType.Bot };
                    setMessages(prev => [...prev, errorMessage]);
                } finally {
                    setIsLoading(false);
                }
            }, [userInput, isLoading, isChatLoading]);

            return React.createElement('div', { 
                className: 'flex flex-col h-screen bg-gray-100 font-sans', 
                style: { direction: 'rtl' } 
            },
                [
                    // Header
                    React.createElement('header', {
                        key: 'header',
                        className: 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-4 shadow-md flex items-center justify-between'
                    },
                        [
                            React.createElement('div', { key: 'buttons', className: 'flex items-center gap-2' },
                                [
                                    React.createElement('button', {
                                        key: 'share',
                                        onClick: handleShare,
                                        disabled: isCopied,
                                        className: 'p-2 rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white transition-all',
                                        'aria-label': isCopied ? "تم نسخ الرابط" : "مشاركة المساعد"
                                    }, isCopied ? 
                                        React.createElement('svg', { xmlns: 'http://www.w3.org/2000/svg', className: 'h-6 w-6', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2 },
                                            React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M5 13l4 4L19 7' })
                                        ) :
                                        React.createElement('svg', { xmlns: 'http://www.w3.org/2000/svg', className: 'h-6 w-6', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2 },
                                            React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.536a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' })
                                        )
                                    ),
                                    React.createElement('button', {
                                        key: 'new-chat',
                                        onClick: handleNewChat,
                                        disabled: isChatLoading || isLoading,
                                        className: 'p-2 rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white transition-all disabled:opacity-50 disabled:cursor-not-allowed',
                                        'aria-label': "بدء محادثة جديدة"
                                    }, React.createElement('svg', { xmlns: 'http://www.w3.org/2000/svg', className: 'h-6 w-6', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2 },
                                        React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M12 6v6m0 0v6m0-6h6m-6 0H6' })
                                    ))
                                ]
                            ),
                            React.createElement('div', { key: 'title', className: 'text-center' },
                                [
                                    React.createElement('h1', { key: 'h1', className: 'text-2xl font-bold' }, 'نونو مساعد اكاديمية نور للجمباز الذكي'),
                                    React.createElement('p', { key: 'p', className: 'text-sm opacity-90' }, 'متاح للمساعدة في استفساراتكم')
                                ]
                            ),
                            React.createElement('div', { key: 'spacer', className: 'w-24 h-10' })
                        ]
                    ),

                    // Main Content
                    React.createElement('main', {
                        key: 'main',
                        className: 'flex-1 overflow-y-auto p-4 md:p-6 space-y-6',
                        style: {
                            backgroundColor: '#f9fafb',
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z' fill='%23a78bfa' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`
                        }
                    },
                        [
                            ...messages.map(msg => 
                                React.createElement(ChatMessage, { key: msg.id, message: msg })
                            ),
                            isLoading && React.createElement('div', { key: 'loading', className: 'flex justify-start' },
                                React.createElement('div', { className: 'bg-gray-200 text-gray-800 rounded-lg rounded-br-none p-3 max-w-lg' },
                                    React.createElement('div', { className: 'flex items-center space-x-2 space-x-reverse' },
                                        [
                                            React.createElement('div', { key: '1', className: 'w-2 h-2 bg-purple-500 rounded-full animate-pulse' }),
                                            React.createElement('div', { key: '2', className: 'w-2 h-2 bg-purple-500 rounded-full animate-pulse', style: {animationDelay: '0.2s'} }),
                                            React.createElement('div', { key: '3', className: 'w-2 h-2 bg-purple-500 rounded-full animate-pulse', style: {animationDelay: '0.4s'} })
                                        ]
                                    )
                                )
                            ),
                            React.createElement('div', { key: 'end', ref: chatEndRef })
                        ]
                    ),

                    // Footer
                    React.createElement('footer', {
                        key: 'footer',
                        className: 'bg-white border-t border-gray-200 p-4 shadow-inner'
                    },
                        React.createElement('form', { onSubmit: handleSubmit, className: 'flex items-center space-x-3 space-x-reverse' },
                            [
                                React.createElement('input', {
                                    key: 'input',
                                    type: 'text',
                                    value: userInput,
                                    onChange: (e) => setUserInput(e.target.value),
                                    placeholder: isChatLoading ? "جاري تهيئة المساعد..." : "اكتب سؤالك هنا...",
                                    className: 'flex-1 w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow',
                                    disabled: isLoading || isChatLoading,
                                    'aria-label': "Chat input"
                                }),
                                React.createElement('button', {
                                    key: 'button',
                                    type: 'submit',
                                    disabled: isLoading || !userInput.trim() || isChatLoading,
                                    className: 'bg-purple-600 text-white rounded-full p-3 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105',
                                    'aria-label': "Send message"
                                }, React.createElement('svg', { xmlns: 'http://www.w3.org/2000/svg', className: 'h-6 w-6 transform rotate-180', viewBox: '0 0 20 20', fill: 'currentColor' },
                                    React.createElement('path', { d: 'M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z' })
                                ))
                            ]
                        )
                    )
                ]
            );
        };

        // render التطبيق
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(React.createElement(App));
    </script>
</body>
</html>
