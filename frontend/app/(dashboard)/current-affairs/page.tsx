'use client';
import { useState, useEffect, useCallback } from 'react';
import { currentAffairsAPI } from '@/lib/api';
import { Newspaper, RefreshCw, Loader2, ExternalLink, CheckCircle, XCircle, ChevronRight } from 'lucide-react';

interface Article {
  _id: string;
  title: string;
  summary: string;
  upscRelevance: string;
  category: string;
  source?: string;
  sourceUrl?: string;
  date: string;
  tags: string[];
}

interface QuizQ { question: string; options: string[]; correctAnswer: string; explanation: string; }

const CATEGORY_COLORS: Record<string, string> = {
  polity: '#6c63ff', economy: '#f5c842', science: '#06b6d4',
  environment: '#22c55e', international: '#f97316', social: '#ec4899',
  history: '#8b5cf6', geography: '#22c55e', general: '#8888aa'
};

export default function CurrentAffairsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [quiz, setQuiz] = useState<QuizQ[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const loadToday = useCallback(async () => {
    setLoading(true);
    try {
      const res = await currentAffairsAPI.today();
      setArticles(res.data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadToday(); }, [loadToday]);

  const openArticle = async (article: Article) => {
    setSelectedArticle(article);
    setQuiz([]);
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const loadQuiz = async () => {
    if (!selectedArticle) return;
    setQuizLoading(true);
    try {
      const res = await currentAffairsAPI.quiz(selectedArticle._id);
      setQuiz(res.data);
    } catch { /* silent */ }
    finally { setQuizLoading(false); }
  };

  const submitQuiz = () => setQuizSubmitted(true);

  const quizScore = quizSubmitted
    ? quiz.filter((q, i) => quizAnswers[i] === q.correctAnswer).length
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 size={32} className="spinner text-[#06b6d4] mx-auto mb-3" />
          <p className="text-[#8888aa]">Fetching today's current affairs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <Newspaper size={24} className="text-[#06b6d4]" /> Current Affairs
          </h1>
          <p className="text-[#8888aa] text-sm mt-1">Today's important news simplified for UPSC preparation</p>
        </div>
        <button onClick={loadToday} className="btn-ghost text-sm py-2 px-4 flex items-center gap-2">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Articles list */}
        <div className="space-y-4">
          <h2 className="font-bold text-sm text-[#8888aa] uppercase tracking-wider">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </h2>
          {articles.length === 0 ? (
            <div className="glass p-8 text-center">
              <Newspaper size={32} className="text-[#8888aa] mx-auto mb-3 opacity-50" />
              <p className="text-[#8888aa]">No articles available today. Check back later!</p>
              <p className="text-xs text-[#555] mt-2">Make sure NEWS_API_KEY is configured in backend</p>
            </div>
          ) : (
            articles.map(article => (
              <button key={article._id} onClick={() => openArticle(article)}
                className={`w-full text-left glass glass-hover p-5 transition-all ${selectedArticle?._id === article._id ? 'border-[#06b6d4] glow-primary' : ''}`}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="badge text-xs" style={{ background: `${CATEGORY_COLORS[article.category]}20`, color: CATEGORY_COLORS[article.category], border: `1px solid ${CATEGORY_COLORS[article.category]}40` }}>
                    {article.category}
                  </span>
                  {article.source && <span className="text-xs text-[#8888aa]">{article.source}</span>}
                </div>
                <h3 className="font-bold text-sm mb-2 leading-snug">{article.title}</h3>
                <p className="text-xs text-[#8888aa] line-clamp-2">{article.summary}</p>
                <div className="flex items-center gap-1 mt-2 text-[#06b6d4] text-xs">
                  Read more <ChevronRight size={12} />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Article detail */}
        <div>
          {selectedArticle ? (
            <div className="glass rounded-xl overflow-hidden sticky top-6">
              <div className="p-5 border-b border-[#2a2a3d]">
                <span className="badge text-xs mb-3 inline-block" style={{ background: `${CATEGORY_COLORS[selectedArticle.category]}20`, color: CATEGORY_COLORS[selectedArticle.category], border: `1px solid ${CATEGORY_COLORS[selectedArticle.category]}40` }}>
                  {selectedArticle.category}
                </span>
                <h2 className="font-black text-lg leading-snug mb-2">{selectedArticle.title}</h2>
                {selectedArticle.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {selectedArticle.tags.map(t => <span key={t} className="badge badge-primary text-xs">{t}</span>)}
                  </div>
                )}
              </div>

              <div className="p-5 space-y-4 overflow-y-auto max-h-[500px]">
                <div>
                  <h3 className="text-xs font-bold text-[#8888aa] uppercase mb-2">Summary</h3>
                  <p className="text-sm leading-relaxed">{selectedArticle.summary}</p>
                </div>

                <div className="bg-[#6c63ff]/10 border border-[#6c63ff]/20 rounded-xl p-4">
                  <h3 className="text-xs font-bold text-[#a78bfa] uppercase mb-2">🎯 UPSC Relevance</h3>
                  <p className="text-sm text-[#8888aa] leading-relaxed">{selectedArticle.upscRelevance}</p>
                </div>

                {selectedArticle.sourceUrl && (
                  <a href={selectedArticle.sourceUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-[#06b6d4] hover:underline">
                    <ExternalLink size={12} /> Read original article
                  </a>
                )}

                {/* Quiz section */}
                <div className="border-t border-[#2a2a3d] pt-4">
                  {quiz.length === 0 ? (
                    <button onClick={loadQuiz} disabled={quizLoading} className="btn-primary w-full py-2 text-sm flex items-center justify-center gap-2">
                      {quizLoading ? <><Loader2 size={14} className="spinner" /> Generating Quiz...</> : '🧠 Take Quiz on This Article'}
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="font-bold text-sm">Quick Quiz</h3>
                      {quiz.map((q, qi) => (
                        <div key={qi} className="space-y-2">
                          <p className="text-sm font-medium">{qi + 1}. {q.question}</p>
                          <div className="space-y-1">
                            {q.options.map((opt, oi) => {
                              let cls = 'border-[#2a2a3d] hover:border-[#06b6d4]';
                              if (quizSubmitted) {
                                if (opt === q.correctAnswer) cls = 'border-green-500 bg-green-500/10';
                                else if (opt === quizAnswers[qi] && opt !== q.correctAnswer) cls = 'border-red-500 bg-red-500/10';
                              } else if (quizAnswers[qi] === opt) cls = 'border-[#06b6d4] bg-[#06b6d4]/10';
                              return (
                                <button key={oi} onClick={() => !quizSubmitted && setQuizAnswers(prev => ({ ...prev, [qi]: opt }))}
                                  disabled={quizSubmitted}
                                  className={`w-full text-left text-xs p-2 rounded-lg border transition-all flex items-center justify-between ${cls}`}>
                                  <span>{opt}</span>
                                  {quizSubmitted && opt === q.correctAnswer && <CheckCircle size={12} className="text-green-400" />}
                                  {quizSubmitted && opt === quizAnswers[qi] && opt !== q.correctAnswer && <XCircle size={12} className="text-red-400" />}
                                </button>
                              );
                            })}
                          </div>
                          {quizSubmitted && (
                            <p className="text-xs text-[#8888aa] bg-[#1a1a28] p-2 rounded-lg">{q.explanation}</p>
                          )}
                        </div>
                      ))}
                      {!quizSubmitted ? (
                        <button onClick={submitQuiz} disabled={Object.keys(quizAnswers).length < quiz.length}
                          className="btn-primary w-full py-2 text-sm disabled:opacity-50">
                          Submit Quiz
                        </button>
                      ) : (
                        <div className="text-center p-3 bg-[#1a1a28] rounded-xl">
                          <div className="text-2xl font-black gradient-text">{quizScore}/{quiz.length}</div>
                          <div className="text-xs text-[#8888aa]">Quiz Score</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass p-10 text-center">
              <Newspaper size={40} className="text-[#06b6d4] mx-auto mb-4 opacity-50" />
              <h3 className="font-bold mb-2">Select an Article</h3>
              <p className="text-[#8888aa] text-sm">Click any article to read the full summary and take a quiz</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
