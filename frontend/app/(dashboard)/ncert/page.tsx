'use client';
import { useState, useEffect, useCallback } from 'react';
import { ncertAPI } from '@/lib/api';
import { BookOpen, ChevronRight, Loader2, RotateCcw, Sparkles, FileText, Trophy, AlertCircle, ExternalLink, BookMarked, Lightbulb } from 'lucide-react';

interface Chapter { index: number; title: string; }
interface PYQ {
  year: number; exam: string; paper: string; question: string;
  options: string[]; correctAnswer: string; explanation: string;
  difficulty: string; topic: string;
}
interface YouTubeVideo {
  title: string; channel: string; duration: string; url: string; description: string; quality: string;
}

const SUBJECTS = [
  { key: 'history', label: 'History', icon: '🏛️', color: '#f97316' },
  { key: 'geography', label: 'Geography', icon: '🌍', color: '#22c55e' },
  { key: 'polity', label: 'Political Science', icon: '⚖️', color: '#6c63ff' },
  { key: 'economics', label: 'Economics', icon: '📊', color: '#f5c842' },
  { key: 'science', label: 'Science', icon: '🔬', color: '#06b6d4' },
];
const CLASSES = [6, 7, 8, 9, 10, 11, 12];
type Tab = 'pyqs' | 'videos' | 'resources';

const STUDY_RESOURCES = [
  {
    title: 'IAS Study Materials',
    description: 'Comprehensive free online notes for all UPSC subjects',
    icon: '📚',
    url: 'https://www.clearias.com/ias-study-materials/',
    color: 'from-blue-500/20 to-blue-600/20',
    borderColor: 'border-blue-500/30'
  },
  {
    title: 'UPSC CSE Syllabus',
    description: 'Complete UPSC Civil Services Exam syllabus breakdown',
    icon: '📋',
    url: 'https://www.clearias.com/upsc-cse-syllabus/',
    color: 'from-purple-500/20 to-purple-600/20',
    borderColor: 'border-purple-500/30'
  },
  {
    title: 'Previous Year Questions',
    description: 'UPSC IAS/IPS previous year question papers and solutions',
    icon: '🎯',
    url: 'https://www.clearias.com/upsc-civil-services-exam-previous-year-question-papers-ias-ips/',
    color: 'from-orange-500/20 to-orange-600/20',
    borderColor: 'border-orange-500/30'
  }
];

export default function NCERTPage() {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedClass, setSelectedClass] = useState(7);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('pyqs');
  const [pyqs, setPyqs] = useState<PYQ[]>([]);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);
  const [expandedPYQ, setExpandedPYQ] = useState<number | null>(null);
  const [pyqAnswers, setPyqAnswers] = useState<Record<number, string>>({});
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);

  const loadChapters = useCallback(async () => {
    if (!selectedSubject) return;
    setLoadingChapters(true);
    setChapters([]);
    setSelectedChapter(null);
    setPyqs([]);
    setVideos([]);
    try {
      const res = await ncertAPI.chapters({ subject: selectedSubject, class: selectedClass });
      setChapters(res.data.chapters);
    } catch { /* silent */ }
    finally { setLoadingChapters(false); }
  }, [selectedSubject, selectedClass]);

  useEffect(() => { loadChapters(); }, [loadChapters]);

  const loadChapter = async (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setPyqs([]);
    setVideos([]);
    setPyqAnswers({});
    setExpandedPYQ(null);
    setActiveTab('pyqs');
  };

  const loadPYQs = async () => {
    if (!selectedChapter) return;
    setActiveTab('pyqs');
    setLoadingContent(true);
    try {
      const res = await ncertAPI.pyqs({ subject: selectedSubject, chapter: selectedChapter.title, class: selectedClass });
      setPyqs(res.data.pyqs);
    } catch { /* silent */ }
    finally { setLoadingContent(false); }
  };

  const loadVideos = async () => {
    if (!selectedChapter) return;
    setActiveTab('videos');
    setLoadingVideos(true);
    try {
      const res = await ncertAPI.youtubeVideos({ subject: selectedSubject, chapter: selectedChapter.title, class: selectedClass });
      setVideos(res.data.videos);
    } catch { /* silent */ }
    finally { setLoadingVideos(false); }
  };

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
        <p className="text-[#8888aa] text-sm mt-1">Complete NCERT Class 6–12 with PYQs & YouTube Videos</p>
      </div>

      {/* Study Resources Section */}
      <div className="glass p-6 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb size={20} className="text-[#f5c842]" />
          <h2 className="text-lg font-bold">📖 External Study Resources</h2>
        </div>
        <p className="text-[#8888aa] text-sm mb-4">Access free UPSC preparation materials from ClearIAS</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STUDY_RESOURCES.map((resource, idx) => (
            <a
              key={idx}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group p-4 rounded-xl border ${resource.borderColor} bg-gradient-to-br ${resource.color} hover:shadow-lg hover:shadow-[#6c63ff]/20 transition-all duration-300 cursor-pointer`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{resource.icon}</span>
                <ExternalLink size={16} className="text-[#8888aa] group-hover:text-[#6c63ff] transition-colors" />
              </div>
              <h3 className="font-bold text-sm mb-1 group-hover:text-[#6c63ff] transition-colors">{resource.title}</h3>
              <p className="text-xs text-[#8888aa] leading-relaxed">{resource.description}</p>
              <div className="mt-3 flex items-center gap-1 text-[#6c63ff] text-xs font-semibold group-hover:gap-2 transition-all">
                Visit Resource <ChevronRight size={12} />
              </div>
            </a>
          ))}
        </div>
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
                <p className="text-[#8888aa] text-sm max-w-xs">Click any chapter to access PYQs and YouTube videos</p>
              </div>
            ) : (
              <div className="glass rounded-xl overflow-hidden flex flex-col h-full">
                {/* Chapter header */}
                <div className="p-4 border-b border-[#2a2a3d]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge badge-primary text-xs">Chapter {selectedChapter.index}</span>
                    <span className="badge badge-green text-xs">{subjectInfo?.label} • Class {selectedClass}</span>
                  </div>
                  <h2 className="font-black text-base mb-3">{selectedChapter.title}</h2>
                  
                  {/* Download button */}
                  <a href="https://ncert.nic.in/textbook.php" target="_blank" rel="noopener noreferrer"
                    className="btn-primary text-sm py-2 px-4 flex items-center gap-2 justify-center w-full">
                    <FileText size={14} /> Download NCERT PDF
                  </a>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-[#2a2a3d]">
                  <button onClick={loadPYQs}
                    className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${activeTab === 'pyqs' ? 'text-[#f5c842] border-b-2 border-[#f5c842] bg-[#f5c842]/5' : 'text-[#8888aa] hover:text-white'}`}>
                    <Trophy size={13} /> PYQs {pyqs.length > 0 && <span className="badge badge-gold text-xs px-1.5 py-0">{pyqs.length}</span>}
                  </button>
                  <button onClick={loadVideos}
                    className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${activeTab === 'videos' ? 'text-[#06b6d4] border-b-2 border-[#06b6d4] bg-[#06b6d4]/5' : 'text-[#8888aa] hover:text-white'}`}>
                    <FileText size={13} /> Videos {videos.length > 0 && <span className="badge badge-primary text-xs px-1.5 py-0">{videos.length}</span>}
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 p-5 overflow-y-auto">
                  {loadingContent || loadingVideos ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                      <Loader2 size={28} className="spinner text-[#6c63ff]" />
                      <p className="text-[#8888aa] text-sm">
                        {activeTab === 'pyqs' ? 'Fetching all PYQs from 1979–2024...' : 'Finding best YouTube videos...'}
                      </p>
                    </div>
                  ) : activeTab === 'pyqs' ? (
                    pyqs.length === 0 ? (
                      <div className="text-center py-10 text-[#8888aa]">
                        <Trophy size={32} className="mx-auto mb-3 opacity-40" />
                        <p>Click the PYQs tab to load questions</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
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
                      </div>
                    )
                  ) : (
                    videos.length === 0 ? (
                      <div className="text-center py-10 text-[#8888aa]">
                        <FileText size={32} className="mx-auto mb-3 opacity-40" />
                        <p>Click the Videos tab to load YouTube resources</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {videos.map((video, i) => (
                          <a key={i} href={video.url} target="_blank" rel="noopener noreferrer"
                            className="block p-4 bg-[#1a1a28] rounded-xl border border-[#2a2a3d] hover:border-[#06b6d4] transition-all group">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div>
                                <h3 className="font-semibold text-sm group-hover:text-[#06b6d4] transition">{video.title}</h3>
                                <p className="text-xs text-[#8888aa] mt-1">{video.channel} • {video.duration}</p>
                              </div>
                              <span className={`badge text-xs flex-shrink-0 ${
                                video.quality === 'excellent' ? 'badge-green' : video.quality === 'good' ? 'badge-gold' : 'badge-primary'
                              }`}>{video.quality}</span>
                            </div>
                            <p className="text-xs text-[#c0c0d0]">{video.description}</p>
                            <div className="mt-3 flex items-center gap-2 text-[#06b6d4] text-xs font-semibold group-hover:gap-3 transition-all">
                              Watch on YouTube <ChevronRight size={12} />
                            </div>
                          </a>
                        ))}
                      </div>
                    )
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
          <p className="text-[#8888aa]">Select any subject above to explore chapters with PYQs and YouTube videos</p>
        </div>
      )}
    </div>
  );
}
