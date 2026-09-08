import {
  getAssistantResponse,
  translateText,
  rewriteText,
  processNotes,
  searchGalaxyAI,
  type TranslationResult,
  type WritingAssistResult,
  type NoteAssistResult,
  type SearchAIResult,
} from "./mockAI";

export type AIProviderType = "gemini" | "openai" | "mock";

export interface AIServiceConfig {
  provider: AIProviderType;
  apiKey?: string;
  model?: string;
}

export interface AIServiceResponse<T> {
  data: T;
  engine: string;
  provider: AIProviderType;
  usedFallback: boolean;
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

function getConfig(): AIServiceConfig {
  if (GEMINI_API_KEY) {
    return { provider: "gemini", apiKey: GEMINI_API_KEY, model: GEMINI_MODEL };
  }
  if (OPENAI_API_KEY) {
    return { provider: "openai", apiKey: OPENAI_API_KEY, model: OPENAI_MODEL };
  }
  return { provider: "mock" };
}

async function callGemini(prompt: string, temperature = 0.7): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature, maxOutputTokens: 2048 },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text().catch(() => "Unknown error");
    throw new Error(`Gemini API error: ${response.status} ${errText}`);
  }

  const data = await response.json();
  if (data.candidates && data.candidates[0] && data.candidates[0].content) {
    return data.candidates[0].content.parts[0].text;
  }
  throw new Error("Unexpected Gemini API response structure");
}

async function callOpenAI(prompt: string, temperature = 0.7): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "Unknown error");
    throw new Error(`OpenAI API error: ${response.status} ${errText}`);
  }

  const data = await response.json();
  if (data.choices && data.choices[0] && data.choices[0].message) {
    return data.choices[0].message.content;
  }
  throw new Error("Unexpected OpenAI API response structure");
}

async function callRealAI(prompt: string, temperature = 0.7): Promise<string> {
  const config = getConfig();
  if (config.provider === "gemini") {
    return callGemini(prompt, temperature);
  }
  if (config.provider === "openai") {
    return callOpenAI(prompt, temperature);
  }
  throw new Error("No AI provider configured");
}

export async function aiTranslate(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<AIServiceResponse<TranslationResult>> {
  const config = getConfig();
  const mockResult = await translateText(text, sourceLang, targetLang);

  if (config.provider === "mock") {
    return { data: mockResult, engine: mockResult.engine, provider: "mock", usedFallback: false };
  }

  try {
    const prompt = `Translate the following text from ${sourceLang} to ${targetLang}. Only return the translated text, nothing else.\n\nText: ${text}`;
    const translatedText = await callRealAI(prompt, 0.3);
    const result: TranslationResult = {
      sourceText: text,
      sourceLang,
      targetLang,
      translatedText,
      pronunciation: `[Real AI translation to ${targetLang}]`,
      detectedConfidence: 0.95,
      processingTimeMs: 850,
      engine: config.provider === "gemini" ? "Gemini 2.0 Flash" : "OpenAI GPT-4o",
    };
    return { data: result, engine: result.engine, provider: config.provider, usedFallback: false };
  } catch (error) {
    return { data: mockResult, engine: mockResult.engine, provider: "mock", usedFallback: true };
  }
}

export async function aiRewrite(
  text: string,
  tone: string
): Promise<AIServiceResponse<WritingAssistResult>> {
  const config = getConfig();
   const mockResult = await rewriteText(text, tone as Parameters<typeof rewriteText>[1]);

  if (config.provider === "mock") {
    return { data: mockResult, engine: mockResult.engine, provider: "mock", usedFallback: false };
  }

  try {
    const prompt = `Rewrite the following text in a ${tone.toLowerCase()} tone. Only return the rewritten text, nothing else.\n\nOriginal: ${text}`;
    const improvedText = await callRealAI(prompt, 0.7);
    const result: WritingAssistResult = {
      originalText: text,
      tone,
      improvedText,
      wordCountOriginal: text.split(/\s+/).length,
      wordCountImproved: improvedText.split(/\s+/).length,
      grammarIssuesFixed: 0,
      suggestions: [],
      engine: config.provider === "gemini" ? "Gemini 2.0 Flash" : "OpenAI GPT-4o",
    };
    return { data: result, engine: result.engine, provider: config.provider, usedFallback: false };
  } catch (error) {
    return { data: mockResult, engine: mockResult.engine, provider: "mock", usedFallback: true };
  }
}

export async function aiNotes(
  text: string,
  action: string
): Promise<AIServiceResponse<NoteAssistResult>> {
  const config = getConfig();
  const mockResult = await processNotes(text, action as Parameters<typeof processNotes>[1]);

  if (config.provider === "mock") {
    return { data: mockResult, engine: mockResult.engine, provider: "mock", usedFallback: false };
  }

  try {
    const actionPrompts: Record<string, string> = {
      summarize: `Summarize the following text into 3-5 concise bullet points:`,
      tasks: `Extract actionable to-do items from the following text, format as a list:`,
      expand: `Expand the following notes into a well-structured document:`,
      keyPoints: `Extract the key insights as bullet points from the following text:`,
      transcript: `Convert the following into a structured meeting summary with action items:`,
    };
    const promptPrefix = actionPrompts[action] || actionPrompts.summarize;
    const prompt = `${promptPrefix}\n\n${text}`;
    const formattedContent = await callRealAI(prompt, 0.5);

    const result: NoteAssistResult = {
      originalText: text,
      action,
      resultTitle: `Notes: ${action}`,
      summary: [formattedContent.slice(0, 200)],
      engine: config.provider === "gemini" ? "Gemini 2.0 Flash" : "OpenAI GPT-4o",
    };
    return { data: result, engine: result.engine, provider: config.provider, usedFallback: false };
  } catch (error) {
    return { data: mockResult, engine: mockResult.engine, provider: "mock", usedFallback: true };
  }
}

export async function aiChat(
  message: string,
  history: { role: string; content: string }[]
): Promise<AIServiceResponse<{ reply: string; suggestedLinks: { label: string; url: string }[] }>> {
  const config = getConfig();
  const mockResult = await getAssistantResponse(message, history);

  const mockData = {
    reply: mockResult.reply,
    suggestedLinks: mockResult.suggestedLinks || [],
  };
  const mockEngine = "Galaxy AI Neural Simulator v2.1";

  if (config.provider === "mock") {
    return { data: mockData, engine: mockEngine, provider: "mock", usedFallback: false };
  }

  try {
    const systemPrompt =
      "You are the Galaxy AI Assistant, an expert on Galaxy smartphones, Knox security, cameras, and Galaxy AI features. " +
      "Answer concisely. If you mention a relevant page, suggest it as a link.";
    const messages = [
      { role: "system", content: systemPrompt },
      ...history.map((h) => ({ role: h.role as "user" | "assistant", content: h.content })),
      { role: "user", content: message },
    ];

    const response = await fetch(
      config.provider === "gemini"
        ? `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`
        : "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(config.provider === "openai" ? { Authorization: `Bearer ${OPENAI_API_KEY}` } : {}),
        },
        body: JSON.stringify(
          config.provider === "gemini"
            ? {
                contents: messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
                systemInstruction: { parts: [{ text: systemPrompt }] },
                generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
              }
            : {
                model: OPENAI_MODEL,
                messages,
                temperature: 0.7,
                max_tokens: 2048,
              }
        ),
      }
    );

    if (!response.ok) {
      const errText = await response.text().catch(() => "Unknown error");
      throw new Error(`${config.provider} API error: ${response.status} ${errText}`);
    }

    const data = await response.json();
    let reply: string;
    if (config.provider === "gemini") {
      reply = data.candidates[0].content.parts[0].text;
    } else {
      reply = data.choices[0].message.content;
    }

    return { data: { reply, suggestedLinks: mockResult.suggestedLinks || [] }, engine: mockEngine, provider: config.provider, usedFallback: false };
  } catch (error) {
    return { data: mockData, engine: mockEngine, provider: "mock", usedFallback: true };
  }
}

export async function aiSearch(query: string): Promise<AIServiceResponse<SearchAIResult>> {
  const config = getConfig();
  const mockResult = await searchGalaxyAI(query);

  if (config.provider === "mock") {
    return { data: mockResult, engine: "Galaxy AI Neural Simulator v2.1", provider: "mock", usedFallback: false };
  }

  try {
    const prompt = `You are Circle to Search on a Galaxy device. A user searched: "${query}". 
Provide a concise AI overview (2-3 sentences), 3-5 key insights as bullet points, and 2-4 related search questions. Format as JSON with keys: "aiOverview", "keyInsights", "relatedQuestions".`;
    const raw = await callRealAI(prompt, 0.5);
    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { aiOverview: raw, keyInsights: [], relatedQuestions: [] };
    }

    const result: SearchAIResult = {
      query,
      aiOverview: parsed.aiOverview || raw,
      keyInsights: parsed.keyInsights || [],
      matchedDevices: mockResult.matchedDevices,
      relatedQuestions: parsed.relatedQuestions || [],
      sources: mockResult.sources,
    };
    return { data: result, engine: config.provider === "gemini" ? "Gemini 2.0 Flash" : "OpenAI GPT-4o", provider: config.provider, usedFallback: false };
  } catch (error) {
    return { data: mockResult, engine: "Galaxy AI Neural Simulator v2.1", provider: "mock", usedFallback: true };
  }
}

export function isRealAIConfigured(): boolean {
  return Boolean(GEMINI_API_KEY || OPENAI_API_KEY);
}

export function getCurrentProvider(): AIProviderType {
  return getConfig().provider;
}
