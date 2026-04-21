import { fileURLToPath } from "url";
import path from "path";
import { GoogleGenAI } from "@google/genai";

const getAI = () => {
    let ai = null;
    if (!ai) {
      if (!process.env.GEMINI_API_KEY) {
        console.log("GEMINI_API_KEY is not defined");
      } else {
        console.log("GEMINI_API_KEY length:", process.env.GEMINI_API_KEY.length);
        console.log("GEMINI_API_KEY starts with:", process.env.GEMINI_API_KEY.substring(0, 5));
      }
      ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return ai;
};

getAI().models.generateContent({
    model: "gemini-2.5-flash",
    contents: "hello"
}).then(res => console.log(res.text))
.catch(err => console.error("Error from AI:", err.message));
