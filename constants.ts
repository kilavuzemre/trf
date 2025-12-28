
import { PlanningData } from './types';

export const PLANNING_DATA: PlanningData = {
  title: "FETHİYE İLÇE J.K.LIĞI TRAFİK TİMLERİ FAALİYET PLANLAMASI",
  date: "2025-12-24",
  teams: [
    {
      id: "51",
      name: "51. J.Trf.Tim K.lığı",
      leader: "Çağlar KÜÇÜKÇAKIR",
      rank: "J.Asb.Üçvş",
      phone: "0 537 873 54 97",
      radioCode: "Dekor-3086",
      tasks: [
        { id: "51-1", date: "2025-12-24", timeStart: "19:00", timeEnd: "21:00", location: "Ölüdeniz Mahallesi Ovacık-Atatürk Caddeleri", description: "Radarlı Hız denetimi", type: "Radar" },
        { id: "51-2", date: "2025-12-24", timeStart: "22:00", timeEnd: "24:00", location: "Fethiye-Çameli il yolu Üzümlü J.Jrk.Önü", description: "Müşterek Alkol Denetimi", type: "Alkol" }
      ]
    },
    {
      id: "58",
      name: "58. J.Trf.Tim K.lığı",
      leader: "Işıltan ALKURT",
      rank: "Uzm.J.VII.Kad.Çvş",
      phone: "0 507 202 48 61",
      radioCode: "Dekor-3091",
      tasks: [
        { id: "58-1", date: "2025-12-24", timeStart: "19:00", timeEnd: "21:00", location: "Çiftlik Mahallesi Atatürk Caddesi", description: "Yaya Önceliği ve Motosiklet Denetimi", type: "Denetim" },
        { id: "58-2", date: "2025-12-24", timeStart: "22:00", timeEnd: "24:00", location: "Fethiye-Çameli il yolu Üzümlü J.Jrk.Önü", description: "Müşterek Alkol Denetimi", type: "Alkol" }
      ]
    },
    {
      id: "29",
      name: "29. J.Trf.Tim K.lığı",
      leader: "Hüseyin KILIÇ",
      rank: "J.Asb.Kd.Bçvş",
      phone: "0 505 623 97 47",
      radioCode: "Dekor-3084",
      tasks: [
        { id: "29-1", date: "2025-12-24", timeStart: "24:00", timeEnd: "02:00", location: "Bozyer Mahallesi", description: "Müşterek Alkol Denetimi-Asayiş Timi talep edilecek", type: "Alkol" }
      ]
    },
    {
      id: "59",
      name: "59. J.Trf.Tim K.lığı",
      leader: "Berat Buğra METİN",
      rank: "J.Asb.Kd.Çvş",
      phone: "0 507 634 55 10",
      radioCode: "Dekor-3092",
      tasks: [
        { id: "59-1", date: "2025-12-24", timeStart: "24:00", timeEnd: "02:00", location: "Bozyer Mahallesi", description: "Müşterek Alkol Denetimi-Asayiş Timi talep edilecek", type: "Alkol" }
      ]
    },
    {
      id: "6",
      name: "6. J.Mot.Trf.Tim K.lığı",
      leader: "Osman APAYDIN",
      rank: "Uzm.J.VII.Kad.Çvş",
      phone: "0 532 223 10 36",
      radioCode: "Dekor-3090",
      tasks: [
        { id: "6-1", date: "2025-12-24", timeStart: "06:30", timeEnd: "17:30", location: "Muğla il J.K.lığı", description: "JİED üzerinden yapılacak olan bilgilendirme Eğitimine katılmak", type: "Eğitim" }
      ]
    },
    {
      id: "22",
      name: "22. J.Trf.Tim K.lığı",
      leader: "Gökhan UĞURLU",
      rank: "Uzm.J.VIII.Kad.Çvş",
      phone: "0 542 544 70 76",
      radioCode: "Dekor-3083",
      tasks: [
        { id: "22-1", date: "2025-12-24", timeStart: "07:30", timeEnd: "09:00", location: "Eldirek Mahallesi Liseler Yerleşkesi", description: "Okul Servis araçları ve Motosiklet Denetimi", type: "Okul" },
        { id: "22-2", date: "2025-12-24", timeStart: "11:30", timeEnd: "13:00", location: "Ölüdeniz Mahallesi Ocakköy J.Y.K.N", description: "Yük ve Yolcu Taşımacılığı Yapan Araçların Denetimi", type: "Denetim" },
        { id: "22-3", date: "2025-12-24", timeStart: "14:30", timeEnd: "16:00", location: "Ölüdeniz Mahallesi Ovacık-Atatürk ve Ölüdeniz Caddeleri", description: "Cep Telefonu Denetimi", type: "Denetim" },
        { id: "22-4", date: "2025-12-24", timeStart: "17:30", timeEnd: "19:00", location: "Fethiye-Çameli il yolu Beşkaza Spor Salonu mevkii", description: "Emniyet kemeri denetimi", type: "Kemer" }
      ]
    },
    {
      id: "36",
      name: "36. J.Trf.Tim K.lığı",
      leader: "Mustafa DEMİR",
      rank: "Uzm.J.VII.Kad.Çvş",
      phone: "0 507 233 53 35",
      radioCode: "Dekor-3085",
      tasks: [
        { id: "36-1", date: "2025-12-24", timeStart: "10:00", timeEnd: "12:00", location: "Esenköy Mahallesi Atatürk Caddesi", description: "Radarlı hız denetimi", type: "Radar" },
        { id: "36-2", date: "2025-12-24", timeStart: "14:00", timeEnd: "16:00", location: "Fethiye-Çameli il yolu Durmuş DEMİRCİ Caddesi", description: "Özel Denetim J.Gn.K (Emniyet Kemeri Denetimi)", type: "Kemer" },
        { id: "36-3", date: "2025-12-24", timeStart: "17:00", timeEnd: "18:30", location: "Çiftlik Mahallesi Atatürk Caddesi", description: "Radarlı Hız denetimi", type: "Radar" }
      ]
    }
  ]
};
