'use client';
import { useState, useRef, useEffect } from 'react';
import { interviewAPI } from '@/lib/api';
import { Mic, MicOff, Play, ChevronRight, Loader2, Trophy, Lightbulb, CheckCircle } from 'lucide-react';

interface InterviewState {
  started: boolean;
  questionIndex: number;
  totalQuestions: number;
  complete: boolean;
}

interface Message { type: 'interviewer' | 'candidate' | 'feedback'; content: string; }

const TIPS = [
  { icon: '🧍', category: 'Body Language', tip: 'Sit straight, maintain eye contact, smile naturally' },
  { icon: '🗣️', category: 'Communication', tip: 'Speak clearly, not too fast. Pause before answering.' },
  { icon: '📝', category: 'Structure', tip: 'Structure answers: Point 1, Point 2, Conclusion' },
  { icon: '💪', category: 'Confidence', tip: 'It\'s okay to say "I don\'t know" — honesty is valued' },
  { icon: '📰', category: 'Current Affairs', tip: 'Read newspaper daily. Know India\'s major policies.' },
  { icon: '⚖️', category: 'Ethics', tip: 'Always choose integrity over convenience in answers' },
];

export default function InterviewPage() {
  const [state, setState] = useState<InterviewState>({ started: false, questionIndex: 0, totalQuestions: 15, complete: false });
  const [messages, setMessages] = useState<Message[]>([]);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const startInterview = async () => {
    setLoading(true);
    try {
      const res = await interviewAPI.start();
      setState({ started: true, questionIndex: 0, totalQuestions: res.data.totalQuestions, complete: false });
      setMessages([{ type: 'interviewer', content: res.data.message }]);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  const submitAnswer = async () => {
    if (!answer.trim() || loading) return;
    const myAnswer = answer.trim();
    setAnswer('');
    setMessages(prev => [...prev, { type: 'candidate', content: myAnswer }]);
    setLoading(true);
    try {
      const res = await interviewAPI.answer({ answer: myAnswer, questionIndex: state.questionIndex });
      setMessages(prev => [...prev, { type: 'feedback', content: res.data.feedback }]);
      if (res.data.isComplete) {
        setState(prev => ({ ...prev, complete: true }));
      } else {
        setState(prev => ({ ...prev, questionIndex: res.data.nextQuestionIndex }));
      }
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice not supported. Try Chrome!');
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SR();
    r.lang = 'en-IN';
    r.continuous = true;
    r.onresult = (e) => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join(' ');
      setAnswer(transcript);
    };
    r.onend = () => setIsListening(false);
    r.start();
    recognitionRef.current = r;
    setIsListening(true);
  };

  const renderContent = (text: string) => text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#f0f0ff">$1</strong>')
    .replace(/\n/g, '<br/>');

  if (!state.started) {
    return (
      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <Mic className="text-[#f97316]" size={24} /> AI Mock Interview
          </h1>
          <p className="text-[#8888aa] text-sm mt-1">Simulate a real IAS Personality Test with AI feedback</p>
        </div>

        {/* Hero card */}
        <div className="glass p-8 text-center border-[#f97316]/30">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#f97316] to-[#f5c842] flex items-center justify-center mx-auto mb-4">
            <Mic size={28} className="text-white" />
          </div>
          <h2 className="text-2xl font-black mb-3">IAS Personality Test Simulation</h2>
          <p className="text-[#8888aa] mb-6 max-w-lg mx-auto">
            Face a real UPSC-style interview panel. Get instant AI feedback on your answers, communication, and confidence. Build your interview skills from today!
          </p>
          <div className="grid grid-cols-3 gap-4 mb-8 max-w-sm mx-auto">
            {[['15', 'Questions'], ['AI', 'Feedback'], ['Real', 'UPSC Style']].map(([v, l]) => (
              <div key={l} className="bg-[#1a1a28] rounded-xl p-3 text-center">
                <div className="text-xl font-black text-[#f97316]">{v}</div>
                <div className="text-xs text-[#8888aa]">{l}</div>
              </div>
            ))}
          </div>
          <button onClick={startInterview} disabled={loading} className="btn-primary py-3 px-10 flex items-center gap-2 mx-auto text-base">
            {loading ? <><Loader2 size={18} className="spinner" /> Starting...</> : <><Play size={18} /> Start Interview</>}
          </button>
        </div>

        {/* Tips */}
        <div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Lightbulb size={18} className="text-[#f5c842]" /> Interview Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TIPS.map(t => (
              <div key={t.category} className="glass p-4">
                <div className="text-2xl mb-2">{t.icon}</div>
                <div className="font-semibold text-sm mb-1">{t.category}</div>
                <p className="text-xs text-[#8888aa]">{t.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black flex items-center gap-2">
          <Mic className="text-[#f97316]" size={20} /> IAS Interview Session
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#8888aa]">Q {state.questionIndex + 1} / {state.totalQuestions}</span>
          <div className="progress-bar w-32">
            <div className="progress-fill" style={{ width: `${((state.questionIndex + 1) / state.totalQuestions) * 100}%`, background: 'linear-gradient(90deg, #f97316, #f5c842)' }} />
          </div>
        </div>
      </div>

      {state.complete ? (
        <div className="glass p-10 text-center">
          <Trophy size={48} className="text-[#f5c842] mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-3">Interview Complete! 🎉</h2>
          <p className="text-[#8888aa] mb-6">Great job completing your mock interview! Review the feedback above to improve.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setState({ started: false, questionIndex: 0, totalQuestions: 15, complete: false }); setMessages([]); }}
              className="btn-primary py-3 px-8 flex items-center gap-2">
              <Play size={16} /> Practice Again
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Chat */}
          <div className="glass rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[#2a2a3d] flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#f97316] to-[#f5c842] flex items-center justify-center">
                <CheckCircle size={16} className="text-white" />
              </div>
              <div>
                <div className="font-bold text-sm">UPSC Interview Board</div>
                <div className="text-xs text-[#8888aa]">AI-powered personality test simulation</div>
              </div>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto max-h-[400px]">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.type === 'candidate' ? 'justify-end' : 'justify-start'} gap-3`}>
                  {msg.type !== 'candidate' && (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${msg.type === 'feedback' ? 'bg-green-500/20' : 'bg-gradient-to-br from-[#f97316] to-[#f5c842]'}`}>
                      {msg.type === 'feedback' ? <CheckCircle size={14} className="text-green-400" /> : <Mic size={14} className="text-white" />}
                    </div>
                  )}
                  <div className={msg.type === 'candidate' ? 'chat-user' : msg.type === 'feedback' ? 'chat-ai border-green-500/20' : 'chat-ai'}>
                    <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }} />
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f97316] to-[#f5c842] flex items-center justify-center">
                    <Mic size={14} className="text-white" />
                  </div>
                  <div className="chat-ai flex items-center gap-2">
                    <Loader2 size={14} className="spinner text-[#f97316]" />
                    <span className="text-sm text-[#8888aa]">Evaluating your answer...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Answer input */}
          <div className="glass p-4">
            <label className="text-sm text-[#8888aa] mb-2 block">Your Answer</label>
            <textarea
              value={answer} onChange={e => setAnswer(e.target.value)}
              className="input-field resize-none mb-3" rows={4}
              placeholder="Type your answer here... or use voice input below"
            />
            <div className="flex gap-3">
              <button onClick={toggleVoice}
                className={`p-3 rounded-xl border transition-all flex items-center gap-2 text-sm ${isListening ? 'bg-red-500/20 border-red-500 text-red-400' : 'border-[#2a2a3d] text-[#8888aa] hover:border-[#f97316]'}`}>
                {isListening ? <><MicOff size={16} /> Stop</> : <><Mic size={16} /> Voice</>}
              </button>
              <button onClick={submitAnswer} disabled={!answer.trim() || loading}
                className="btn-primary flex-1 py-3 flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <><Loader2 size={16} className="spinner" /> Evaluating...</> : <>Submit Answer <ChevronRight size={16} /></>}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
