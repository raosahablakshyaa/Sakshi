'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bot, BookOpen, Target, Mic2, Newspaper, BarChart3, Star, ArrowRight, Flame, Trophy, Zap } from 'lucide-react';

const features = [
  { icon: Bot, title: 'AI Mentor 24/7', desc: 'Your personal IAS mentor available anytime. Ask anything — from NCERT to UPSC.', color: '#6c63ff' },
  { icon: BookOpen, title: 'NCERT Hub', desc: 'Complete Class 6-12 NCERT with AI summaries, flashcards & UPSC connections.', color: '#22c55e' },
  { icon: Target, title: 'Daily Practice', desc: 'MCQs, GK quizzes, current affairs — personalized to your weak areas.', color: '#f5c842' },
  { icon: Mic2, title: 'Mock Interview', desc: 'Simulate real IAS personality test with AI feedback and confidence building.', color: '#f97316' },
  { icon: Newspaper, title: 'Current Affairs', desc: 'Daily news simplified for UPSC. Auto-generated quizzes from today\'s news.', color: '#06b6d4' },
  { icon: BarChart3, title: 'Smart Dashboard', desc: 'Track streaks, accuracy, weak subjects, and your IAS readiness score.', color: '#ec4899' },
];

const stats = [
  { value: '10+', label: 'Subjects Covered', icon: BookOpen },
  { value: '7→IAS', label: 'Class 7 to IAS', icon: Trophy },
  { value: '24/7', label: 'AI Mentor Access', icon: Bot },
  { value: '₹0', label: 'Coaching Cost', icon: Zap },
];

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#6c63ff] border-t-transparent rounded-full spinner mx-auto mb-4" />
          <p className="text-[#8888aa]">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="min-h-screen hero-bg">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a3d] max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6c63ff] to-[#a78bfa] flex items-center justify-center font-bold text-sm">S</div>
          <span className="font-bold text-lg">Sakshi's Mentor</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-ghost text-sm py-2 px-4">Login</Link>
          <Link href="/register" className="btn-primary text-sm py-2 px-4">Start Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 badge badge-primary mb-6 text-sm py-2 px-4">
            <Flame size={14} className="text-orange-400" />
            Built for Sakshi's IAS Dream 🇮🇳
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Your Personal<br />
            <span className="gradient-text">IAS Mentor</span><br />
            Available 24/7
          </h1>
          <p className="text-xl text-[#8888aa] max-w-2xl mx-auto mb-8 leading-relaxed">
            From Class 7 to IAS Officer — complete preparation ecosystem with AI mentor, NCERT hub, mock interviews, and daily practice. <strong className="text-white">No expensive coaching needed.</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-primary text-base py-3 px-8 flex items-center gap-2 justify-center pulse-glow">
              Start Your IAS Journey <ArrowRight size={18} />
            </Link>
            <Link href="/login" className="btn-ghost text-base py-3 px-8">
              Already have account
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto"
        >
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="glass p-4 text-center">
              <Icon size={20} className="text-[#6c63ff] mx-auto mb-2" />
              <div className="text-2xl font-black gradient-text">{value}</div>
              <div className="text-xs text-[#8888aa] mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black mb-3">Everything You Need to Become IAS</h2>
          <p className="text-[#8888aa]">Not just a study app — your complete personal mentor system</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc, color }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="glass glass-hover p-6"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
                <Icon size={22} style={{ color }} />
              </div>
              <h3 className="font-bold text-lg mb-2">{title}</h3>
              <p className="text-[#8888aa] text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="glass p-10 glow-primary">
          <Star size={32} className="text-[#f5c842] mx-auto mb-4" />
          <h2 className="text-3xl font-black mb-4">
            "I don't need expensive coaching.<br />
            <span className="gradient-text-gold">I have Sakshi's Mentor."</span>
          </h2>
          <p className="text-[#8888aa] text-lg mb-8">
            This is a family mission. Built with love, powered by AI, driven by the dream of serving India as an IAS officer.
          </p>
          <Link href="/register" className="btn-primary text-base py-3 px-10 inline-flex items-center gap-2">
            Begin Your Journey Today <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2a2a3d] py-8 text-center text-[#8888aa] text-sm">
        <p>Sakshi's Mentor © 2024 — Built with ❤️ for Sakshi's IAS Dream 🇮🇳</p>
      </footer>
    </div>
  );
}
