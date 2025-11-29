import { GoogleGenAI } from "@google/genai";
import { Experience } from "../types";
import { MOCK_EXPERIENCES } from "../constants";

// Using a fallback mechanism if no API key is provided for the demo
const API_KEY = process.env.API_KEY || '';

export const getGeminiRecommendation = async (
  query: string,
  userInterests: string[]
): Promise<string> => {
  if (!API_KEY) {
    console.warn("No API_KEY found for Gemini. Returning mock response.");
    return "Based on your interests, I'd recommend checking out the 'Neon Clay' event. It matches your love for art and social vibes!";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    // Construct a context-aware prompt
    const context = `
      You are the concierge for ESCAPE, a premium experience app.
      Available Experiences: ${MOCK_EXPERIENCES.map(e => `${e.title} (${e.categories.join(', ')})`).join('; ')}.
      User Interests: ${userInterests.join(', ')}.
      User Query: "${query}"
      
      Recommend 1 specific experience from the list and explain why in 1 short sentence.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: context,
    });

    return response.text || "I couldn't find a perfect match, but try exploring the 'Solo Picks' section!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the concierge service right now.";
  }
};