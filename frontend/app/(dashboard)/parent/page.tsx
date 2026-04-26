'use client';
import { useState } from 'react';
import { parentAPI } from '@/lib/api';
import { Users, Search, Loader2, Flame, Trophy, BookOpen, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ChildData {
  child: { name: string; currentClass: number; streak: number; avatar: string; targetYear: number };
  summary: { totalStudyHours: number; totalQuestions: number; accuracy: number; activeDays: number; currentStreak: number; interviewSessions: number };
  weeklyData: Array<{ date: string; studyMinutes: number; questions: number; accuracy: number }>;
  subjects: Array<{ subject: string; attempted: number; accuracy: number }>;
  weakSubjects: string[];
  strongSubjects: string[];
}

export default function ParentPage() {
  const [email, setEmail] = useState('');
  const [childId, setChildId] = useState('');
  const [data, setData] = useState<ChildData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'search' | 'view'>('search');

  const findChild = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await parentAPI.findChild(email);
      setChildId(res.data._id);
      await loadChildData(res.data._id);
    } catch {
      setError('Student not found with this email. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadChildData = async (id: string) => {
    try {
      const res = await parentAPI.childProgress(id);
      setData(res.data);
      setStep('view');
    } catch {
      setError('Could not load student data.');
    }
  };

  if (step === 'search') {
    return (
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <Users size={24} className="text-[#ec4899]" /> Parent Dashboard
          </h1>
          <p className="text-[#8888aa] text-sm mt-1">Track your child's IAS preparation progress</p>
        </div>

        <div className="glass p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ec4899] to-[#f97316] flex items-center justify-center mx-auto mb-4">
            <Users size={28} className="text-white" />
          </div>
          <h2 className="text-xl font-black mb-2">Find Your Child's Progress</h2>
          <p className="text-[#8888aa] text-sm mb-6">Enter your child's registered email to view their study progress</p>

          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg mb-4">{error}</div>}

          <div className="flex gap-3 max-w-sm mx-auto">
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && findChild()}
              className="input-field flex-1" placeholder="child@example.com"
            />
            <button onClick={findChild} disabled={loading || !email.trim()} className="btn-primary px-4 disabled:opacity-50">
              {loading ? <Loader2 size={18} className="spinner" /> : <Search size={18} />}
            </button>
          </div>
        </div>

        <div className="glass p-6">
          <h3 className="font-bold mb-3">What you can track:</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['📊', 'Daily study time & questions'],
              ['🎯', 'Subject-wise accuracy'],
              ['🔥', 'Study streak & consistency'],
              ['⚠️', 'Weak areas needing attention'],
              ['🏆', 'Badges & achievements'],
              ['📈', 'Weekly progress charts'],
            ].map(([icon, text]) => (
              <div key={text} className="flex items-center gap-2 text-sm text-[#8888aa]">
                <span>{icon}</span> {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { child, summary, weeklyData, subjects, weakSubjects, strongSubjects } = data;

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <Users size={24} className="text-[#ec4899]" /> {child.name}'s Progress
          </h1>
          <p className="text-[#8888aa] text-sm mt-1">Class {child.currentClass} • Target: IAS {child.targetYear}</p>
        </div>
        <button onClick={() => setStep('search')} className="btn-ghost text-sm py-2 px-4">
          Switch Student
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Study Hours', value: summary.totalStudyHours, icon: Clock, color: '#6c63ff', sub: 'This month' },
          { label: 'Questions', value: summary.totalQuestions, icon: BookOpen, color: '#22c55e', sub: 'Solved' },
          { label: 'Accuracy', value: `${summary.accuracy}%`, icon: TrendingUp, color: '#f5c842', sub: 'Overall' },
          { label: 'Active Days', value: summary.activeDays, icon: Trophy, color: '#f97316', sub: 'This month' },
          { label: 'Streak', value: summary.currentStreak, icon: Flame, color: '#ef4444', sub: 'Days' },
          { label: 'Interviews', value: summary.interviewSessions, icon: Users, color: '#ec4899', sub: 'Practiced' },
        ].map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="stat-card text-center">
            <Icon size={18} style={{ color }} className="mx-auto mb-2" />
            <div className="text-xl font-black" style={{ color }}>{value}</div>
            <div className="text-xs font-semibold">{label}</div>
            <div className="text-xs text-[#8888aa]">{sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly chart */}
        <div className="glass p-6">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-[#6c63ff]" /> Weekly Study Activity
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <XAxis dataKey="date" tick={{ fill: '#8888aa', fontSize: 10 }} tickFormatter={d => d.slice(5)} />
              <YAxis tick={{ fill: '#8888aa', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#12121a', border: '1px solid #2a2a3d', borderRadius: 8, color: '#f0f0ff' }} />
              <Bar dataKey="studyMinutes" fill="#6c63ff" radius={[4, 4, 0, 0]} name="Study (min)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Subject performance */}
        <div className="glass p-6">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <BookOpen size={16} className="text-[#22c55e]" /> Subject Performance
          </h2>
          <div className="space-y-3">
            {subjects.slice(0, 6).map(s => (
              <div key={s.subject}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="capitalize">{s.subject}</span>
                  <span className={s.accuracy >= 70 ? 'text-green-400' : s.accuracy >= 50 ? 'text-yellow-400' : 'text-red-400'}>
                    {s.accuracy}% ({s.attempted} Qs)
                  </span>
                </div>
                <div className="progress-bar">
                  <div className={`progress-fill ${s.accuracy >= 70 ? 'progress-fill-green' : ''}`} style={{ width: `${s.accuracy}%` }} />
                </div>
              </div>
            ))}
            {subjects.length === 0 && <p className="text-[#8888aa] text-sm">No practice data yet</p>}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {weakSubjects.length > 0 && (
          <div className="glass p-5 border-orange-500/30">
            <h3 className="font-bold flex items-center gap-2 text-orange-400 mb-3">
              <AlertCircle size={16} /> Needs Attention
            </h3>
            <p className="text-sm text-[#8888aa] mb-3">These subjects have below 50% accuracy:</p>
            <div className="flex flex-wrap gap-2">
              {weakSubjects.map(s => <span key={s} className="badge badge-red capitalize">{s}</span>)}
            </div>
            <p className="text-xs text-[#8888aa] mt-3">💡 Encourage {child.name} to practice these subjects more</p>
          </div>
        )}
        {strongSubjects.length > 0 && (
          <div className="glass p-5 border-green-500/30">
            <h3 className="font-bold flex items-center gap-2 text-green-400 mb-3">
              <Trophy size={16} /> Strong Areas
            </h3>
            <p className="text-sm text-[#8888aa] mb-3">Performing well in:</p>
            <div className="flex flex-wrap gap-2">
              {strongSubjects.map(s => <span key={s} className="badge badge-green capitalize">{s}</span>)}
            </div>
            <p className="text-xs text-[#8888aa] mt-3">🌟 Great work! Keep encouraging {child.name}!</p>
          </div>
        )}
      </div>

      {/* Parent guidance */}
      <div className="glass p-6 border-[#6c63ff]/30">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          💡 Parent Guidance Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-[#8888aa]">
          <p>✅ Ensure {child.name} studies at least 2 hours daily</p>
          <p>✅ Celebrate small wins — every streak day matters!</p>
          <p>✅ Help create a distraction-free study environment</p>
          <p>✅ Discuss current affairs at dinner — makes it fun!</p>
          <p>✅ Encourage reading newspapers or news apps daily</p>
          <p>✅ Support the IAS dream — belief is the first step!</p>
        </div>
      </div>
    </div>
  );
}
