import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Volume2, Square } from 'lucide-react';
import { playSwahiliTTS, stopSwahiliTTS } from '../lib/tts';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Jambo! I am your Swahili guide. Ask me how to say something, or let\'s practice a conversation!',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [loadingAudioId, setLoadingAudioId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleSound = async (msgId: string, text: string) => {
    if (playingMessageId === msgId || loadingAudioId === msgId) {
      stopSwahiliTTS();
      setPlayingMessageId(null);
      setLoadingAudioId(null);
    } else {
      setLoadingAudioId(msgId);
      setPlayingMessageId(null);
      try {
        await playSwahiliTTS(text, () => {
          setPlayingMessageId((current) => current === msgId ? null : current);
        });
        setLoadingAudioId(null);
        setPlayingMessageId(msgId);
      } catch (err) {
        console.error(err);
        setLoadingAudioId(null);
        setPlayingMessageId(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({ role: m.role, content: m.content }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMsg.content, history }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Samahani (Sorry), I am having trouble connecting right now. Please try again later.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)]">
      <div className="pt-2 mb-4">
        <h2 className="text-2xl font-serif font-bold text-slate-800">Language Partner</h2>
        <p className="text-slate-500 text-sm mt-1">Practice Swahili with your AI guide.</p>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-4 pb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[85%] ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user'
                  ? 'bg-swahili-orange text-white'
                  : 'bg-safari-green text-white'
              }`}
            >
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            
            <div
              className={`p-4 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-swahili-orange text-white rounded-tr-sm'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              {msg.role === 'assistant' && (
                <button
                  onClick={() => toggleSound(msg.id, msg.content)}
                  className={`mt-3 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors active:scale-95 ${
                    playingMessageId === msg.id || loadingAudioId === msg.id
                      ? 'text-red-700 bg-red-50 hover:bg-red-100' 
                      : 'text-safari-green hover:text-green-700 bg-green-50'
                  }`}
                  disabled={loadingAudioId === msg.id && playingMessageId === msg.id /* just checking, actually not disabled so you can cancel */}
                >
                  {loadingAudioId === msg.id ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Loading...
                    </>
                  ) : playingMessageId === msg.id ? (
                    <>
                      <Square size={14} className="fill-current" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Volume2 size={14} />
                      Listen
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 max-w-[85%] mr-auto">
            <div className="w-8 h-8 rounded-full bg-safari-green text-white flex items-center justify-center shrink-0">
              <Bot size={16} />
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 rounded-tl-sm shadow-sm flex items-center gap-2">
              <Loader2 size={16} className="text-safari-green animate-spin" />
              <span className="text-xs text-slate-500 font-medium">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="mt-auto relative shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask how to say..."
          className="w-full bg-white border-2 border-slate-200 rounded-2xl py-4 pl-4 pr-14 text-sm focus:outline-none focus:border-swahili-orange focus:ring-0 transition-colors shadow-sm"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-swahili-orange text-white rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:hover:bg-swahili-orange transition-colors"
        >
          <Send size={18} className={input.trim() && !isLoading ? 'ml-0.5' : ''} />
        </button>
      </form>
    </div>
  );
}
