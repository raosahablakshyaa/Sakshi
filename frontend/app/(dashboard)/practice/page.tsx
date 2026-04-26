'use client';
import { Target } from 'lucide-react';

export default function PracticePage() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#6c63ff] to-[#f5c842] flex items-center justify-center text-4xl mx-auto mb-4">
            🚀
          </div>
          <h1 className="text-3xl font-black mb-2">Coming Soon!</h1>
          <p className="text-[#8888aa] text-lg mb-4">Daily Practice feature is under development</p>
        </div>
        
        <div className="glass p-6 rounded-xl mb-6">
          <div className="space-y-3 text-left">
            <div className="flex items-start gap-3">
              <span className="text-[#6c63ff] text-xl mt-1">✨</span>
              <div>
                <p className="font-semibold text-sm">50 Questions Per Subject</p>
                <p className="text-xs text-[#8888aa]">25 AI-generated + 25 PYQ</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#f5c842] text-xl mt-1">📊</span>
              <div>
                <p className="font-semibold text-sm">Class-Wise Questions</p>
                <p className="text-xs text-[#8888aa]">Tailored for your level</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#22c55e] text-xl mt-1">🎯</span>
              <div>
                <p className="font-semibold text-sm">Daily Reset at 5 AM IST</p>
                <p className="text-xs text-[#8888aa]">Fresh questions every day</p>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-[#8888aa] text-sm">We're preparing amazing content for you. Check back soon! 💪</p>
      </div>
    </div>
  );
}
