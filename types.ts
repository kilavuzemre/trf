
export interface Task {
  id: string;
  date: string; // ISO format YYYY-MM-DD
  timeStart: string;
  timeEnd: string;
  location: string;
  description: string;
  type: 'Radar' | 'Alkol' | 'Eğitim' | 'Denetim' | 'Okul' | 'Kemer' | 'Genel';
}

export interface Team {
  id: string;
  name: string;
  leader: string;
  rank: string;
  phone: string;
  radioCode: string;
  tasks: Task[];
}

export interface PlanningData {
  date: string; // Default display date
  title: string;
  teams: Team[];
}
