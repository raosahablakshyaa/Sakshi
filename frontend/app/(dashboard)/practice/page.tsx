'use client';
import { useState, useEffect, useCallback } from 'react';
import { questionsAPI } from '@/lib/api';
import { Target, CheckCircle, XCircle, Loader2, RefreshCw, Trophy, ChevronRight } from 'lucide-react';

interface Question {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  subject: string;
  difficulty: string;
  upscRelevance: boolean;
}

interface Result { isCorrect: boolean; correctAnswer: string; explanation: string; }

const SUBJECTS = ['all', 'history', 'geography', 'polity', 'economics', 'science', 'environment', 'english', 'general'];
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

export default function PracticePage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [subject, setSubject] = useState('all');
  const [difficulty, setDifficulty] = useState('beginner');
  const [sessionStats, setSessionStats] = useState({ attempted: 0, correct: 0 });
  const [sessionComplete, setSessionComplete] = useState(false);

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setCurrentIndex(0);
    setSelectedAnswer('');
    setResult(null);
    setSessionStats({ attempted: 0, correct: 0 });
    setSessionComplete(false);
    try {
      const params: Record<string, string | number> = { limit: 10, difficulty };
      if (subject !== 'all') params.subject = subject;
      const res = await questionsAPI.daily(params);
      setQuestions(res.data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [subject, difficulty]);

  useEffect(() => { loadQuestions(); }, [loadQuestions]);

  const submitAnswer = async () => {
    if (!selectedAnswer || submitting) return;
    const q = questions[currentIndex];
    setSubmitting(true);
    try {
      const res = await questionsAPI.submit({ questionId: q._id, selectedAnswer, subject: q.subject });
      setResult(res.data);
      setSessionStats(prev => ({
        attempted: prev.attempted + 1,
        correct: prev.correct + (res.data.isCorrect ? 1 : 0)
      }));
    } catch { /* silent */ }
    finally { setSubmitting(false); }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      setSessionComplete(true);
      return;
    }
    setCurrentIndex(i => i + 1);
    setSelectedAnswer('');
    setResult(null);
  };

  const currentQ = questions[currentIndex];
  const accuracy = sessionStats.attempted > 0 ? Math.round((sessionStats.correct / sessionStats.attempted) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 size={32} className="spinner text-[#6c63ff] mx-auto mb-3" />
          <p className="text-[#8888aa]">Loading your practice questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <Target size={24} className="text-[#f5c842]" /> Daily Practice
          </h1>
          <p className="text-[#8888aa] text-sm mt-1">Sharpen your skills every day — consistency beats intensity!</p>
        </div>
        <button onClick={loadQuestions} className="btn-ghost text-sm py-2 px-4 flex items-center gap-2">
          <RefreshCw size={14} /> New Set
        </button>
      </div>

      {/* Filters */}
      <div className="glass p-4 flex flex-wrap gap-4">
        <div>
          <label className="text-xs text-[#8888aa] mb-1 block">Subject</label>
          <select value={subject} onChange={e => setSubject(e.target.value)} className="input-field text-sm py-2 w-auto">
            {SUBJECTS.map(s => <option key={s} value={s}>{s === 'all' ? 'All Subjects' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-[#8888aa] mb-1 block">Difficulty</label>
          <div className="flex gap-2">
            {DIFFICULTIES.map(d => (
              <button key={d} onClick={() => setDifficulty(d)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all capitalize ${difficulty === d ? 'bg-[#6c63ff] border-[#6c63ff] text-white' : 'border-[#2a2a3d] text-[#8888aa] hover:border-[#6c63ff]'}`}>
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Session stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card text-center">
          <div className="text-2xl font-black text-[#6c63ff]">{sessionStats.attempted}</div>
          <div className="text-xs text-[#8888aa]">Attempted</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-2xl font-black text-[#22c55e]">{sessionStats.correct}</div>
          <div className="text-xs text-[#8888aa]">Correct</div>
        </div>
        <div className="stat-card text-center">
          <div className={`text-2xl font-black ${accuracy >= 70 ? 'text-green-400' : accuracy >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{accuracy}%</div>
          <div className="text-xs text-[#8888aa]">Accuracy</div>
        </div>
      </div>

      {sessionComplete ? (
        <div className="glass p-10 text-center">
          <Trophy size={48} className="text-[#f5c842] mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-2">Session Complete! 🎉</h2>
          <p className="text-[#8888aa] mb-2">You attempted {sessionStats.attempted} questions</p>
          <p className="text-3xl font-black gradient-text mb-6">{accuracy}% Accuracy</p>
          {accuracy >= 80 && <p className="text-green-400 mb-4">Excellent performance! Keep it up! 🌟</p>}
          {accuracy < 50 && <p className="text-orange-400 mb-4">Keep practicing — you'll improve! 💪</p>}
          <button onClick={loadQuestions} className="btn-primary py-3 px-8 flex items-center gap-2 mx-auto">
            <RefreshCw size={16} /> Practice More
          </button>
        </div>
      ) : questions.length === 0 ? (
        <div className="glass p-10 text-center">
          <p className="text-[#8888aa]">No questions found. Try different filters or check back later!</p>
        </div>
      ) : currentQ ? (
        <div className="glass p-6">
          {/* Progress */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-[#8888aa]">Question {currentIndex + 1} of {questions.length}</span>
            <div className="flex gap-2">
              <span className={`badge capitalize ${currentQ.difficulty === 'beginner' ? 'badge-green' : currentQ.difficulty === 'intermediate' ? 'badge-gold' : 'badge-red'}`}>
                {currentQ.difficulty}
              </span>
              <span className="badge badge-primary capitalize">{currentQ.subject}</span>
              {currentQ.upscRelevance && <span className="badge badge-gold">UPSC</span>}
            </div>
          </div>
          <div className="progress-bar mb-6">
            <div className="progress-fill" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
          </div>

          {/* Question */}
          <h2 className="text-lg font-semibold mb-6 leading-relaxed">{currentQ.question}</h2>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQ.options.map((opt, i) => {
              let style = 'border-[#2a2a3d] hover:border-[#6c63ff] bg-[#1a1a28]';
              if (result) {
                if (opt === result.correctAnswer) style = 'border-green-500 bg-green-500/10';
                else if (opt === selectedAnswer && !result.isCorrect) style = 'border-red-500 bg-red-500/10';
              } else if (selectedAnswer === opt) {
                style = 'border-[#6c63ff] bg-[#6c63ff]/10';
              }
              return (
                <button key={i} onClick={() => !result && setSelectedAnswer(opt)} disabled={!!result}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 ${style}`}>
                  <span className="w-7 h-7 rounded-full border border-current flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm">{opt}</span>
                  {result && opt === result.correctAnswer && <CheckCircle size={16} className="text-green-400 ml-auto" />}
                  {result && opt === selectedAnswer && !result.isCorrect && <XCircle size={16} className="text-red-400 ml-auto" />}
                </button>
              );
            })}
          </div>

          {/* Result */}
          {result && (
            <div className={`p-4 rounded-xl mb-4 border ${result.isCorrect ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
              <div className="flex items-center gap-2 mb-2">
                {result.isCorrect ? <CheckCircle size={18} className="text-green-400" /> : <XCircle size={18} className="text-red-400" />}
                <span className={`font-bold ${result.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                  {result.isCorrect ? 'Correct! Excellent! 🎉' : 'Incorrect. Let\'s learn from this!'}
                </span>
              </div>
              <p className="text-sm text-[#8888aa] leading-relaxed">{result.explanation}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            {!result ? (
              <button onClick={submitAnswer} disabled={!selectedAnswer || submitting} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2">
                {submitting ? <><Loader2 size={16} className="spinner" /> Checking...</> : 'Submit Answer'}
              </button>
            ) : (
              <button onClick={nextQuestion} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2">
                {currentIndex + 1 >= questions.length ? 'View Results' : 'Next Question'} <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
