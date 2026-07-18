import ai from "../config/gemini.js";

export async function generateAnswer(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: prompt,
  });

  return response.text;
}