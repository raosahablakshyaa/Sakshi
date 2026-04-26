'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, Zap, Brain, Heart } from 'lucide-react';

export default function LearningProfilePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    learningSpeed: 'medium',
    learningStyle: 'mixed',
    weakSubjects: [],
    personalityTraits: [],
    motivationFactors: [],
    mentorNotes: ''
  });

  const learningSpeedOptions = [
    { value: 'slow', label: '🐢 Slow', desc: 'I prefer detailed explanations with lots of examples' },
    { value: 'medium', label: '🚶 Medium', desc: 'I like a balanced pace with good depth' },
    { value: 'fast', label: '🚀 Fast', desc: 'I learn quickly and like advanced concepts' }
  ];

  const learningStyleOptions = [
    { value: 'visual', label: '👁️ Visual', desc: 'I learn best with diagrams and visuals' },
    { value: 'textual', label: '📖 Textual', desc: 'I prefer reading and detailed explanations' },
    { value: 'interactive', label: '🎮 Interactive', desc: 'I learn by doing and practicing' },
    { value: 'mixed', label: '🎨 Mixed', desc: 'I like a combination of all methods' }
  ];

  const subjectOptions = ['History', 'Geography', 'Polity', 'Economics', 'Science', 'Environment', 'Mathematics'];
  
  const personalityOptions = ['Ambitious', 'Curious', 'Hardworking', 'Creative', 'Analytical', 'Determined', 'Focused'];
  
  const motivationOptions = ['Success Stories', 'Competition', 'Personal Growth', 'Service to Nation', 'Family Pride', 'Challenge', 'Recognition'];

  const toggleArray = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8080/api/ai/profile/learning', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });

      if (res.ok) {
        router.push('/dashboard/mentor');
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f1a] to-[#1a1a28] p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-2">🎯 Personalize Your Learning</h1>
          <p className="text-[#8888aa]">Help Sakshi's Mentor understand you better</p>
          <div className="flex gap-1 mt-4 justify-center">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-[#6c63ff]' : 'bg-[#2a2a3d]'}`} />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="glass p-8 rounded-xl space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Zap size={20} className="text-[#f5c842]" /> What's Your Learning Speed?
              </h2>
              <p className="text-[#8888aa] text-sm">This helps me adjust the pace and depth of explanations</p>
            </div>
            <div className="space-y-3">
              {learningSpeedOptions.map(option => (
                <button key={option.value} onClick={() => setProfile(prev => ({ ...prev, learningSpeed: option.value }))}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${profile.learningSpeed === option.value ? 'border-[#6c63ff] bg-[#6c63ff]/10' : 'border-[#2a2a3d] hover:border-[#6c63ff]/50'}`}>
                  <div className="font-bold text-sm mb-1">{option.label}</div>
                  <div className="text-xs text-[#8888aa]">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="glass p-8 rounded-xl space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Brain size={20} className="text-[#06b6d4]" /> How Do You Learn Best?
              </h2>
              <p className="text-[#8888aa] text-sm">Choose your preferred learning style</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {learningStyleOptions.map(option => (
                <button key={option.value} onClick={() => setProfile(prev => ({ ...prev, learningStyle: option.value }))}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${profile.learningStyle === option.value ? 'border-[#6c63ff] bg-[#6c63ff]/10' : 'border-[#2a2a3d] hover:border-[#6c63ff]/50'}`}>
                  <div className="font-bold text-sm mb-1">{option.label}</div>
                  <div className="text-xs text-[#8888aa]">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="glass p-8 rounded-xl space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">📚 Which subjects are challenging?</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {subjectOptions.map(subject => (
                  <button key={subject} onClick={() => toggleArray('weakSubjects', subject)}
                    className={`px-4 py-2 rounded-lg border transition-all text-sm ${profile.weakSubjects.includes(subject) ? 'bg-red-500/20 border-red-500 text-red-300' : 'border-[#2a2a3d] text-[#8888aa] hover:border-red-500/50'}`}>
                    {subject}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Heart size={20} className="text-[#ec4899]" /> What describes you?
              </h2>
              <div className="flex flex-wrap gap-2">
                {personalityOptions.map(trait => (
                  <button key={trait} onClick={() => toggleArray('personalityTraits', trait)}
                    className={`px-4 py-2 rounded-lg border transition-all text-sm ${profile.personalityTraits.includes(trait) ? 'bg-[#6c63ff]/20 border-[#6c63ff] text-[#a78bfa]' : 'border-[#2a2a3d] text-[#8888aa] hover:border-[#6c63ff]/50'}`}>
                    {trait}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="glass p-8 rounded-xl space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">🔥 What motivates you?</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {motivationOptions.map(factor => (
                  <button key={factor} onClick={() => toggleArray('motivationFactors', factor)}
                    className={`px-4 py-2 rounded-lg border transition-all text-sm ${profile.motivationFactors.includes(factor) ? 'bg-[#f5c842]/20 border-[#f5c842] text-[#fbbf24]' : 'border-[#2a2a3d] text-[#8888aa] hover:border-[#f5c842]/50'}`}>
                    {factor}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">📝 Anything else I should know?</h2>
              <textarea value={profile.mentorNotes} onChange={e => setProfile(prev => ({ ...prev, mentorNotes: e.target.value }))}
                className="w-full bg-[#1a1a28] border border-[#2a2a3d] text-[#c0c0d0] p-4 rounded-lg focus:border-[#6c63ff] outline-none"
                placeholder="E.g., I struggle with time management, I prefer Hindi explanations..."
                rows={4}
              />
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-8">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="btn-ghost flex-1 py-3">
              ← Back
            </button>
          )}
          {step < 4 ? (
            <button onClick={() => setStep(step + 1)} className="btn-primary flex-1 py-3">
              Next →
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={16} className="spinner" /> Saving...</> : <><CheckCircle2 size={16} /> Complete Setup</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
