'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', currentClass: '7', role: 'student', parentEmail: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const router = useRouter();

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register({ ...form, currentClass: parseInt(form.currentClass) });
      router.push('/dashboard');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="glass p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6c63ff] to-[#f5c842] flex items-center justify-center text-2xl font-black mx-auto mb-4">S</div>
          <h1 className="text-2xl font-black">Start Your IAS Journey</h1>
          <p className="text-[#8888aa] text-sm mt-1">Create your free account today 🎯</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-[#8888aa] mb-1 block">Full Name</label>
            <input type="text" value={form.name} onChange={e => set('name', e.target.value)} className="input-field" placeholder="Sakshi" required />
          </div>
          <div>
            <label className="text-sm text-[#8888aa] mb-1 block">Email</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className="input-field" placeholder="sakshi@example.com" required />
          </div>
          <div>
            <label className="text-sm text-[#8888aa] mb-1 block">Password</label>
            <input type="password" value={form.password} onChange={e => set('password', e.target.value)} className="input-field" placeholder="Min 6 characters" required minLength={6} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-[#8888aa] mb-1 block">I am a</label>
              <select value={form.role} onChange={e => set('role', e.target.value)} className="input-field">
                <option value="student">Student</option>
                <option value="parent">Parent</option>
              </select>
            </div>
            {form.role === 'student' && (
              <div>
                <label className="text-sm text-[#8888aa] mb-1 block">Current Class</label>
                <select value={form.currentClass} onChange={e => set('currentClass', e.target.value)} className="input-field">
                  {[6,7,8,9,10,11,12].map(c => <option key={c} value={c}>Class {c}</option>)}
                </select>
              </div>
            )}
          </div>
          {form.role === 'student' && (
            <div>
              <label className="text-sm text-[#8888aa] mb-1 block">Parent Email (optional)</label>
              <input type="email" value={form.parentEmail} onChange={e => set('parentEmail', e.target.value)} className="input-field" placeholder="parent@example.com" />
            </div>
          )}
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
            {loading ? <><Loader2 size={18} className="spinner" /> Creating account...</> : 'Create Free Account'}
          </button>
        </form>

        <p className="text-center text-sm text-[#8888aa] mt-6">
          Already have account?{' '}
          <Link href="/login" className="text-[#6c63ff] hover:text-[#a78bfa] font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
}
