'use client';
import { useState, useEffect, useCallback } from 'react';
import { ncertAPI } from '@/lib/api';
import { BookOpen, ChevronRight, Loader2, Layers, RotateCcw, Sparkles, FileText, Trophy, AlertCircle } from 'lucide-react';

interface Chapter { index: number; title: string; }
interface Flashcard { front: string; back: string; difficulty: string; }
interface PYQ {
  year: number; exam: string; paper: string; question: string;
  options: string[]; correctAnswer: string; explanation: string;
  difficulty: string; topic: string;
}

const SUBJECTS = [
  { key: 'history', label: 'History', icon: '🏛️', color: '#f97316' },
  { key: 'geography', label: 'Geography', icon: '🌍', color: '#22c55e' },
  { key: 'polity', label: 'Political Science', icon: '⚖️', color: '#6c63ff' },
  { key: 'economics', label: 'Economics', icon: '📊', color: '#f5c842' },
  { key: 'science', label: 'Science', icon: '🔬', color: '#06b6d4' },
];
const CLASSES = [6, 7, 8, 9, 10, 11, 12];
type Tab = 'overview' | 'flashcards' | 'pyqs';

export default function NCERTPage() {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedClass, setSelectedClass] = useState(7);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [overview, setOverview] = useState('');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [pyqs, setPyqs] = useState<PYQ[]>([]);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [expandedPYQ, setExpandedPYQ] = useState<number | null>(null);
  const [pyqAnswers, setPyqAnswers] = useState<Record<number, string>>({});

  const loadChapters = useCallback(async () => {
    if (!selectedSubject) return;
    setLoadingChapters(true);
    setChapters([]);
    setSelectedChapter(null);
    setOverview('');
    setFlashcards([]);
    setPyqs([]);
    try {
      const res = await ncertAPI.chapters({ subject: selectedSubject, class: selectedClass });
      setChapters(res.data.chapters);
    } catch { /* silent */ }
    finally { setLoadingChapters(false); }
  }, [selectedSubject, selectedClass]);

  useEffect(() => { loadChapters(); }, [loadChapters]);

  const loadChapter = async (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setOverview('');
    setFlashcards([]);
    setPyqs([]);
    setFlippedCards(new Set());
    setPyqAnswers({});
    setExpandedPYQ(null);
    setActiveTab('overview');
    setLoadingContent(true);
    try {
      const res = await ncertAPI.overview({ subject: selectedSubject, chapter: chapter.title, class: selectedClass });
      setOverview(res.data.overview);
    } catch { setOverview('Could not load overview. Please try again.'); }
    finally { setLoadingContent(false); }
  };

  const loadFlashcards = async () => {
    if (!selectedChapter) return;
    setActiveTab('flashcards');
    if (flashcards.length > 0) return;
    setLoadingContent(true);
    try {
      const res = await ncertAPI.flashcards({ subject: selectedSubject, chapter: selectedChapter.title, class: selectedClass });
      setFlashcards(res.data.flashcards);
    } catch { /* silent */ }
    finally { setLoadingContent(false); }
  };

  const loadPYQs = async () => {
    if (!selectedChapter) return;
    setActiveTab('pyqs');
    if (pyqs.length > 0) return;
    setLoadingContent(true);
    try {
      const res = await ncertAPI.pyqs({ subject: selectedSubject, chapter: selectedChapter.title, class: selectedClass });
      setPyqs(res.data.pyqs);
    } catch { /* silent */ }
    finally { setLoadingContent(false); }
  };

  const renderMarkdown = (text: string) => text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#f0f0ff">$1</strong>')
    .replace(/^## (.*$)/gm, '<h2 style="color:#a78bfa;font-size:17px;font-weight:700;margin:20px 0 8px;border-bottom:1px solid #2a2a3d;padding-bottom:6px">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 style="color:#f5c842;font-size:14px;font-weight:600;margin:14px 0 6px">$1</h3>')
    .replace(/^- (.*$)/gm, '<li style="margin:4px 0;color:#c0c0d0;padding-left:4px">• $1</li>')
    .replace(/^\d+\. (.*$)/gm, '<li style="margin:4px 0;color:#c0c0d0;padding-left:4px">$&</li>')
    .replace(/\n/g, '<br/>');

  const subjectInfo = SUBJECTS.find(s => s.key === selectedSubject);
  const prelims = pyqs.filter(q => q.exam?.includes('Prelims') || q.options?.length > 0);
  const mains = pyqs.filter(q => q.exam?.includes('Mains') || q.correctAnswer === 'Subjective');
  const expected = pyqs.filter(q => q.year === 0);

  return (
    <div className="max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-black flex items-center gap-2">
          <BookOpen size={24} className="text-[#22c55e]" /> NCERT Learning Hub
        </h1>
        <p className="text-[#8888aa] text-sm mt-1">Complete NCERT Class 6–12 with AI Overview, PYQs & Flashcards</p>
      </div>

      {/* Subject + Class selector */}
      <div className="glass p-6 space-y-4">
        <div>
          <label className="text-sm text-[#8888aa] mb-3 block font-semibold">Select Subject</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {SUBJECTS.map(s => (
              <button key={s.key} onClick={() => setSelectedSubject(s.key)}
                className={`p-3 rounded-xl border text-center transition-all ${selectedSubject === s.key ? 'border-[#6c63ff] bg-[#6c63ff]/10' : 'border-[#2a2a3d] hover:border-[#6c63ff]/50'}`}>
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-xs font-semibold">{s.label}</div>
              </button>
            ))}
          </div>
        </div>
        {selectedSubject && (
          <div>
            <label className="text-sm text-[#8888aa] mb-2 block font-semibold">Select Class</label>
            <div className="flex gap-2 flex-wrap">
              {CLASSES.map(c => (
                <button key={c} onClick={() => setSelectedClass(c)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${selectedClass === c ? 'bg-[#6c63ff] border-[#6c63ff] text-white' : 'border-[#2a2a3d] text-[#8888aa] hover:border-[#6c63ff]'}`}>
                  Class {c}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedSubject && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chapter list */}
          <div className="glass rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[#2a2a3d] flex items-center gap-2">
              <span className="text-lg">{subjectInfo?.icon}</span>
              <div>
                <div className="font-bold text-sm">{subjectInfo?.label} — Class {selectedClass}</div>
                <div className="text-xs text-[#8888aa]">{chapters.length} chapters</div>
              </div>
            </div>
            <div className="overflow-y-auto max-h-[600px]">
              {loadingChapters ? (
                <div className="p-6 text-center"><Loader2 size={20} className="spinner text-[#6c63ff] mx-auto" /></div>
              ) : chapters.length === 0 ? (
                <div className="p-6 text-center text-[#8888aa] text-sm">No chapters available</div>
              ) : (
                chapters.map(ch => (
                  <button key={ch.index} onClick={() => loadChapter(ch)}
                    className={`w-full text-left p-3 border-b border-[#2a2a3d] hover:bg-[#1a1a28] transition-all flex items-center justify-between group ${selectedChapter?.index === ch.index ? 'bg-[#1a1a28] border-l-2 border-l-[#6c63ff]' : ''}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#8888aa] w-6 flex-shrink-0">{ch.index}</span>
                      <span className="text-sm leading-snug">{ch.title}</span>
                    </div>
                    <ChevronRight size={14} className="text-[#8888aa] group-hover:text-[#6c63ff] flex-shrink-0 ml-2" />
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Content area */}
          <div className="lg:col-span-2">
            {!selectedChapter ? (
              <div className="glass p-10 text-center h-full flex flex-col items-center justify-center min-h-[400px]">
                <Sparkles size={40} className="text-[#6c63ff] mb-4 opacity-50" />
                <h3 className="font-bold text-lg mb-2">Select a Chapter</h3>
                <p className="text-[#8888aa] text-sm max-w-xs">Click any chapter to get complete overview, all PYQs from 1979–2024, and flashcards</p>
              </div>
            ) : (
              <div className="glass rounded-xl overflow-hidden">
                {/* Chapter header */}
                <div className="p-4 border-b border-[#2a2a3d]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge badge-primary text-xs">Chapter {selectedChapter.index}</span>
                    <span className="badge badge-green text-xs">{subjectInfo?.label} • Class {selectedClass}</span>
                  </div>
                  <h2 className="font-black text-base">{selectedChapter.title}</h2>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-[#2a2a3d]">
                  <button onClick={() => setActiveTab('overview')}
                    className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${activeTab === 'overview' ? 'text-[#6c63ff] border-b-2 border-[#6c63ff] bg-[#6c63ff]/5' : 'text-[#8888aa] hover:text-white'}`}>
                    <Sparkles size={13} /> Overview
                  </button>
                  <button onClick={loadPYQs}
                    className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${activeTab === 'pyqs' ? 'text-[#f5c842] border-b-2 border-[#f5c842] bg-[#f5c842]/5' : 'text-[#8888aa] hover:text-white'}`}>
                    <Trophy size={13} /> PYQs {pyqs.length > 0 && <span className="badge badge-gold text-xs px-1.5 py-0">{pyqs.length}</span>}
                  </button>
                  <button onClick={loadFlashcards}
                    className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${activeTab === 'flashcards' ? 'text-[#22c55e] border-b-2 border-[#22c55e] bg-[#22c55e]/5' : 'text-[#8888aa] hover:text-white'}`}>
                    <Layers size={13} /> Flashcards
                  </button>
                </div>

                <div className="p-5 overflow-y-auto max-h-[560px]">
                  {loadingContent ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                      <Loader2 size={28} className="spinner text-[#6c63ff]" />
                      <p className="text-[#8888aa] text-sm">
                        {activeTab === 'pyqs' ? 'Fetching all PYQs from 1979–2024...' : activeTab === 'overview' ? 'Generating complete chapter overview...' : 'Creating flashcards...'}
                      </p>
                    </div>
                  ) : activeTab === 'overview' ? (
                    overview ? (
                      <div className="markdown-content text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(overview) }} />
                    ) : null

                  ) : activeTab === 'pyqs' ? (
                    pyqs.length === 0 ? (
                      <div className="text-center py-10 text-[#8888aa]">
                        <Trophy size={32} className="mx-auto mb-3 opacity-40" />
                        <p>Click the PYQs tab to load questions</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-[#1a1a28] rounded-xl p-3 text-center border border-[#2a2a3d]">
                            <div className="text-xl font-black text-[#6c63ff]">{prelims.length}</div>
                            <div className="text-xs text-[#8888aa]">Prelims MCQs</div>
                          </div>
                          <div className="bg-[#1a1a28] rounded-xl p-3 text-center border border-[#2a2a3d]">
                            <div className="text-xl font-black text-[#f97316]">{mains.length}</div>
                            <div className="text-xs text-[#8888aa]">Mains Questions</div>
                          </div>
                          <div className="bg-[#1a1a28] rounded-xl p-3 text-center border border-[#2a2a3d]">
                            <div className="text-xl font-black text-[#f5c842]">{expected.length}</div>
                            <div className="text-xs text-[#8888aa]">Expected Qs</div>
                          </div>
                        </div>

                        {/* Prelims */}
                        {prelims.length > 0 && (
                          <div>
                            <h3 className="font-bold text-sm text-[#6c63ff] mb-3 flex items-center gap-2">
                              <FileText size={14} /> UPSC Prelims MCQs
                            </h3>
                            <div className="space-y-3">
                              {prelims.map((q, i) => (
                                <div key={i} className="bg-[#1a1a28] rounded-xl border border-[#2a2a3d] overflow-hidden">
                                  <button onClick={() => setExpandedPYQ(expandedPYQ === i ? null : i)}
                                    className="w-full text-left p-4">
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                          {q.year > 0 && <span className="badge badge-gold text-xs">{q.year}</span>}
                                          {q.year === 0 && <span className="badge badge-primary text-xs">Expected</span>}
                                          <span className="badge badge-primary text-xs">{q.paper || 'GS Paper 1'}</span>
                                          <span className={`badge text-xs ${q.difficulty === 'easy' ? 'badge-green' : q.difficulty === 'hard' ? 'badge-red' : 'badge-gold'}`}>{q.difficulty}</span>
                                        </div>
                                        <p className="text-sm font-medium leading-snug">{q.question}</p>
                                      </div>
                                      <ChevronRight size={14} className={`text-[#8888aa] flex-shrink-0 mt-1 transition-transform ${expandedPYQ === i ? 'rotate-90' : ''}`} />
                                    </div>
                                  </button>
                                  {expandedPYQ === i && (
                                    <div className="px-4 pb-4 space-y-2 border-t border-[#2a2a3d] pt-3">
                                      {q.options?.map((opt, oi) => (
                                        <button key={oi} onClick={() => setPyqAnswers(prev => ({ ...prev, [i]: opt }))}
                                          className={`w-full text-left text-xs p-2.5 rounded-lg border transition-all ${
                                            pyqAnswers[i] === opt && opt === q.correctAnswer ? 'border-green-500 bg-green-500/10 text-green-400' :
                                            pyqAnswers[i] === opt && opt !== q.correctAnswer ? 'border-red-500 bg-red-500/10 text-red-400' :
                                            pyqAnswers[i] && opt === q.correctAnswer ? 'border-green-500 bg-green-500/10 text-green-400' :
                                            'border-[#2a2a3d] hover:border-[#6c63ff]'
                                          }`}>
                                          {opt}
                                        </button>
                                      ))}
                                      {pyqAnswers[i] && (
                                        <div className="bg-[#0a0a0f] rounded-lg p-3 mt-2 border border-[#2a2a3d]">
                                          <p className="text-xs font-semibold text-[#a78bfa] mb-1">✅ Correct: {q.correctAnswer}</p>
                                          <p className="text-xs text-[#8888aa] leading-relaxed">{q.explanation}</p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Mains */}
                        {mains.length > 0 && (
                          <div>
                            <h3 className="font-bold text-sm text-[#f97316] mb-3 flex items-center gap-2">
                              <FileText size={14} /> UPSC Mains Questions
                            </h3>
                            <div className="space-y-3">
                              {mains.map((q, i) => (
                                <div key={i} className="bg-[#1a1a28] rounded-xl border border-[#2a2a3d] p-4">
                                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    {q.year > 0 && <span className="badge badge-gold text-xs">{q.year}</span>}
                                    {q.year === 0 && <span className="badge badge-primary text-xs">Expected</span>}
                                    <span className="badge text-xs" style={{ background: '#f9731620', color: '#f97316', border: '1px solid #f9731640' }}>{q.paper || 'GS Mains'}</span>
                                  </div>
                                  <p className="text-sm font-medium mb-3 leading-relaxed">{q.question}</p>
                                  <div className="bg-[#0a0a0f] rounded-lg p-3 border border-[#2a2a3d]">
                                    <p className="text-xs font-semibold text-[#f97316] mb-1">💡 How to approach:</p>
                                    <p className="text-xs text-[#8888aa] leading-relaxed">{q.explanation}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Expected */}
                        {expected.length > 0 && (
                          <div>
                            <h3 className="font-bold text-sm text-[#f5c842] mb-3 flex items-center gap-2">
                              <AlertCircle size={14} /> High-Probability Expected Questions
                            </h3>
                            <div className="space-y-3">
                              {expected.map((q, i) => (
                                <div key={i} className="bg-[#1a1a28] rounded-xl border border-[#f5c842]/20 p-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="badge badge-gold text-xs">Expected</span>
                                    <span className={`badge text-xs ${q.difficulty === 'easy' ? 'badge-green' : q.difficulty === 'hard' ? 'badge-red' : 'badge-gold'}`}>{q.difficulty}</span>
                                  </div>
                                  <p className="text-sm font-medium leading-snug">{q.question}</p>
                                  {q.options?.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                      {q.options.map((opt, oi) => (
                                        <p key={oi} className={`text-xs p-2 rounded-lg ${opt === q.correctAnswer ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'text-[#8888aa]'}`}>{opt}</p>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )

                  ) : (
                    // Flashcards
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {flashcards.map((card, i) => (
                        <div key={i} onClick={() => {
                          setFlippedCards(prev => {
                            const next = new Set(prev);
                            next.has(i) ? next.delete(i) : next.add(i);
                            return next;
                          });
                        }} className="cursor-pointer rounded-xl border border-[#2a2a3d] hover:border-[#22c55e] transition-all overflow-hidden min-h-[110px]">
                          <div className={`p-4 h-full ${flippedCards.has(i) ? 'bg-[#22c55e]/10' : 'bg-[#1a1a28]'}`}>
                            <div className="flex items-center justify-between mb-2">
                              <span className={`badge text-xs ${card.difficulty === 'easy' ? 'badge-green' : card.difficulty === 'hard' ? 'badge-red' : 'badge-gold'}`}>{card.difficulty}</span>
                              <RotateCcw size={12} className="text-[#8888aa]" />
                            </div>
                            {flippedCards.has(i) ? (
                              <p className="text-sm text-[#22c55e] font-medium">{card.back}</p>
                            ) : (
                              <p className="text-sm font-semibold">{card.front}</p>
                            )}
                            <p className="text-xs text-[#8888aa] mt-2">{flippedCards.has(i) ? '✅ Answer' : '👆 Click to reveal'}</p>
                          </div>
                        </div>
                      ))}
                      {flashcards.length === 0 && (
                        <div className="col-span-2 text-center text-[#8888aa] py-8">Click Flashcards tab to load</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!selectedSubject && (
        <div className="glass p-12 text-center">
          <BookOpen size={48} className="text-[#6c63ff] mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold mb-2">Choose a Subject to Begin</h3>
          <p className="text-[#8888aa]">Select any subject above to explore chapters with AI overview, PYQs from 1979–2024, and flashcards</p>
        </div>
      )}
    </div>
  );
}
