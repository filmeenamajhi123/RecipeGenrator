import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCUyJUCH7StJ_8n9OCPfYP56DPJtAAAx50");

export async function generateAIResponse(prompt) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    // console.log(result.response.text());
    return result.response.text();
}
