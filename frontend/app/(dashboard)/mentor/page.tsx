'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { aiAPI } from '@/lib/api';
import { Send, Loader2, Plus, Mic, MicOff, Sparkles, MessageSquare, Clock } from 'lucide-react';

interface Message { role: 'user' | 'assistant'; content: string; timestamp?: Date; }
interface Session { sessionId: string; subject?: string; preview: string; messageCount: number; isBookmarked: boolean; createdAt: string; }

const QUICK_PROMPTS = [
  'Class 7 se IAS tak roadmap',
  'French Revolution - UPSC angle',
  'Constitution Preamble analysis',
  'UPSC Mains answer writing',
  'Maurya Empire relevance',
  'GDP vs GNP vs NNP',
  'Climate Change - Mains questions',
  'Fundamental Rights vs Directive Principles',
  'Daily study schedule',
  'Current Affairs in answers',
];

const SUBJECTS = ['General', 'History', 'Geography', 'Polity', 'Economics', 'Science', 'Environment', 'Current Affairs', 'Ethics', 'Essay'];

export default function MentorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `**Namaste Sakshi!** 🇮🇳

Main hoon **Sakshi's Mentor** — tera dedicated IAS preparation system. Aaj se tera coaching centre band, kyunki jo guidance yahan milegi woh kisi bhi institute se behtar hai.

**Tera Mission:** Class 7 → IAS Officer
**Teri Strength:** Sahi guidance + Daily discipline
**Mera Kaam:** Har step pe saath rehna

---

**Main in areas mein teri help karunga:**

📚 **Foundation Building** — NCERT Class 6-12 complete mastery
🏛️ **Core Subjects** — History, Geography, Polity, Economics, Science
📰 **Current Affairs** — Daily news ka UPSC angle
✍️ **Answer Writing** — Mains ke liye structured writing
🎤 **Interview Prep** — IAS Personality Test simulation
🗺️ **Study Roadmap** — Class 7 se IAS tak ka complete plan
💪 **Mindset Coaching** — Discipline, consistency, resilience

---

Sakshi, **IAS banana ek marathon hai, sprint nahi.** Aaj ka pehla sawaal pooch — chaahe school ka ho ya UPSC ka. Shuruat yahan se hoti hai. 🎯`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [subject, setSubject] = useState('General');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showSessions, setShowSessions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const loadSessions = useCallback(async () => {
    try {
      const res = await aiAPI.sessions();
      setSessions(res.data);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { loadSessions(); }, [loadSessions]);

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg, timestamp: new Date() }]);
    setLoading(true);
    try {
      const res = await aiAPI.chat({ message: msg, sessionId, subject: subject.toLowerCase() });
      setSessionId(res.data.sessionId);
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply, timestamp: new Date() }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Oops! Thoda technical issue aa gaya. Please try again! 🙏', timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => {
    setSessionId(null);
    setMessages([{
      role: 'assistant',
      content: `**Naya Session Shuru 🎯**\n\nSakshi, main ready hoon. Aaj kya seekhna hai — NCERT concept, current affairs analysis, answer writing, ya study planning? Batao, shuru karte hain.`,
      timestamp: new Date()
    }]);
    loadSessions();
  };

  const loadSession = async (sid: string) => {
    try {
      const res = await aiAPI.session(sid);
      setSessionId(sid);
      setMessages(res.data.messages);
      setShowSessions(false);
    } catch { /* silent */ }
  };

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice not supported in this browser. Try Chrome!');
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.continuous = false;
    recognition.onresult = (e) => { setInput(e.results[0][0].transcript); setIsListening(false); };
    recognition.onend = () => setIsListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const renderMessage = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^## (.*$)/gm, '<h3 style="color:#a78bfa;font-size:16px;font-weight:700;margin:12px 0 6px">$1</h3>')
      .replace(/^### (.*$)/gm, '<h4 style="color:#f5c842;font-size:14px;font-weight:600;margin:8px 0 4px">$1</h4>')
      .replace(/^- (.*$)/gm, '<li style="margin:3px 0;color:#c0c0d0">$1</li>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="flex h-[calc(100vh-48px)] gap-0 max-w-7xl">
      {/* Sidebar */}
      <div className={`${showSessions ? 'flex' : 'hidden'} md:flex flex-col w-64 bg-gradient-to-b from-[#0f0f1a] to-[#1a1a28] border-r border-[#2a2a3d] flex-shrink-0`}>
        <div className="p-4 border-b border-[#2a2a3d]">
          <button onClick={startNewChat} className="w-full bg-gradient-to-r from-[#6c63ff] to-[#a78bfa] hover:shadow-lg hover:shadow-[#6c63ff]/30 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all">
            <Plus size={16} /> New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-[#8888aa]">
              <MessageSquare size={28} className="mx-auto mb-2 opacity-40" />
              <p className="text-xs">No chats yet</p>
            </div>
          ) : (
            sessions.map(s => (
              <button key={s.sessionId} onClick={() => loadSession(s.sessionId)}
                className={`w-full text-left p-3 rounded-lg transition-all text-xs ${sessionId === s.sessionId ? 'bg-[#6c63ff]/20 border border-[#6c63ff]/50' : 'hover:bg-[#2a2a3d] border border-transparent'}`}>
                <p className="text-[#c0c0d0] font-medium truncate mb-1">{s.preview}</p>
                <div className="flex items-center gap-1 text-[#555]">
                  <Clock size={10} />
                  <span>{s.messageCount} messages</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col bg-[#0f0f1a]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#2a2a3d] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setShowSessions(!showSessions)} className="md:hidden text-[#8888aa]">
              <MessageSquare size={20} />
            </button>
            
            {/* AI Mentor Profile Picture */}
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80"
                alt="Sakshi's Mentor"
                className="w-12 h-12 rounded-full object-cover border-2 border-[#6c63ff] shadow-lg shadow-[#6c63ff]/30"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0f0f1a]"></div>
            </div>
            
            <div>
              <div className="font-bold text-sm">Sakshi's Mentor</div>
              <div className="text-xs text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" /> Online 24/7
              </div>
            </div>
          </div>
          <select value={subject} onChange={e => setSubject(e.target.value)} className="bg-[#1a1a28] border border-[#2a2a3d] text-[#c0c0d0] text-xs py-2 px-3 rounded-lg focus:border-[#6c63ff] outline-none">
            {SUBJECTS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="flex items-start gap-3 max-w-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&q=80"
                    alt="Mentor"
                    className="w-8 h-8 rounded-full object-cover border border-[#6c63ff] flex-shrink-0 mt-1"
                  />
                  <div className="max-w-xl">
                    <div className="bg-[#1a1a28] text-[#c0c0d0] border border-[#2a2a3d] px-4 py-3 rounded-lg">
                      <div
                        className="text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: renderMessage(msg.content) }}
                      />
                    </div>
                    {msg.timestamp && (
                      <div className="text-xs text-[#8888aa] mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {msg.role === 'user' && (
                <div className="max-w-xl text-right">
                  <div className="bg-[#6c63ff] text-white px-4 py-3 rounded-lg inline-block">
                    <div
                      className="text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: renderMessage(msg.content) }}
                    />
                  </div>
                  {msg.timestamp && (
                    <div className="text-xs text-[#8888aa] mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex justify-start gap-3">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&q=80"
                alt="Mentor"
                className="w-8 h-8 rounded-full object-cover border border-[#6c63ff] flex-shrink-0 mt-1"
              />
              <div className="bg-[#1a1a28] border border-[#2a2a3d] px-4 py-3 rounded-lg flex items-center gap-2">
                <Loader2 size={14} className="spinner text-[#6c63ff]" />
                <span className="text-sm text-[#8888aa]">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="px-6 py-4 border-t border-[#2a2a3d] overflow-x-auto">
          <div className="flex gap-2 pb-1">
            {QUICK_PROMPTS.map(p => (
              <button key={p} onClick={() => sendMessage(p)}
                className="flex-shrink-0 text-xs bg-[#1a1a28] hover:bg-[#2a2a3d] border border-[#2a2a3d] hover:border-[#6c63ff] text-[#8888aa] hover:text-[#a78bfa] px-3 py-2 rounded-lg transition-all">
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-[#2a2a3d]">
          <div className="flex gap-3">
            <button onClick={toggleVoice} className={`p-2.5 rounded-lg border transition-all flex-shrink-0 ${isListening ? 'bg-red-500/20 border-red-500 text-red-400' : 'border-[#2a2a3d] text-[#8888aa] hover:border-[#6c63ff] hover:text-[#6c63ff]'}`}>
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <input
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              className="flex-1 bg-[#1a1a28] border border-[#2a2a3d] text-[#c0c0d0] text-sm py-2.5 px-4 rounded-lg focus:border-[#6c63ff] outline-none transition-all" 
              placeholder="Koi bhi sawaal pooch..."
            />
            <button onClick={() => sendMessage()} disabled={!input.trim() || loading} className="bg-gradient-to-r from-[#6c63ff] to-[#a78bfa] hover:shadow-lg hover:shadow-[#6c63ff]/30 text-white p-2.5 rounded-lg disabled:opacity-50 transition-all flex-shrink-0">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
