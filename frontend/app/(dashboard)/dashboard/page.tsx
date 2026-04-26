'use client';
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { progressAPI, aiAPI } from '@/lib/api';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Flame, Target, BookOpen, Bot, Mic2, Newspaper, Trophy, TrendingUp, AlertCircle, Star, ArrowRight, Zap } from 'lucide-react';

interface DashboardData {
  user: { name: string; streak: number; currentClass: number; avatar: string };
  today: { questionsAttempted: number; questionsCorrect: number; studyMinutes: number };
  overall: { totalAttempted: number; totalCorrect: number; accuracy: number; streak: number };
  subjects: Array<{ subject: string; attempted: number; accuracy: number }>;
  weakSubjects: string[];
  strongSubjects: string[];
  weeklyData: Array<{ date: string; questions: number; accuracy: number; studyMinutes: number }>;
  badges: Array<{ name: string; icon: string; description: string }>;
  interviewReadiness: number;
}

const quickActions = [
  { href: '/mentor', icon: Bot, label: 'Ask AI Mentor', color: '#6c63ff', desc: 'Get instant help' },
  { href: '/practice', icon: Target, label: 'Daily Practice', color: '#f5c842', desc: 'Solve questions' },
  { href: '/ncert', icon: BookOpen, label: 'NCERT Hub', color: '#22c55e', desc: 'Study chapters' },
  { href: '/interview', icon: Mic2, label: 'Mock Interview', color: '#f97316', desc: 'Practice IAS interview' },
  { href: '/current-affairs', icon: Newspaper, label: 'Current Affairs', color: '#06b6d4', desc: 'Today\'s news' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [motivation, setMotivation] = useState('');
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    try {
      const [dashRes, motRes] = await Promise.allSettled([
        progressAPI.dashboard(),
        aiAPI.motivation()
      ]);
      if (dashRes.status === 'fulfilled') setData(dashRes.value.data);
      if (motRes.status === 'fulfilled') setMotivation(motRes.value.data.motivation);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#6c63ff] border-t-transparent rounded-full spinner mx-auto mb-3" />
          <p className="text-[#8888aa]">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const today = data?.today;
  const overall = data?.overall;
  const todayAccuracy = today?.questionsAttempted ? Math.round((today.questionsCorrect / today.questionsAttempted) * 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black">
            Jai Hind, <span className="gradient-text">{user?.name || 'Sakshi'}</span>! 🇮🇳
          </h1>
          <p className="text-[#8888aa] text-sm mt-1">
            Class {user?.currentClass} → IAS Officer 2035. Keep going! 💪
          </p>
        </div>
        <div className="flex items-center gap-3">
          {(data?.overall.streak || 0) > 0 && (
            <div className="glass px-4 py-2 flex items-center gap-2">
              <Flame size={18} className="text-orange-400 streak-fire" />
              <span className="font-bold text-orange-400">{data?.overall.streak} day streak!</span>
            </div>
          )}
        </div>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Today's Questions", value: today?.questionsAttempted || 0, icon: Target, color: '#6c63ff', sub: `${today?.questionsCorrect || 0} correct` },
          { label: "Today's Accuracy", value: `${todayAccuracy}%`, icon: TrendingUp, color: '#22c55e', sub: 'Keep improving!' },
          { label: 'Study Time', value: `${today?.studyMinutes || 0}m`, icon: Zap, color: '#f5c842', sub: 'Today' },
          { label: 'Overall Accuracy', value: `${overall?.accuracy || 0}%`, icon: Trophy, color: '#f97316', sub: `${overall?.totalAttempted || 0} total` },
        ].map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[#8888aa]">{label}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
                <Icon size={16} style={{ color }} />
              </div>
            </div>
            <div className="text-2xl font-black" style={{ color }}>{value}</div>
            <div className="text-xs text-[#8888aa] mt-1">{sub}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {quickActions.map(({ href, icon: Icon, label, color, desc }) => (
            <Link key={href} href={href} className="glass glass-hover p-4 text-center group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: `${color}20` }}>
                <Icon size={20} style={{ color }} />
              </div>
              <div className="text-sm font-semibold">{label}</div>
              <div className="text-xs text-[#8888aa] mt-1">{desc}</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Chart */}
        <div className="lg:col-span-2 glass p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-[#6c63ff]" /> Weekly Progress
          </h2>
          {data?.weeklyData && data.weeklyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={data.weeklyData}>
                <defs>
                  <linearGradient id="colorQ" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6c63ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: '#8888aa', fontSize: 11 }} tickFormatter={d => d.slice(5)} />
                <YAxis tick={{ fill: '#8888aa', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#12121a', border: '1px solid #2a2a3d', borderRadius: 8, color: '#f0f0ff' }} />
                <Area type="monotone" dataKey="questions" stroke="#6c63ff" fill="url(#colorQ)" strokeWidth={2} name="Questions" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-[#8888aa] text-sm">
              Start practicing to see your progress chart! 📈
            </div>
          )}
        </div>

        {/* Subjects */}
        <div className="glass p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <BookOpen size={18} className="text-[#22c55e]" /> Subject Performance
          </h2>
          {data?.subjects && data.subjects.length > 0 ? (
            <div className="space-y-3">
              {data.subjects.slice(0, 5).map(s => (
                <div key={s.subject}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="capitalize">{s.subject}</span>
                    <span className={s.accuracy >= 70 ? 'text-green-400' : s.accuracy >= 50 ? 'text-yellow-400' : 'text-red-400'}>
                      {s.accuracy}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${s.accuracy >= 70 ? 'progress-fill-green' : s.accuracy >= 50 ? '' : 'bg-red-500'}`}
                      style={{ width: `${s.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#8888aa] text-sm">Practice questions to see subject stats!</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weak Areas Alert */}
        {data?.weakSubjects && data.weakSubjects.length > 0 && (
          <div className="glass p-6 border-orange-500/30">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2 text-orange-400">
              <AlertCircle size={18} /> Focus Areas
            </h2>
            <p className="text-[#8888aa] text-sm mb-3">These subjects need more attention:</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {data.weakSubjects.map(s => (
                <span key={s} className="badge badge-red capitalize">{s}</span>
              ))}
            </div>
            <Link href="/practice" className="btn-primary text-sm py-2 px-4 inline-flex items-center gap-2">
              Practice Now <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* Badges */}
        {data?.badges && data.badges.length > 0 && (
          <div className="glass p-6">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Star size={18} className="text-[#f5c842]" /> Your Badges
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {data.badges.map(b => (
                <div key={b.name} className="bg-[#1a1a28] rounded-xl p-3 text-center border border-[#2a2a3d]">
                  <div className="text-2xl mb-1">{b.icon}</div>
                  <div className="text-xs font-bold">{b.name}</div>
                  <div className="text-xs text-[#8888aa]">{b.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Daily Motivation */}
        {motivation && (
          <div className="glass p-6 border-[#6c63ff]/30 glow-primary lg:col-span-2">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Star size={18} className="text-[#f5c842]" /> Today's Motivation from Your Mentor
            </h2>
            <p className="text-[#8888aa] text-sm leading-relaxed whitespace-pre-line">{motivation}</p>
          </div>
        )}
      </div>

      {/* IAS Readiness */}
      <div className="glass p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Trophy size={18} className="text-[#f5c842]" /> IAS Readiness Score
          </h2>
          <span className="text-2xl font-black gradient-text-gold">{data?.interviewReadiness || 0}%</span>
        </div>
        <div className="progress-bar mb-2">
          <div className="progress-fill-gold h-full rounded-full transition-all duration-1000" style={{ width: `${data?.interviewReadiness || 0}%`, background: 'linear-gradient(90deg, #f5c842, #f97316)' }} />
        </div>
        <p className="text-xs text-[#8888aa]">Keep practicing daily to increase your readiness score. Every question counts! 🎯</p>
      </div>
    </div>
  );
}
