'use client';
import { useState, useEffect, useCallback } from 'react';
import { adminAPI, questionsAPI } from '@/lib/api';
import { Shield, Users, BookOpen, Newspaper, Activity, Loader2, Plus, Trophy } from 'lucide-react';

interface Stats { totalUsers: number; totalStudents: number; totalQuestions: number; totalArticles: number; todayActive: number; }
interface LeaderUser { rank: number; name: string; streak: number; totalQuestions: number; accuracy: number; currentClass: number; }

const SAMPLE_QUESTIONS = [
  { subject: 'history', topic: 'Ancient India', class: 7, difficulty: 'beginner', type: 'mcq', question: 'Which dynasty built the famous Ajanta Caves?', options: ['Maurya Dynasty', 'Gupta Dynasty', 'Vakataka Dynasty', 'Chola Dynasty'], correctAnswer: 'Vakataka Dynasty', explanation: 'The Ajanta Caves were primarily built during the Vakataka dynasty period (5th-6th century CE), though some early caves date to the Satavahana period.', upscRelevance: true, tags: ['ancient india', 'art', 'buddhism'] },
  { subject: 'polity', topic: 'Constitution', class: 9, difficulty: 'beginner', type: 'mcq', question: 'How many Fundamental Rights are guaranteed by the Indian Constitution?', options: ['5', '6', '7', '8'], correctAnswer: '6', explanation: 'The Indian Constitution originally had 7 Fundamental Rights, but the Right to Property was removed by the 44th Amendment in 1978, leaving 6 Fundamental Rights.', upscRelevance: true, tags: ['constitution', 'fundamental rights'] },
  { subject: 'geography', topic: 'Rivers', class: 8, difficulty: 'beginner', type: 'mcq', question: 'Which is the longest river in India?', options: ['Yamuna', 'Ganga', 'Godavari', 'Brahmaputra'], correctAnswer: 'Ganga', explanation: 'The Ganga is the longest river in India with a length of about 2,525 km. It originates from Gangotri glacier in Uttarakhand.', upscRelevance: true, tags: ['rivers', 'geography'] },
  { subject: 'science', topic: 'Environment', class: 8, difficulty: 'beginner', type: 'mcq', question: 'What is the main cause of the greenhouse effect?', options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'], correctAnswer: 'Carbon Dioxide', explanation: 'Carbon dioxide (CO2) is the primary greenhouse gas responsible for the greenhouse effect. It traps heat in the atmosphere, leading to global warming.', upscRelevance: true, tags: ['environment', 'climate change'] },
  { subject: 'economics', topic: 'Basic Economics', class: 10, difficulty: 'intermediate', type: 'mcq', question: 'What does GDP stand for?', options: ['Gross Domestic Product', 'General Development Plan', 'Government Development Policy', 'Gross Development Progress'], correctAnswer: 'Gross Domestic Product', explanation: 'GDP (Gross Domestic Product) is the total monetary value of all goods and services produced within a country in a specific time period. It is a key indicator of economic health.', upscRelevance: true, tags: ['economics', 'gdp'] },
];

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingQuestions, setAddingQuestions] = useState(false);
  const [addSuccess, setAddSuccess] = useState('');

  const loadData = useCallback(async () => {
    try {
      const [statsRes, lbRes] = await Promise.allSettled([adminAPI.stats(), adminAPI.leaderboard()]);
      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
      if (lbRes.status === 'fulfilled') setLeaderboard(lbRes.value.data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const addSampleQuestions = async () => {
    setAddingQuestions(true);
    try {
      await questionsAPI.bulkAdd({ questions: SAMPLE_QUESTIONS });
      setAddSuccess(`✅ Added ${SAMPLE_QUESTIONS.length} sample questions successfully!`);
      loadData();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setAddSuccess(`❌ Error: ${axiosErr.response?.data?.message || 'Failed to add questions'}`);
    } finally {
      setAddingQuestions(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="spinner text-[#6c63ff]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-black flex items-center gap-2">
          <Shield size={24} className="text-[#6c63ff]" /> Admin Panel
        </h1>
        <p className="text-[#8888aa] text-sm mt-1">Platform management and analytics</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: '#6c63ff' },
          { label: 'Students', value: stats?.totalStudents || 0, icon: Users, color: '#22c55e' },
          { label: 'Questions', value: stats?.totalQuestions || 0, icon: BookOpen, color: '#f5c842' },
          { label: 'Articles', value: stats?.totalArticles || 0, icon: Newspaper, color: '#06b6d4' },
          { label: 'Active Today', value: stats?.todayActive || 0, icon: Activity, color: '#f97316' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card text-center">
            <Icon size={20} style={{ color }} className="mx-auto mb-2" />
            <div className="text-2xl font-black" style={{ color }}>{value}</div>
            <div className="text-xs text-[#8888aa]">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="glass p-6">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <Plus size={16} className="text-[#6c63ff]" /> Quick Actions
          </h2>
          <div className="space-y-3">
            <div>
              <button onClick={addSampleQuestions} disabled={addingQuestions} className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50">
                {addingQuestions ? <><Loader2 size={16} className="spinner" /> Adding...</> : <><Plus size={16} /> Add Sample Questions (5 Questions)</>}
              </button>
              {addSuccess && <p className="text-sm mt-2 text-[#8888aa]">{addSuccess}</p>}
            </div>
            <div className="bg-[#1a1a28] rounded-xl p-4 text-sm text-[#8888aa]">
              <p className="font-semibold text-white mb-2">📋 Admin API Endpoints:</p>
              <p>POST /api/questions/bulk — Add bulk questions</p>
              <p>POST /api/currentaffairs — Add current affairs</p>
              <p>GET /api/admin/users — Manage users</p>
              <p>GET /api/admin/leaderboard — Top performers</p>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="glass p-6">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <Trophy size={16} className="text-[#f5c842]" /> Top Performers
          </h2>
          {leaderboard.length === 0 ? (
            <p className="text-[#8888aa] text-sm">No students yet. Share the platform!</p>
          ) : (
            <div className="space-y-3">
              {leaderboard.map(u => (
                <div key={u.rank} className="flex items-center gap-3 p-3 bg-[#1a1a28] rounded-xl">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${u.rank === 1 ? 'bg-[#f5c842] text-black' : u.rank === 2 ? 'bg-gray-400 text-black' : u.rank === 3 ? 'bg-orange-600 text-white' : 'bg-[#2a2a3d] text-[#8888aa]'}`}>
                    {u.rank}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{u.name}</div>
                    <div className="text-xs text-[#8888aa]">Class {u.currentClass} • {u.totalQuestions} Qs</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-[#f5c842]">{u.accuracy}%</div>
                    <div className="text-xs text-orange-400">🔥 {u.streak}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Platform info */}
      <div className="glass p-6">
        <h2 className="font-bold mb-4">🚀 Platform Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-[#1a1a28] rounded-xl p-4">
            <div className="font-semibold mb-2 text-[#22c55e]">✅ Active Features</div>
            <ul className="text-[#8888aa] space-y-1">
              <li>• AI Mentor (Gemini + Groq)</li>
              <li>• NCERT Hub (Class 6-12)</li>
              <li>• Daily Practice Engine</li>
              <li>• Mock Interview System</li>
              <li>• Current Affairs + Quiz</li>
              <li>• Progress Dashboard</li>
              <li>• Parent Dashboard</li>
            </ul>
          </div>
          <div className="bg-[#1a1a28] rounded-xl p-4">
            <div className="font-semibold mb-2 text-[#f5c842]">⚙️ Configuration Needed</div>
            <ul className="text-[#8888aa] space-y-1">
              <li>• GEMINI_API_KEY</li>
              <li>• GROQ_API_KEY</li>
              <li>• NEWS_API_KEY</li>
              <li>• MONGODB_URI</li>
              <li>• JWT_SECRET</li>
            </ul>
          </div>
          <div className="bg-[#1a1a28] rounded-xl p-4">
            <div className="font-semibold mb-2 text-[#6c63ff]">🔮 Coming Soon</div>
            <ul className="text-[#8888aa] space-y-1">
              <li>• Firebase Google Auth</li>
              <li>• Email notifications</li>
              <li>• Razorpay payments</li>
              <li>• Mobile app (React Native)</li>
              <li>• AI answer evaluation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
