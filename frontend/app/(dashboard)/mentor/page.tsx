'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { aiAPI } from '@/lib/api';
import { Send, Bot, Loader2, Bookmark, BookmarkCheck, Plus, Mic, MicOff, Sparkles } from 'lucide-react';

interface Message { role: 'user' | 'assistant'; content: string; timestamp?: Date; }
interface Session { sessionId: string; subject?: string; preview: string; messageCount: number; isBookmarked: boolean; createdAt: string; }

const QUICK_PROMPTS = [
  'Mujhe Class 7 se IAS tak ka complete roadmap do',
  'French Revolution explain karo UPSC angle ke saath',
  'Indian Constitution ki Preamble ka deep analysis karo',
  'UPSC Mains answer writing kaise karein?',
  'Maurya Empire aur uski UPSC relevance',
  'GDP, GNP aur NNP mein difference kya hai?',
  'Climate Change ke UPSC mains questions kaise solve karein?',
  'Fundamental Rights vs Directive Principles — difference aur importance',
  'Daily study schedule kaise banayein IAS ke liye?',
  'Current Affairs ko UPSC answer mein kaise use karein?',
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
    <div className="flex h-[calc(100vh-48px)] gap-4 max-w-7xl">
      {/* Sessions sidebar */}
      <div className={`${showSessions ? 'flex' : 'hidden'} md:flex flex-col w-64 glass rounded-xl overflow-hidden flex-shrink-0`}>
        <div className="p-4 border-b border-[#2a2a3d] flex items-center justify-between">
          <span className="font-semibold text-sm">Chat History</span>
          <button onClick={startNewChat} className="btn-primary text-xs py-1 px-3 flex items-center gap-1">
            <Plus size={12} /> New
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sessions.map(s => (
            <button key={s.sessionId} onClick={() => loadSession(s.sessionId)}
              className={`w-full text-left p-3 rounded-lg text-xs transition-all hover:bg-[#1a1a28] ${sessionId === s.sessionId ? 'bg-[#1a1a28] border border-[#6c63ff]/30' : ''}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="badge badge-primary text-xs">{s.subject || 'general'}</span>
                {s.isBookmarked && <BookmarkCheck size={12} className="text-[#f5c842]" />}
              </div>
              <p className="text-[#8888aa] truncate">{s.preview}</p>
              <p className="text-[#555] mt-1">{s.messageCount} messages</p>
            </button>
          ))}
          {sessions.length === 0 && <p className="text-[#8888aa] text-xs p-3">No previous chats yet</p>}
        </div>
      </div>

      {/* Main chat */}
      <div className="flex-1 flex flex-col glass rounded-xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#2a2a3d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowSessions(!showSessions)} className="md:hidden text-[#8888aa]">
              <Bot size={20} />
            </button>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6c63ff] to-[#a78bfa] flex items-center justify-center">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="font-bold text-sm">Sakshi's Mentor</div>
              <div className="text-xs text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" /> Online 24/7
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select value={subject} onChange={e => setSubject(e.target.value)} className="input-field text-xs py-1 px-2 w-auto">
              {SUBJECTS.map(s => <option key={s}>{s}</option>)}
            </select>
            <button onClick={startNewChat} className="btn-ghost text-xs py-1 px-3 flex items-center gap-1">
              <Plus size={12} /> New Chat
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6c63ff] to-[#a78bfa] flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles size={14} />
                </div>
              )}
              <div className={msg.role === 'user' ? 'chat-user' : 'chat-ai'}>
                <div
                  className="text-sm leading-relaxed markdown-content"
                  dangerouslySetInnerHTML={{ __html: renderMessage(msg.content) }}
                />
                {msg.timestamp && (
                  <div className="text-xs opacity-50 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6c63ff] to-[#a78bfa] flex items-center justify-center">
                <Sparkles size={14} />
              </div>
              <div className="chat-ai flex items-center gap-2">
                <Loader2 size={14} className="spinner text-[#6c63ff]" />
                <span className="text-sm text-[#8888aa]">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompts */}
        <div className="px-4 py-2 border-t border-[#2a2a3d] overflow-x-auto">
          <div className="flex gap-2 pb-1">
            {QUICK_PROMPTS.map(p => (
              <button key={p} onClick={() => sendMessage(p)}
                className="flex-shrink-0 text-xs bg-[#1a1a28] border border-[#2a2a3d] hover:border-[#6c63ff] text-[#8888aa] hover:text-white px-3 py-1.5 rounded-full transition-all">
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[#2a2a3d]">
          <div className="flex gap-2">
            <button onClick={toggleVoice} className={`p-3 rounded-xl border transition-all ${isListening ? 'bg-red-500/20 border-red-500 text-red-400' : 'border-[#2a2a3d] text-[#8888aa] hover:border-[#6c63ff]'}`}>
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <input
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              className="input-field flex-1" placeholder="Koi bhi sawaal pooch... (Ask anything!)"
            />
            <button onClick={() => sendMessage()} disabled={!input.trim() || loading} className="btn-primary px-4 disabled:opacity-50">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
