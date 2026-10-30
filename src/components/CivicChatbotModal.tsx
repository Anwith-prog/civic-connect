import React, { useState } from 'react';
import { Bot, Send, X, Sparkles, User, RefreshCw } from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../data/translations';

interface CivicChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: LanguageCode;
}

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
}

export const CivicChatbotModal: React.FC<CivicChatbotModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  if (!isOpen) return null;
  const t = translations[lang] || translations.en;

  const initialBotMessage: Record<LanguageCode, string> = {
    en: 'Hello! I am your CivicConnect Assistant. Ask me how to report potholes, request garbage pickup, find emergency numbers, or join community volunteer events.',
    kn: 'ನಮಸ್ಕಾರ! ನಾನು ಸಿವಿಕ್‌ಕನೆಕ್ಟ್ ಸಹಾಯಕ. ರಸ್ತೆ ಗುಂಡಿ, ಕಸ ವಿಲೇವಾರಿ, ಬೀದಿದೀಪ, ಅಥವಾ ತುರ್ತು ಸಹಾಯವಾಣಿ ಬಗ್ಗೆ ನೀವು ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಬಹುದು.',
    hi: 'नमस्ते! मैं आपका सिविककनेक्ट नागरिक सहायक हूँ। सड़क के गड्ढे, कचरा, बिजली या पानी से जुड़ी समस्याओं के बारे में पूछें।',
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: initialBotMessage[lang] || initialBotMessage.en,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: inputText,
    };

    setMessages((prev) => [...prev, userMsg]);
    const query = inputText;
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, lang }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text: data.reply || 'Thank you for reaching out. A civic specialist will review your request.',
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text: 'To report any issue, click the green "Report a New Problem" button on your top bar.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex w-96 max-w-[95vw] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-3.5 text-white">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold leading-tight">{t.aiAssistant}</h4>
            <span className="text-[10px] text-blue-100 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Online (Kannada / Hindi / English)
            </span>
          </div>
        </div>
        <button onClick={onClose} className="rounded-full p-1 hover:bg-white/20">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 max-h-80 overflow-y-auto p-4 space-y-3 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2 ${
              m.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.sender === 'bot' && (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                <Bot className="h-3 w-3" />
              </div>
            )}
            <div
              className={`rounded-2xl px-3.5 py-2.5 max-w-[80%] leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-xs'
                  : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 rounded-tl-xs'
              }`}
            >
              {m.text}
            </div>
            {m.sender === 'user' && (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                <User className="h-3 w-3" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs italic">
            <RefreshCw className="h-3 w-3 animate-spin" />
            <span>Civic Assistant typing...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask in English, ಕನ್ನಡ, or हिंदी..."
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:outline-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="rounded-xl bg-blue-600 px-3.5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
};
