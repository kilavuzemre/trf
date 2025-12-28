
import React, { useState, useEffect } from 'react';
import { Team, Task } from '../types';
import { Phone, Radio, User, Clock, MapPin, Calendar, CheckCircle2, Activity, Timer } from 'lucide-react';

interface Props {
  team: Team;
}

const TeamCard: React.FC<Props> = ({ team }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute to refresh status badges
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    } catch {
      return dateStr;
    }
  };

  const getTaskStatus = (task: Task) => {
    const now = currentTime;
    
    // Create Date objects for start and end
    const [startH, startM] = task.timeStart.split(':').map(Number);
    const [endH, endM] = task.timeEnd.split(':').map(Number);
    
    const taskStart = new Date(task.date);
    taskStart.setHours(startH, startM, 0, 0);
    
    const taskEnd = new Date(task.date);
    // Handle cases where end time is 24:00 or after midnight
    if (task.timeEnd === "24:00") {
      taskEnd.setHours(23, 59, 59, 999);
    } else {
      taskEnd.setHours(endH, endM, 0, 0);
      // If end time is technically earlier than start time (e.g. 23:00 to 02:00)
      if (taskEnd < taskStart) {
        taskEnd.setDate(taskEnd.getDate() + 1);
      }
    }

    if (now > taskEnd) {
      return {
        label: "Tamamlandı",
        color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        icon: <CheckCircle2 size={12} />
      };
    } else if (now >= taskStart && now <= taskEnd) {
      return {
        label: "Görevde",
        color: "text-amber-400 bg-amber-500/10 border-amber-500/20 animate-pulse",
        icon: <Activity size={12} />
      };
    } else {
      return {
        label: "Bekliyor",
        color: "text-slate-400 bg-slate-500/10 border-slate-500/20",
        icon: <Timer size={12} />
      };
    }
  };

  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-5 hover:border-slate-500 transition-all shadow-lg flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-blue-400 font-bold text-lg">{team.name}</h4>
          <div className="flex items-center gap-2 text-slate-300 mt-1">
            <User size={14} className="text-slate-500" />
            <span className="text-sm font-medium">{team.rank} {team.leader}</span>
          </div>
        </div>
        <span className="bg-slate-700 text-slate-300 text-[10px] px-2 py-1 rounded-full uppercase tracking-tighter">
          Aktif
        </span>
      </div>

      <div className="space-y-2 mb-6 text-sm">
        <div className="flex items-center gap-3 text-slate-400">
          <Phone size={14} />
          <span>{team.phone}</span>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <Radio size={14} />
          <span className="font-mono text-xs">{team.radioCode}</span>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-700/50">
        <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-widest">Görev Listesi</p>
        <div className="space-y-3">
          {team.tasks.map(task => {
            const status = getTaskStatus(task);
            return (
              <div key={task.id} className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={12} className="text-amber-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{formatDate(task.date)}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${status.color}`}>
                    {status.icon}
                    {status.label}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={12} className="text-blue-500" />
                  <span className="text-xs font-bold text-slate-200">{task.timeStart} - {task.timeEnd}</span>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin size={12} className="text-red-500 mt-1 shrink-0" />
                  <span className="text-xs text-slate-300 leading-relaxed">{task.location}</span>
                </div>
                
                <div className="mt-2 text-xs italic text-slate-400 border-l-2 border-slate-600 pl-2">
                  {task.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
