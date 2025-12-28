
import React, { useState, useEffect } from 'react';
import { PlanningData, Team, Task } from '../types';
import { Shield, Users, MapPin, Clock, Activity, AlertCircle } from 'lucide-react';

interface Props {
  data: PlanningData;
}

const Dashboard: React.FC<Props> = ({ data }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const totalTeams = data.teams.length;
  const totalTasks = data.teams.reduce((acc, team) => acc + team.tasks.length, 0);
  
  const radarTasks = data.teams.flatMap(t => t.tasks).filter(t => t.type === 'Radar').length;
  const alcoholTasks = data.teams.flatMap(t => t.tasks).filter(t => t.type === 'Alkol').length;

  // Logic to find teams currently on duty
  const getActiveTeams = () => {
    const now = currentTime;
    return data.teams.filter(team => {
      return team.tasks.some(task => {
        const [startH, startM] = task.timeStart.split(':').map(Number);
        const [endH, endM] = task.timeEnd.split(':').map(Number);
        
        const taskStart = new Date(task.date);
        taskStart.setHours(startH, startM, 0, 0);
        
        const taskEnd = new Date(task.date);
        if (task.timeEnd === "24:00") {
          taskEnd.setHours(23, 59, 59, 999);
        } else {
          taskEnd.setHours(endH, endM, 0, 0);
          if (taskEnd < taskStart) {
            taskEnd.setDate(taskEnd.getDate() + 1);
          }
        }
        return now >= taskStart && now <= taskEnd;
      });
    });
  };

  const activeTeams = getActiveTeams();

  return (
    <div className="space-y-6">
      {/* Active Duty Banner */}
      <div className="bg-slate-900/60 border border-slate-700/50 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/20 p-2.5 rounded-xl text-amber-400 animate-pulse">
              <Activity size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">GÜNCEL DURUM: GÖREVDEKİ TİMLER</h3>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Anlık Operasyonel Takip</p>
            </div>
          </div>
          <div className="bg-slate-950/50 border border-slate-800 px-4 py-2 rounded-2xl flex items-center gap-3">
             <Clock size={16} className="text-blue-400" />
             <span className="text-lg font-mono font-bold text-blue-100">
               {currentTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
             </span>
          </div>
        </div>

        {activeTeams.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeTeams.map(team => (
              <div key={team.id} className="bg-slate-800/80 border border-amber-500/30 p-4 rounded-2xl flex items-center justify-between group hover:border-amber-500 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 font-bold text-sm">
                    {team.id}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm group-hover:text-amber-400 transition-colors">{team.name}</p>
                    <p className="text-slate-400 text-[10px] font-medium uppercase tracking-wider">{team.rank} {team.leader.split(' ')[0]}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[10px] font-black text-amber-400 animate-pulse mb-1">GÖREVDE</span>
                   <span className="text-[9px] text-slate-500 font-mono">{team.radioCode}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 bg-slate-800/30 rounded-2xl border border-dashed border-slate-700">
             <AlertCircle className="text-slate-600 mb-2" size={32} />
             <p className="text-slate-500 font-medium text-sm">Şu an aktif görevde olan tim bulunmamaktadır.</p>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-xl backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
              <Users size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">Toplam Tim</p>
              <p className="text-2xl font-bold text-white">{totalTeams}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-xl backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Shield size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">Toplam Görev</p>
              <p className="text-2xl font-bold text-white">{totalTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-xl backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/20 text-red-400 rounded-xl">
              <MapPin size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">Radar Görevleri</p>
              <p className="text-2xl font-bold text-white">{radarTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-xl backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">Alkol Denetimi</p>
              <p className="text-2xl font-bold text-white">{alcoholTasks}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
