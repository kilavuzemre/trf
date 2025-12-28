
import React, { useState } from 'react';
import { PlanningData, Team, Task } from '../types';
import { Trash2, Edit, Plus, ChevronDown, ChevronUp, MapPin, Clock, Tag, Briefcase, Info, Calendar, Eraser } from 'lucide-react';

interface Props {
  data: PlanningData;
  onUpdate: (newData: PlanningData) => void;
}

const COMMON_LOCATIONS = [
  "Ölüdeniz Mahallesi Ovacık-Atatürk Caddeleri",
  "Fethiye-Çameli il yolu Üzümlü J.Jrk.Önü",
  "Çiftlik Mahallesi Atatürk Caddesi",
  "Bozyer Mahallesi",
  "Muğla İl J.K.lığı",
  "Eldirek Mahallesi Liseler Yerleşkesi",
  "Ölüdeniz Mahallesi Ocakköy J.Y.K.N",
  "Fethiye-Çameli il yolu Beşkaza Spor Salonu mevkii",
  "Esenköy Mahallesi Atatürk Caddesi",
  "Fethiye-Çameli il yolu Durmuş DEMİRCİ Caddesi"
];

const COMMON_DESCRIPTIONS = [
  "Radarlı Hız denetimi",
  "Müşterek Alkol Denetimi",
  "Yaya Önceliği ve Motosiklet Denetimi",
  "Müşterek Alkol Denetimi-Asayiş Timi talep edilecek",
  "JİED üzerinden yapılacak olan bilgilendirme Eğitimine katılmak",
  "Okul Servis araçları ve Motosiklet Denetimi",
  "Yük ve Yolcu Taşımacılığı Yapan Araçların Denetimi",
  "Cep Telefonu Denetimi",
  "Emniyet kemeri denetimi",
  "Özel Denetim J.Gn.K (Emniyet Kemeri Denetimi)"
];

const TASK_TYPES = ['Radar', 'Alkol', 'Eğitim', 'Denetim', 'Okul', 'Kemer', 'Genel'] as const;

const GENERATE_TIME_OPTIONS = () => {
  const options = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hh = h.toString().padStart(2, '0');
      const mm = m.toString().padStart(2, '0');
      options.push(`${hh}:${mm}`);
    }
  }
  options.push("24:00");
  return options;
};

const TIME_OPTIONS = GENERATE_TIME_OPTIONS();

const AdminPanel: React.FC<Props> = ({ data, onUpdate }) => {
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);

  const addTeam = () => {
    const newTeam: Team = {
      id: Math.random().toString(36).substr(2, 9),
      name: "Yeni J.Trf.Tim K.lığı",
      leader: "Yeni Lider",
      rank: "Rütbe",
      phone: "0 5xx xxx xx xx",
      radioCode: "Dekor-0000",
      tasks: []
    };
    onUpdate({ ...data, teams: [...data.teams, newTeam] });
    setEditingTeam(newTeam.id);
    setExpandedTeam(newTeam.id);
  };

  const clearAllTasks = () => {
    if (confirm('DİKKAT: Tüm timlerin görevlerini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
      const updatedTeams = data.teams.map(team => ({
        ...team,
        tasks: []
      }));
      onUpdate({ ...data, teams: updatedTeams });
    }
  };

  const updateTeam = (id: string, updates: Partial<Team>) => {
    const updatedTeams = data.teams.map(t => t.id === id ? { ...t, ...updates } : t);
    onUpdate({ ...data, teams: updatedTeams });
  };

  const deleteTeam = (id: string) => {
    if (confirm('Bu timi ve bağlı tüm görevleri silmek istediğinize emin misiniz?')) {
      onUpdate({ ...data, teams: data.teams.filter(t => t.id !== id) });
    }
  };

  const addTask = (teamId: string) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      date: data.date, // Default to plan date
      timeStart: "08:00",
      timeEnd: "10:00",
      location: COMMON_LOCATIONS[0],
      description: "Genel Trafik Denetimi",
      type: "Genel"
    };
    const updatedTeams = data.teams.map(t => {
      if (t.id === teamId) {
        return { ...t, tasks: [...t.tasks, newTask] };
      }
      return t;
    });
    onUpdate({ ...data, teams: updatedTeams });
  };

  const updateTask = (teamId: string, taskId: string, updates: Partial<Task>) => {
    const updatedTeams = data.teams.map(t => {
      if (t.id === teamId) {
        return {
          ...t,
          tasks: t.tasks.map(task => task.id === taskId ? { ...task, ...updates } : task)
        };
      }
      return t;
    });
    onUpdate({ ...data, teams: updatedTeams });
  };

  const deleteTask = (teamId: string, taskId: string) => {
    const updatedTeams = data.teams.map(t => {
      if (t.id === teamId) {
        return { ...t, tasks: t.tasks.filter(task => task.id !== taskId) };
      }
      return t;
    });
    onUpdate({ ...data, teams: updatedTeams });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Edit className="text-blue-500" /> Görev Yönetim Paneli
          </h2>
          <p className="text-slate-400 text-sm">Timleri ve görevleri yönetmek için aşağıdaki araçları kullanın.</p>
        </div>
        <div className="flex flex-wrap gap-2">
           <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 flex items-center gap-2">
              <Calendar size={18} className="text-blue-400" />
              <input 
                type="date"
                value={data.date}
                onChange={(e) => onUpdate({...data, date: e.target.value})}
                className="bg-transparent text-sm font-bold text-white focus:outline-none"
                title="Varsayılan Plan Tarihi"
              />
           </div>
           <button
            onClick={clearAllTasks}
            className="flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 px-4 py-3 rounded-xl font-bold transition-all active:scale-95 group"
            title="Tüm Timlerin Görevlerini Temizle"
          >
            <Eraser size={20} className="group-hover:rotate-12 transition-transform" />
            Görevleri Temizle
          </button>
          <button
            onClick={addTeam}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95"
          >
            <Plus size={20} />
            Yeni Tim Ekle
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {data.teams.map(team => (
          <div key={team.id} className="bg-slate-800/40 border border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Team Header */}
            <div className="p-4 flex items-center justify-between hover:bg-slate-700/20 transition-colors">
              <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}>
                {expandedTeam === team.id ? <ChevronUp size={20} className="text-blue-400" /> : <ChevronDown size={20} className="text-slate-500" />}
                <div>
                  <h3 className="text-white font-bold text-base">{team.name}</h3>
                  <p className="text-xs text-slate-400 font-medium">{team.rank} {team.leader}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setEditingTeam(editingTeam === team.id ? null : team.id)}
                  className={`p-2 rounded-lg transition-all ${editingTeam === team.id ? 'bg-amber-600 text-white shadow-inner' : 'bg-slate-700 text-slate-300 hover:text-white hover:bg-slate-600'}`}
                  title="Tim Bilgilerini Düzenle"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => deleteTeam(team.id)}
                  className="p-2 bg-slate-700/50 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-all"
                  title="Timi Sil"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Team Edit Form */}
            {editingTeam === team.id && (
              <div className="p-5 bg-slate-900/50 border-t border-slate-700 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in slide-in-from-top duration-300">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">Tim Adı</label>
                  <input 
                    type="text" 
                    value={team.name} 
                    onChange={(e) => updateTeam(team.id, { name: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Lider ve Rütbe</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Rütbe"
                      value={team.rank} 
                      onChange={(e) => updateTeam(team.id, { rank: e.target.value })}
                      className="w-1/3 bg-slate-800 border border-slate-600 rounded-lg p-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                    <input 
                      type="text" 
                      placeholder="Lider Adı"
                      value={team.leader} 
                      onChange={(e) => updateTeam(team.id, { leader: e.target.value })}
                      className="flex-1 bg-slate-800 border border-slate-600 rounded-lg p-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Telefon</label>
                  <input 
                    type="text" 
                    value={team.phone} 
                    onChange={(e) => updateTeam(team.id, { phone: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Telsiz Kodu</label>
                  <input 
                    type="text" 
                    value={team.radioCode} 
                    onChange={(e) => updateTeam(team.id, { radioCode: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-sm text-white font-mono focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            )}

            {/* Tasks Section */}
            {expandedTeam === team.id && (
              <div className="p-5 bg-slate-900/30 border-t border-slate-700 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Tag size={14} className="text-blue-500" /> GÖREV LİSTESİ
                  </h4>
                  <button 
                    onClick={() => addTask(team.id)}
                    className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 active:scale-95 shadow-md"
                  >
                    <Plus size={14} /> Görev Ekle
                  </button>
                </div>

                <div className="space-y-3">
                  {team.tasks.map(task => (
                    <div key={task.id} className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50 shadow-sm space-y-4 hover:border-slate-500/50 transition-colors">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                        {/* Task Date & Time */}
                        <div className="md:col-span-4 space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><Calendar size={10} /> Tarih ve Saat</label>
                          <div className="flex flex-col gap-2">
                            <input 
                              type="date"
                              value={task.date}
                              onChange={(e) => updateTask(team.id, task.id, { date: e.target.value })}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <div className="flex items-center gap-2">
                              <select 
                                value={task.timeStart} 
                                onChange={(e) => updateTask(team.id, task.id, { timeStart: e.target.value })}
                                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                              >
                                {TIME_OPTIONS.map(time => <option key={time} value={time}>{time}</option>)}
                              </select>
                              <span className="text-slate-600 font-bold">-</span>
                              <select 
                                value={task.timeEnd} 
                                onChange={(e) => updateTask(team.id, task.id, { timeEnd: e.target.value })}
                                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                              >
                                {TIME_OPTIONS.map(time => <option key={time} value={time}>{time}</option>)}
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Type Select */}
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><Briefcase size={10} /> Görev Türü</label>
                          <select 
                            value={task.type}
                            onChange={(e) => updateTask(team.id, task.id, { type: e.target.value as any })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-no-repeat bg-[right_0.5rem_center]"
                          >
                            {TASK_TYPES.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>

                        {/* Location */}
                        <div className="md:col-span-3 space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><MapPin size={10} /> Konum</label>
                          <div className="relative">
                            <input 
                              list={`locations-${task.id}`}
                              type="text" 
                              placeholder="Konum girin veya seçin..."
                              value={task.location} 
                              onChange={(e) => updateTask(team.id, task.id, { location: e.target.value })}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <datalist id={`locations-${task.id}`}>
                              {COMMON_LOCATIONS.map(loc => <option key={loc} value={loc} />)}
                            </datalist>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><Info size={10} /> Açıklama</label>
                          <div className="relative">
                            <input 
                              list={`descriptions-${task.id}`}
                              type="text" 
                              placeholder="Görev seçin veya yazın..."
                              value={task.description} 
                              onChange={(e) => updateTask(team.id, task.id, { description: e.target.value })}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <datalist id={`descriptions-${task.id}`}>
                              {COMMON_DESCRIPTIONS.map(desc => <option key={desc} value={desc} />)}
                            </datalist>
                          </div>
                        </div>

                        {/* Delete Action */}
                        <div className="md:col-span-1 flex justify-end pt-5">
                          <button 
                            onClick={() => deleteTask(team.id, task.id)}
                            className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors border border-transparent hover:border-red-500/20 active:scale-90"
                            title="Görevi Sil"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
