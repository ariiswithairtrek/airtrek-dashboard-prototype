
import { GoogleGenAI } from "@google/genai";
import { TowLog } from "../types";

export const analyzeFleetPerformance = async (logs: TowLog[], query: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const systemInstruction = `
    You are an expert aviation logistics analyst for Airtrek Robotics. 
    You have access to current towing logs. 
    Logs: ${JSON.stringify(logs)}
    Answer questions concisely and professionally. Focus on efficiency, tail numbers, and operator performance.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "I'm sorry, I couldn't analyze the data at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The Airtrek Intelligence system is currently offline. Please check your connection.";
  }
};
