import { BaseAgent } from "./baseAgent.js";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Initialize the Google AI client
const genAI = new GoogleGenerativeAI(process.env.AI_STUDIO_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash-latest",
  systemInstruction: "You are an assistant for a child safety device. Your job is to create urgent, clear, and calm notifications for a parent or caregiver. Respond ONLY with a valid JSON object containing 'title', 'body', and 'socialPost' fields. All fields must be strings. Do not use markdown."
});

const generationConfig = {
  temperature: 0.2,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
  responseMimeType: "application/json",
};

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

async function aiStudioSummarize(state, reason, context) {
  console.log("CommsAgent: Calling Google AI Studio (Gemini)...");
  
  const loc = context?.gps ? ` at (${context.gps.lat}, ${context.gps.lon})` : "";
  const temp = context?.T_out ?? "unknown";
  const mapsLink = context?.gps ? `https://www.google.com/maps?q=${context.gps.lat},${context.gps.lon}` : "";

  const prompt = `
Generate a notification for a parent about their child's safety.

State: ${state}
Reason: ${reason}
Location: ${loc}
Outside Temp: ${temp}°F

Create a JSON response with exactly three fields:
- "title": A short urgent headline (max 50 chars).
- "body": A clear action message (max 100 chars).
- "socialPost": A public safety alert tweet (max 280 chars). This post must be anonymous (no names), state the emergency (child in hot car), the temperature, and the GPS location/map link. Start with "🚨 PUBLIC SAFETY ALERT 🚨".

Example:
{
  "title": "⚠️ Check Vehicle Now",
  "body": "Child may be unattended. Temperature: 92°F.",
  "socialPost": "🚨 PUBLIC SAFETY ALERT 🚨 Child locked in hot car in Houston, TX. Temp: 92°F. Last seen at ${mapsLink}. Authorities are being contacted."
}

Your response (JSON only, no markdown):
`;

  try {
    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [],
    });

    const result = await chat.sendMessage(prompt);
    const response = result.response;
    const jsonText = response.text();
    
    console.log("CommsAgent: AI Raw Response:", jsonText);
    const parsed = JSON.parse(jsonText);
    
    if (!parsed.title || !parsed.body || !parsed.socialPost ||
        typeof parsed.title !== "string" || 
        typeof parsed.body !== "string" ||
        typeof parsed.socialPost !== "string") {
      throw new Error("Invalid AI response structure");
    }
    
    const cleaned = {
      title: parsed.title.trim().substring(0, 100),
      body: parsed.body.trim().substring(0, 200),
      socialPost: parsed.socialPost.trim().substring(0, 280),
    };
    
    console.log("CommsAgent: Cleaned Response:", cleaned);
    return cleaned;

  } catch (e) {
    console.error("❌ AI Studio Error:", e);
    const fallback = {
      title: `🚨 ${state} Alert`,
      body: `${reason}. Location: ${loc}. Temperature: ${temp}°F.`,
      socialPost: `🚨 PUBLIC SAFETY ALERT 🚨 Child locked in hot car at ${loc}. Temp: ${temp}°F. Last seen at ${mapsLink}. Authorities have been notified.`
    };
    
    console.log("CommsAgent: Using fallback:", fallback);
    return fallback;
  }
}

export class CommsAgent extends BaseAgent {
  constructor() {
    super({ name: "CommsAgent" });
  }

  async process(message) {
    const { payload = {}, trace } = message;
    const { state, reason, context } = payload;

    // 'note' will now be { title, body, socialPost }
    const note = await aiStudioSummarize(state, reason, context);
    
    if (!note || !note.title || !note.body || !note.socialPost) {
      console.error("❌ CommsAgent: Invalid note structure, fixing...");
      note.title = note.title || `${state} Alert`;
      note.body = note.body || `Status: ${state}. ${reason || "Check vehicle"}.`;
      note.socialPost = note.socialPost || "PUBLIC SAFETY ALERT: Check vehicle immediately.";
    }
    
    const result = this.ok({
      from: this.name,
      to: "EscalationAgent",
      intent: "DELIVER_OR_ESCALATE",
      payload: { state, note, context },
      trace
    });
    
    console.log("CommsAgent: Returning result:", JSON.stringify(result, null, 2));
    return result;
  }
}
