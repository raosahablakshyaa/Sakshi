'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(emailOrUsername, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="glass p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6c63ff] to-[#a78bfa] flex items-center justify-center text-2xl font-black mx-auto mb-4">S</div>
          <h1 className="text-2xl font-black">Welcome Back!</h1>
          <p className="text-[#8888aa] text-sm mt-1">Continue your IAS journey 🚀</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-[#8888aa] mb-1 block">Email or Username</label>
            <input
              type="text" 
              value={emailOrUsername} 
              onChange={e => setEmailOrUsername(e.target.value)}
              className="input-field" 
              placeholder="sakshi@example.com or sakshi_ias" 
              required
            />
            <p className="text-xs text-[#555] mt-1">💡 Use your email or unique username</p>
          </div>
          <div>
            <label className="text-sm text-[#8888aa] mb-1 block">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'} 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                className="input-field pr-10" 
                placeholder="••••••••" 
                required
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8888aa]">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
            {loading ? <><Loader2 size={18} className="spinner" /> Logging in...</> : 'Login to Mentor'}
          </button>
        </form>

        <p className="text-center text-sm text-[#8888aa] mt-6">
          New here?{' '}
          <Link href="/register" className="text-[#6c63ff] hover:text-[#a78bfa] font-semibold">
            Create your account
          </Link>
        </p>
      </div>
    </div>
  );
}
