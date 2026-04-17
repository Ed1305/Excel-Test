import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import CandidateView from './pages/CandidateView';
import RecruiterDashboard from './pages/RecruiterDashboard';
import { cn } from './lib/utils';
import { FileSpreadsheet, Lock } from 'lucide-react';

function Navigation() {
  const location = useLocation();
  const isRecruiter = location.pathname === '/recruiter';

  // We explicitly decouple the links so the applicant doesn't see the recruiter path.
  // The recruiter simply uses the `/recruiter` link directly.
  return (
    <header className="h-[60px] bg-[#107C41] text-white flex items-center justify-between px-6 shadow-sm shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white text-[#107C41] flex items-center justify-center font-bold rounded">
          <FileSpreadsheet size={20} />
        </div>
        <h1 className="text-[18px] font-semibold">SkillAssess</h1>
      </div>
      <div className="flex items-center space-x-2">
        {isRecruiter ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded text-sm font-semibold bg-white/10 border border-white/20">
            <Lock size={14} /> Recruiter View
          </div>
        ) : (
          <div className="px-3 py-1.5 rounded text-sm font-semibold border bg-white/10 border-white/20">
            Take Assessment
          </div>
        )}
      </div>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#F3F4F6] font-sans text-[#1F2937] select-none overflow-hidden">
        <Navigation />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<CandidateView />} />
            <Route path="/recruiter" element={<RecruiterDashboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
