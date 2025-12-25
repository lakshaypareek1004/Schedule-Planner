import { GoogleGenAI, Type, type Schema } from "@google/genai";
import { Mission, MissionType } from "../types";

const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MISSION_SCHEMA: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "A Batman-themed tactical title for the task" },
      description: { type: Type.STRING, description: "A brief mission briefing in the voice of Alfred or the Batcomputer" },
      startTime: { type: Type.STRING, description: "Start time in HH:MM 24h format" },
      durationMinutes: { type: Type.NUMBER },
      type: { 
        type: Type.STRING, 
        enum: ["INTELLECT", "PHYSICAL", "GADGETS", "RESTORE"],
        description: "The category of the task"
      },
      xpReward: { type: Type.NUMBER, description: "XP value between 20 and 100 based on difficulty" },
      difficulty: { type: Type.STRING, enum: ["ROOKIE", "VIGILANTE", "KNIGHT"] }
    },
    required: ["title", "description", "startTime", "durationMinutes", "type", "xpReward", "difficulty"]
  }
};

export const generateSchedule = async (userInput: string): Promise<Omit<Mission, 'id' | 'isCompleted'>[]> => {
  try {
    const model = "gemini-3-flash-preview";
    
    const prompt = `
    Act as the Batcomputer. The user is a student initiate training to become effective.
    Analyze the user's request for their daily schedule: "${userInput}".
    
    Break this down into specific "Missions". 
    - "Study" or "Homework" relates to INTELLECT.
    - "Gym" or "Sports" relates to PHYSICAL.
    - "Coding" or "Computer" relates to GADGETS.
    - "Sleep" or "Break" relates to RESTORE.
    
    Assign a time for each task based on a logical flow starting from morning or the implied time.
    Use "Bat-Speak" for titles and descriptions (e.g., instead of "Do Math", use "Analyze Numerical Patterns").
    `;

    const response = await genAI.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: MISSION_SCHEMA,
        systemInstruction: "You are the Batcomputer, an advanced AI assisting in tactical life scheduling."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No data received from Batcomputer");

    const rawData = JSON.parse(text);
    return rawData as Omit<Mission, 'id' | 'isCompleted'>[];

  } catch (error) {
    console.error("Batcomputer Malfunction:", error);
    throw error;
  }
};