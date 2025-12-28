
import React, { useState, useRef, useEffect } from 'react';
import { analyzePlanWithGemini } from '../services/geminiService';
import { PlanningData } from '../types';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';

interface Props {
  data: PlanningData;
}

const AIAssistant: React.FC<Props> = ({ data }) => {
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    { role: 'ai', text: `Merhaba! ${data.date} tarihli planlama ile ilgili sorularınızı yanıtlayabilirim. Yönetim panelinden yaptığınız değişiklikler de dahil olmak üzere güncel verileri analiz ediyorum.` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const response = await analyzePlanWithGemini(userMsg, data);
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setLoading(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[500px]">
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-4 flex items-center gap-3">
        <div className="bg-white/10 p-2 rounded-lg">
          <Sparkles className="text-blue-300" size={20} />
        </div>
        <div>
          <h3 className="text-white font-bold">Akıllı Plan Asistanı</h3>
          <p className="text-blue-200 text-[10px] uppercase tracking-wider">Gemini 3 Flash Destekli</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${m.role === 'ai' ? 'bg-blue-600' : 'bg-slate-700'}`}>
                {m.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div className={`p-3 rounded-2xl text-sm leading-relaxed ${m.role === 'ai' ? 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700' : 'bg-blue-700 text-white rounded-tr-none shadow-lg'}`}>
                {m.text.split('\n').map((line, idx) => (
                  <p key={idx} className={idx > 0 ? "mt-1" : ""}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none flex items-center gap-3 border border-slate-700">
              <Loader2 className="animate-spin text-blue-400" size={16} />
              <span className="text-xs text-slate-400">Yapay zeka analiz ediyor...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-800/50 border-t border-slate-700">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Plan hakkında bir şeyler sor..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white placeholder-slate-500"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-400 hover:text-blue-300 disabled:opacity-50 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
