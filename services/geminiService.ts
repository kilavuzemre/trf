
import { GoogleGenAI } from "@google/genai";
import { PlanningData } from "../types";

export const analyzePlanWithGemini = async (userPrompt: string, currentData: PlanningData) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const modelName = 'gemini-3-flash-preview';
    
    const context = `
      Sen bir askeri planlama asistanısın. Görevin, Fethiye İlçe Jandarma Komutanlığı Trafik Timleri'nin ${currentData.date} tarihli planını analiz etmektir.
      
      GÜNCEL VERİ:
      ${JSON.stringify(currentData, null, 2)}
      
      TALİMATLAR:
      1. KISA VE NET OL: Gereksiz nezaket cümlelerinden ve giriş-çıkış ifadelerinden kaçın.
      2. OPERASYONEL DİL: Askeri ciddiyette, doğrudan bilgi veren bir dil kullan.
      3. ÖZETLE: Eğer birden fazla timden bahsediliyorsa sadece en kritik bilgileri (Tim No, Saat, Görev) ver.
      4. TÜRKÇE YANITLA: Yanıtların her zaman Türkçe olmalıdır.
      5. DEĞİŞİKLİKLER: Eğer veride bir değişiklik fark edersen (önceki konuşmalardan veya veriden), sadece değişikliği belirt.

      Kullanıcı Sorusu: ${userPrompt}
    `;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: context,
    });

    return response.text || "Yapay zeka yanıt üretemedi.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "HATA: API bağlantısı kurulamadı.";
  }
};
