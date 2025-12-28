
import React, { useState, useMemo } from 'react';
import { PlanningData } from '../types';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Info } from 'lucide-react';

interface Props {
  data: PlanningData;
}

const Timeline: React.FC<Props> = ({ data }) => {
  const hours = Array.from({ length: 25 }, (_, i) => i); // 0 to 24
  
  const allTaskDates = useMemo(() => {
    return Array.from(new Set(
      data.teams.flatMap(team => team.tasks.map(t => t.date))
    )).sort();
  }, [data]);

  const [selectedDate, setSelectedDate] = useState(allTaskDates.includes(data.date) ? data.date : (allTaskDates[0] || data.date));

  const timeToPercent = (timeStr: string) => {
    const parts = timeStr.split(':');
    if (parts.length < 2) return 0;
    const h = parseInt(parts[0]);
    const m = parseInt(parts[1]);
    let totalMinutes = h * 60 + m;
    return (totalMinutes / (24 * 60)) * 100;
  };

  const calculateWidth = (start: string, end: string) => {
    let s = timeToPercent(start);
    let e = timeToPercent(end);
    if (e <= s) e = 100; // Case for tasks ending at midnight or spans across
    return Math.max(e - s, 2); // Minimum 2% width for visibility
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Radar': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'Alkol': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      case 'Eğitim': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'Okul': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'Kemer': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
      {/* Date Switcher */}
      <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/20">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600/20 p-2 rounded-lg text-blue-400">
            <Clock size={20} />
          </div>
          <h3 className="text-lg font-bold text-white">Operasyonel Zaman Çizelgesi</h3>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/50 p-1.5 rounded-2xl border border-slate-700/50 w-fit">
          <button 
            onClick={() => {
              const idx = allTaskDates.indexOf(selectedDate);
              if (idx > 0) setSelectedDate(allTaskDates[idx-1]);
            }}
            disabled={allTaskDates.indexOf(selectedDate) <= 0}
            className="p-1.5 hover:bg-slate-800 rounded-xl text-slate-400 disabled:opacity-20 transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          
          <div className="flex items-center gap-2 px-3">
            <CalendarIcon size={14} className="text-blue-500" />
            <span className="text-xs font-bold text-slate-200 min-w-[140px] text-center">
              {formatDate(selectedDate)}
            </span>
          </div>

          <button 
            onClick={() => {
              const idx = allTaskDates.indexOf(selectedDate);
              if (idx < allTaskDates.length - 1) setSelectedDate(allTaskDates[idx+1]);
            }}
            disabled={allTaskDates.indexOf(selectedDate) >= allTaskDates.length - 1}
            className="p-1.5 hover:bg-slate-800 rounded-xl text-slate-400 disabled:opacity-20 transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Gantt View Area */}
      <div className="overflow-x-auto custom-scrollbar">
        <div className="min-w-[1200px] flex flex-col">
          {/* Timeline Rulers */}
          <div className="flex border-b border-slate-800 bg-slate-950/30">
            <div className="w-56 shrink-0 border-r border-slate-800 p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Trafik Timleri
            </div>
            <div className="flex-1 flex relative h-10">
              {hours.map(h => (
                <div key={h} className="flex-1 border-l border-slate-800/50 relative">
                  <span className="absolute -bottom-1 left-1 text-[9px] font-bold text-slate-600">{h.toString().padStart(2, '0')}:00</span>
                </div>
              ))}
            </div>
          </div>

          {/* Team Rows */}
          <div className="flex flex-col">
            {data.teams.map((team, tIdx) => {
              const tasksForDay = team.tasks.filter(t => t.date === selectedDate);
              return (
                <div key={team.id} className={`flex group border-b border-slate-800/50 ${tIdx % 2 === 0 ? 'bg-transparent' : 'bg-slate-800/10'}`}>
                  {/* Team Info Column */}
                  <div className="w-56 shrink-0 border-r border-slate-800 p-4 relative z-10 bg-inherit">
                    <p className="text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors truncate">{team.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium truncate">{team.rank} {team.leader}</p>
                  </div>

                  {/* Tasks Timeline Column */}
                  <div className="flex-1 relative h-16 flex items-center overflow-hidden">
                    {/* Background Team Name (Transparent Watermark) - Adjusted for better centering/containment */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                      <span className="text-3xl font-black text-slate-700/10 uppercase tracking-[0.5em] whitespace-nowrap select-none">
                        {team.name}
                      </span>
                    </div>

                    {/* Background Grid Lines */}
                    {hours.map(h => (
                      <div key={h} className="absolute inset-y-0 border-l border-slate-800/30 z-0" style={{ left: `${(h / 24) * 100}%` }} />
                    ))}

                    {/* Task Blocks */}
                    {tasksForDay.map(task => {
                      const left = timeToPercent(task.timeStart);
                      const width = calculateWidth(task.timeStart, task.timeEnd);
                      return (
                        <div
                          key={task.id}
                          className={`absolute h-10 border rounded-xl px-3 py-1.5 shadow-lg overflow-hidden transition-all z-10 hover:z-30 hover:scale-[1.02] hover:brightness-110 cursor-help ${getTypeColor(task.type)}`}
                          style={{ left: `${left}%`, width: `${width}%` }}
                        >
                          <div className="flex flex-col h-full justify-center">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-black uppercase leading-none truncate">{task.type}</span>
                              <Info size={10} className="opacity-50" />
                            </div>
                            <span className="text-[9px] font-medium opacity-80 truncate leading-tight mt-0.5">{task.description}</span>
                          </div>
                        </div>
                      );
                    })}

                    {tasksForDay.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-5 z-0">
                         <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Planlanmış Görev Yok</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend Footer */}
      <div className="p-4 bg-slate-950/50 border-t border-slate-800 flex flex-wrap justify-center gap-6">
        {[
          { label: 'Radar', color: 'bg-red-500' },
          { label: 'Alkol', color: 'bg-amber-500' },
          { label: 'Eğitim', color: 'bg-blue-500' },
          { label: 'Okul', color: 'bg-green-500' },
          { label: 'Kemer', color: 'bg-indigo-500' },
          { label: 'Diğer', color: 'bg-slate-500' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${item.color} shadow-[0_0_8px_rgba(0,0,0,0.5)]`} />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
