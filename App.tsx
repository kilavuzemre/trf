
import React, { useState, useEffect } from 'react';
import { PLANNING_DATA } from './constants';
import { PlanningData, Team, Task } from './types';
import Dashboard from './components/Dashboard';
import Timeline from './components/Timeline';
import TeamCard from './components/TeamCard';
import AIAssistant from './components/AIAssistant';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import { Calendar, LayoutDashboard, List, MessageSquare, ShieldCheck, Search, Lock } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'teams' | 'ai' | 'admin'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState<PlanningData>(PLANNING_DATA);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Sync state with local storage to persist admin changes during session
  useEffect(() => {
    const saved = localStorage.getItem('fethiye_jandarma_plan');
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  const updateData = (newData: PlanningData) => {
    setData(newData);
    localStorage.setItem('fethiye_jandarma_plan', JSON.stringify(newData));
  };

  const filteredTeams = data.teams.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.leader.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.tasks.some(t => t.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">Fethiye Trafik Tim</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-tighter">İlçe Jandarma Komutanlığı</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <div className="flex bg-slate-800 rounded-full px-4 py-2 border border-slate-700 items-center gap-2">
              <Calendar size={16} className="text-blue-400" />
              <span className="text-sm font-medium">{data.date}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Navigation Tabs (Desktop) */}
        <div className="flex flex-wrap gap-2 mb-8 bg-slate-800/50 p-1 rounded-2xl w-fit border border-slate-700">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-700'}`}
          >
            <LayoutDashboard size={18} />
            Genel Bakış
          </button>
          <button 
            onClick={() => setActiveTab('teams')}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'teams' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-700'}`}
          >
            <List size={18} />
            Tim Detayları
          </button>
          <button 
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'ai' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-700'}`}
          >
            <MessageSquare size={18} />
            Yapay Zeka
          </button>
          <button 
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'admin' ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20' : 'text-slate-400 hover:bg-slate-700'}`}
          >
            <Lock size={18} />
            Yönetim
          </button>
        </div>

        {/* View Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <Dashboard data={data} />
            <Timeline data={data} />
          </div>
        )}

        {activeTab === 'teams' && (
          <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold">Trafik Timleri Görev Detayları</h2>
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Tim, lider veya konum ara..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeams.map(team => (
                <TeamCard key={team.id} team={team} />
              ))}
              {filteredTeams.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <p className="text-slate-500">Aradığınız kriterlere uygun tim bulunamadı.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="max-w-3xl mx-auto animate-in zoom-in duration-300">
            <AIAssistant data={data} />
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="animate-in fade-in duration-500">
            {!isAuthenticated ? (
              <Login onLogin={() => setIsAuthenticated(true)} />
            ) : (
              <AdminPanel data={data} onUpdate={updateData} />
            )}
          </div>
        )}
      </main>

      {/* Mobile Navigation (Floating) */}
      <div className="fixed bottom-6 left-6 right-6 lg:hidden z-50">
        <div className="bg-slate-900/90 backdrop-blur-lg border border-slate-700 rounded-2xl flex justify-around p-3 shadow-2xl">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-blue-500' : 'text-slate-500'}`}
          >
            <LayoutDashboard size={20} />
            <span className="text-[10px] font-bold">Panel</span>
          </button>
          <button 
            onClick={() => setActiveTab('teams')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'teams' ? 'text-blue-500' : 'text-slate-500'}`}
          >
            <List size={20} />
            <span className="text-[10px] font-bold">Timler</span>
          </button>
          <button 
            onClick={() => setActiveTab('ai')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'ai' ? 'text-blue-500' : 'text-slate-500'}`}
          >
            <MessageSquare size={20} />
            <span className="text-[10px] font-bold">Asistan</span>
          </button>
          <button 
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'admin' ? 'text-amber-500' : 'text-slate-500'}`}
          >
            <Lock size={20} />
            <span className="text-[10px] font-bold">Yönetim</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
