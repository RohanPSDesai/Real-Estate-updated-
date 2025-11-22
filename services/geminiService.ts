import { GoogleGenAI } from "@google/genai";

const getClient = () => {
    // Ideally this comes from process.env.API_KEY, but checking if it exists handled by caller usually
    // or by the environment variable assumption in the prompt instructions.
    // For this environment, we assume process.env.API_KEY is available.
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generatePropertyDescription = async (details: any): Promise<string> => {
  const ai = getClient();
  
  const prompt = `
    Write a catchy, professional real estate listing description (max 100 words) for a property with these details:
    Type: ${details.type}
    Location: ${details.area}, Pune, Maharashtra
    Transaction: ${details.transactionType}
    Bedrooms: ${details.bedrooms || 'N/A'}
    Area: ${details.areaSqFt} sq ft
    Amenities: ${details.amenities.join(', ')}
    Highlights: ${details.highlights || 'Great view, prime location'}
    
    Make it appealing to potential buyers or renters.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Could not generate description.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating description. Please try again manually.";
  }
};
