import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message, UserType } from './types';
import { createChatSession } from './services/geminiService';
import ChatMessage from './components/ChatMessage';
import { Chat } from '@google/genai';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const initializeChat = useCallback(async () => {
    setIsChatLoading(true);
    setMessages([]); // Clear previous messages for a fresh start
    try {
      const response = await fetch('./data/knowledge.txt');
      if (!response.ok) {
        throw new Error('Failed to load knowledge base file.');
      }
      const text = await response.text();
      chatSessionRef.current = createChatSession(text);
      setMessages([
        {
          id: 'initial-message',
          text: 'أهلاً بيك! أنا نونو، مساعدك الذكي في أكاديمية نور للجمباز. أنا هنا عشان أجاوب على استفساراتك وأساعدك. خد بالك، أنا لسه بتعلم وممكن أغلط ساعات، بس هعمل كل اللي أقدر عليه عشان أساعدك صح!',
          sender: UserType.Bot,
        },
      ]);
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

  useEffect(() => {
    initializeChat();
  }, [initializeChat]);


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy URL: ', err);
    });
  }, []);

  const handleNewChat = useCallback(() => {
    initializeChat();
  }, [initializeChat]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading || isChatLoading || !chatSessionRef.current) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: userInput,
      sender: UserType.User,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    const currentInput = userInput;
    setUserInput('');
    setIsLoading(true);

    try {
      const chat = chatSessionRef.current;
      const response = await chat.sendMessage({ message: currentInput });

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: response.text,
        sender: UserType.Bot,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error getting answer from Gemini:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: 'عذراً، حدث خطأ ما. الرجاء المحاولة مرة أخرى.',
        sender: UserType.Bot,
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [userInput, isLoading, isChatLoading]);

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans" style={{ direction: 'rtl' }}>
      <header className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-4 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2">
            <button
            onClick={handleShare}
            disabled={isCopied}
            className="p-2 rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white transition-all"
            aria-label={isCopied ? "تم نسخ الرابط" : "مشاركة المساعد"}
            >
            {isCopied ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.536a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
            )}
            </button>
            <button
                onClick={handleNewChat}
                disabled={isChatLoading || isLoading}
                className="p-2 rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="بدء محادثة جديدة"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </button>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold">نونو مساعد اكاديمية نور للجمباز الذكي</h1>
          <p className="text-sm opacity-90">متاح للمساعدة في استفساراتكم</p>
        </div>
        <div className="w-24 h-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6" style={{
        backgroundColor: '#f9fafb',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z' fill='%23a78bfa' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`
      }}>
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-800 rounded-lg rounded-br-none p-3 max-w-lg">
                  <div className="flex items-center space-x-2 space-x-reverse">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
              </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </main>

      <footer className="bg-white border-t border-gray-200 p-4 shadow-inner">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3 space-x-reverse">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={isChatLoading ? "جاري تهيئة المساعد..." : "اكتب سؤالك هنا..."}
            className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
            disabled={isLoading || isChatLoading}
            aria-label="Chat input"
          />
          <button
            type="submit"
            disabled={isLoading || !userInput.trim() || isChatLoading}
            className="bg-purple-600 text-white rounded-full p-3 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-180" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </footer>
    </div>
  );
};

export default App;
