// ==========================================================================
// Galaxy AI Engine - Service Interface & Realistic Neural Simulator + Real LLM Bridge
// ==========================================================================

export interface TranslationResult {
  sourceText: string;
  sourceLang: string;
  targetLang: string;
  translatedText: string;
  pronunciation?: string;
  detectedConfidence: number;
  processingTimeMs: number;
  engine: string;
}

export interface WritingAssistResult {
  originalText: string;
  tone: string;
  improvedText: string;
  wordCountOriginal: number;
  wordCountImproved: number;
  grammarIssuesFixed: number;
  suggestions: string[];
  engine: string;
}

export interface NoteAssistResult {
  originalText: string;
  action: string;
  resultTitle: string;
  summary: string[];
  tasks?: { id: string; text: string; done: boolean; priority: "High" | "Medium" | "Low" }[];
  transcriptDiarization?: { timestamp: string; speaker: string; text: string }[];
  formattedContent?: string;
  engine: string;
}

export interface SearchAIResult {
  query: string;
  aiOverview: string;
  keyInsights: string[];
  matchedDevices: { name: string; slug: string; price: number; reason: string }[];
  relatedQuestions: string[];
  sources: { title: string; url: string; domain: string }[];
}

export interface PhotoEditResult {
  action: string;
  status: "success" | "error";
  processingSteps: string[];
  filterCss: string;
  details: string;
  enhancedMetrics?: { sharpness: string; dynamicRange: string; reflectionReduction: string };
}

// Language Map for BCP-47 Speech Synthesis
export const BCP47_LANG_MAP: Record<string, string> = {
  English: "en-US",
  Korean: "ko-KR",
  Japanese: "ja-JP",
  Spanish: "es-ES",
  French: "fr-FR",
  German: "de-DE",
  Chinese: "zh-CN",
  Hindi: "hi-IN",
  Italian: "it-IT",
  Arabic: "ar-SA",
};

// 1. Translation Dictionary
const DICTIONARY_MAP: Record<string, Record<string, string>> = {
  "Hello, how can I help you today?": {
    Korean: "안녕하세요, 오늘 어떻게 도와드릴까요?",
    Japanese: "こんにちは、今日はどのようなご用件でしょうか？",
    Spanish: "¡Hola! ¿Cómo puedo ayudarte hoy?",
    French: "Bonjour, comment puis-je vous aider aujourd'hui ?",
    German: "Hallo, wie kann ich Ihnen heute helfen?",
    Chinese: "您好，今天我能为您做些什么？",
    Hindi: "नमस्ते, आज मैं आपकी क्या मदद कर सकता हूँ?",
    Italian: "Ciao, come posso aiutarti oggi?",
    Arabic: "مرحبًا، كيف يمكنني مساعدتك اليوم؟",
  },
  "I would like to book a table for two at 7 PM.": {
    Korean: "오후 7시에 2명 테이블을 예약하고 싶습니다.",
    Japanese: "午後7時に2名でテーブルを予約したいのですが。",
    Spanish: "Me gustaría reservar una mesa para dos a las 7 de la tarde.",
    French: "Je voudrais réserver une table pour deux à 19 heures.",
    German: "Ich möchte gerne einen Tisch für zwei Personen um 19:00 Uhr reservieren.",
    Chinese: "我想预订晚上7点两位客人的桌位。",
    Hindi: "मैं शाम 7 बजे दो लोगों के लिए एक टेबल बुक करना चाहता हूँ।",
    Italian: "Vorrei prenotare un tavolo per due alle 19:00.",
    Arabic: "أود حجز طاولة لشخصين في الساعة 7 مساءً.",
  },
  "Where is the nearest subway station?": {
    Korean: "가장 가까운 지하철역이 어디에 있나요?",
    Japanese: "一番近い地下鉄の駅はどこですか？",
    Spanish: "¿Dónde está la estación de metro más cercana?",
    French: "Où se trouve la station de métro la plus proche ?",
    German: "Wo ist die nächste U-Bahn-Station?",
    Chinese: "最近的地铁站在哪里？",
    Hindi: "निकटतम मेट्रो स्टेशन कहाँ है?",
    Italian: "Dov'è la stazione della metropolitana più vicina?",
    Arabic: "أين هي أقرب محطة مترو؟",
  },
};

// Helper for Real External Gemini API Call
async function callGeminiAPI(prompt: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch {
    return null;
  }
}

export async function translateText(
  text: string,
  sourceLang: string = "English",
  targetLang: string = "Spanish"
): Promise<TranslationResult> {
  const startTime = Date.now();

  // Try real Gemini API if key configured
  if (process.env.GEMINI_API_KEY) {
    const prompt = `Translate the following text from ${sourceLang} to ${targetLang}. Return ONLY the direct translated string without quotes or conversational commentary.\n\nText: "${text}"`;
    const realTranslation = await callGeminiAPI(prompt);
    if (realTranslation) {
      return {
        sourceText: text,
        sourceLang,
        targetLang,
        translatedText: realTranslation.trim(),
        detectedConfidence: 0.99,
        processingTimeMs: Date.now() - startTime,
        engine: "Galaxy Cloud Neural Cluster (Gemini Flash)",
      };
    }
  }

  await new Promise((res) => setTimeout(res, 350));

  const trimmed = text.trim();
  let translated = "";

  if (sourceLang === targetLang) {
    translated = trimmed;
  } else if (DICTIONARY_MAP[trimmed] && DICTIONARY_MAP[trimmed][targetLang]) {
    translated = DICTIONARY_MAP[trimmed][targetLang];
  } else {
    const prefixes: Record<string, string> = {
      Spanish: "Traducción en vivo: ",
      French: "Traduction en direct: ",
      German: "Echtzeit-Übersetzung: ",
      Korean: "실시간 통역: ",
      Japanese: "リアルタイム翻訳: ",
      Chinese: "实时翻译: ",
      Hindi: "लाइव अनुवाद: ",
      Italian: "Traduzione in tempo reale: ",
      Arabic: "ترجمة فورية: ",
    };
    const prefix = prefixes[targetLang] || `${targetLang}: `;
    translated = `${prefix}"${trimmed}"`;
  }

  return {
    sourceText: text,
    sourceLang,
    targetLang,
    translatedText: translated,
    detectedConfidence: 0.99,
    processingTimeMs: Date.now() - startTime,
    engine: "Galaxy Quantum NPU (On-Device)",
  };
}

export async function rewriteText(
  text: string,
  tone: "Professional" | "Casual" | "Polite" | "Social" | "Concise" | "Academic" | "Bullet Points"
): Promise<WritingAssistResult> {
  const startTime = Date.now();

  if (process.env.GEMINI_API_KEY) {
    const prompt = `Rewrite the following text in a ${tone} tone for a professional communication app. Return ONLY the rewritten text.\n\nText: "${text}"`;
    const realResult = await callGeminiAPI(prompt);
    if (realResult) {
      const improved = realResult.trim();
      return {
        originalText: text,
        tone,
        improvedText: improved,
        wordCountOriginal: text.split(/\s+/).filter(Boolean).length,
        wordCountImproved: improved.split(/\s+/).filter(Boolean).length,
        grammarIssuesFixed: 3,
        suggestions: [
          `Adjusted voice structure to reflect authentic ${tone} standards.`,
          "Polished syntax and removed redundancies.",
        ],
        engine: "Galaxy Cloud Neural Cluster (Gemini)",
      };
    }
  }

  await new Promise((res) => setTimeout(res, 450));
  const trimmed = text.trim();
  let improved = "";
  const suggestions: string[] = [];

  switch (tone) {
    case "Professional":
      improved = `Dear Team,\n\nI am writing to formally communicate the updated operational details: ${trimmed.replace(
        /hey|hi|yo/gi,
        "Hello,"
      )} Please let me know if any further clarification or strategic alignment is required.\n\nBest regards.`;
      suggestions.push("Replaced colloquial phrasing with formal business terminology.");
      suggestions.push("Structured message with polite salutation and professional closing.");
      break;
    case "Casual":
      improved = `Hey! Just wanted to share a quick update: ${trimmed} Let me know what you think! 😊✨`;
      suggestions.push("Softened formal phrasing for casual messaging apps.");
      break;
    case "Polite":
      improved = `I hope this message finds you well. I would be immensely grateful if you could review the following: ${trimmed}. Thank you kindly for your time and thoughtful consideration.`;
      suggestions.push("Added respectful courtesy qualifiers and gracious closing.");
      break;
    case "Social":
      improved = `🚀 Exciting milestone ahead! ${trimmed} What are your thoughts on this? Drop a comment below! 🔥 #GalaxyAI #Innovation #NextGenTech`;
      suggestions.push("Added engaging hook, call-to-action, and trending hashtags.");
      break;
    case "Concise":
      improved =
        trimmed
          .split(/[.!?]+/)
          .filter(Boolean)
          .map((s) => s.trim())
          .slice(0, 2)
          .join(". ") + ".";
      suggestions.push("Eliminated filler words to maximize clarity and brevity.");
      break;
    case "Academic":
      improved = `Empirical analysis indicates that: "${trimmed}". Furthermore, cross-functional observations demonstrate significant systemic efficacy.`;
      suggestions.push("Synthesized academic prose with rigorous rhetoric.");
      break;
    case "Bullet Points":
      const lines = trimmed.split(/[\n,.]+/).filter((l) => l.trim().length > 2);
      improved = lines.map((l) => `• ${l.trim()}`).join("\n");
      suggestions.push("Converted unstructured narrative into structured bullet points.");
      break;
    default:
      improved = trimmed;
  }

  const wordCountOriginal = trimmed.split(/\s+/).filter(Boolean).length;
  const wordCountImproved = improved.split(/\s+/).filter(Boolean).length;

  return {
    originalText: text,
    tone,
    improvedText: improved,
    wordCountOriginal,
    wordCountImproved,
    grammarIssuesFixed: 2,
    suggestions,
    engine: "Galaxy Quantum NPU Writing Engine",
  };
}

export async function processNotes(
  text: string,
  action: "summarize" | "extractTasks" | "todoList" | "formatNotes" | "transcript"
): Promise<NoteAssistResult> {
  await new Promise((res) => setTimeout(res, 500));
  const trimmed = text.trim();

  if (action === "transcript") {
    return {
      originalText: text,
      action,
      resultTitle: "Transcript Assist & Multi-Speaker Diarization",
      summary: [
        "Identified 3 distinct speaker profiles (Prof. Harrison, Sarah, Student)",
        "Logged timestamped transcript with keyword auto-tagging",
      ],
      transcriptDiarization: [
        { timestamp: "00:04", speaker: "Prof. Harrison", text: "Welcome everyone. Today we're reviewing the Quantum NPU architecture and latency metrics." },
        { timestamp: "00:22", speaker: "Sarah (Lead)", text: "Our benchmarks show 12ms for Live Translate and under 15ms for Knox Vault verification." },
        { timestamp: "01:05", speaker: "Student", text: "Does the on-device NPU operate without internet connectivity?" },
        { timestamp: "01:18", speaker: "Prof. Harrison", text: "Yes, complete hardware isolation guarantees offline privacy." },
      ],
      engine: "Galaxy Transcript Assist (On-Device)",
    };
  }

  if (action === "extractTasks" || action === "todoList") {
    return {
      originalText: text,
      action,
      resultTitle: "Action Items & Deliverables",
      summary: [
        "Identified mission-critical deliverables from meeting notes",
        "Assigned estimated priority levels based on deadline urgency",
      ],
      tasks: [
        { id: "task-1", text: "Finalize Galaxy S25 Ultra launch presentation deck", done: false, priority: "High" },
        { id: "task-2", text: "Coordinate Live Translate language pack sync with SDK team", done: true, priority: "High" },
        { id: "task-3", text: "Distribute customer survey results to product leads", done: false, priority: "Medium" },
        { id: "task-4", text: "Schedule Knox Vault hardware security audit review", done: false, priority: "Low" },
      ],
      engine: "Galaxy Note Assist (On-Device)",
    };
  }

  if (action === "formatNotes") {
    const formatted = `### 📌 Executive Meeting Brief
**Date:** ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
**Topic:** Strategic Product Alignment

#### 🔍 Core Observations
${trimmed}

#### 🎯 Strategic Takeaways
- Optimized on-device latency across all flagship devices.
- Seamless synchronization with Galaxy Connected Ecosystem.

---
*Auto-formatted by Galaxy Note Assist*`;

    return {
      originalText: text,
      action,
      resultTitle: "Structured Executive Brief",
      summary: ["Formatted headers, dividers, and bullet structures."],
      formattedContent: formatted,
      engine: "Galaxy Note Assist",
    };
  }

  return {
    originalText: text,
    action: "summarize",
    resultTitle: "Executive Summary",
    summary: [
      "Key Milestone: Successful deployment of Quantum NPU on Galaxy S25 Ultra.",
      "Efficiency Gain: 45% reduction in translation latency with full offline capabilities.",
      "Next Action: Cross-device roll-out to Tab S10 and Watch Ultra wearables.",
    ],
    engine: "Galaxy Note Assist",
  };
}

export async function processPhotoEdit(action: string): Promise<PhotoEditResult> {
  await new Promise((res) => setTimeout(res, 600));

  switch (action) {
    case "removeObject":
      return {
        action: "Object Eraser",
        status: "success",
        processingSteps: [
          "Segmenting foreground subject contours...",
          "Computing semantic edge gradients with Neural Engine...",
          "Generative in-painting background synthesis complete.",
        ],
        filterCss: "contrast(105%) brightness(102%)",
        details: "Selected object removed seamlessly and background details filled with generative textures.",
        enhancedMetrics: {
          sharpness: "+18%",
          dynamicRange: "Optimized",
          reflectionReduction: "N/A",
        },
      };
    case "enhanceImage":
      return {
        action: "AI Remaster & HDR",
        status: "success",
        processingSteps: [
          "Analyzing exposure histogram and color saturation...",
          "Applying multi-frame noise reduction...",
          "Dynamic range expanded with deep blacks and vibrant highlights.",
        ],
        filterCss: "contrast(115%) saturate(125%) brightness(108%)",
        details: "Dynamic range remastered with 24-bit studio color depth.",
        enhancedMetrics: {
          sharpness: "+34%",
          dynamicRange: "+45%",
          reflectionReduction: "82%",
        },
      };
    case "eraseReflections":
      return {
        action: "Reflection & Glare Eraser",
        status: "success",
        processingSteps: [
          "Detecting specular highlights from glass and water surfaces...",
          "Deconvoluting surface polarization artifacts...",
          "Restoring underlying color spectrum...",
        ],
        filterCss: "contrast(110%) brightness(104%)",
        details: "Window reflections and glass glare stripped away effortlessly.",
        enhancedMetrics: {
          sharpness: "+22%",
          dynamicRange: "+15%",
          reflectionReduction: "94%",
        },
      };
    case "generateBackground":
      return {
        action: "Generative Background",
        status: "success",
        processingSteps: [
          "Identifying subject perspective and ground plane...",
          "Synthesizing high-resolution bokeh studio backdrop...",
          "Harmonizing rim lighting on subject...",
        ],
        filterCss: "contrast(110%) saturate(115%) brightness(105%)",
        details: "Background expanded with photorealistic ambient lighting.",
        enhancedMetrics: {
          sharpness: "+28%",
          dynamicRange: "+30%",
          reflectionReduction: "N/A",
        },
      };
    default:
      return {
        action,
        status: "success",
        processingSteps: ["AI processing complete."],
        filterCss: "none",
        details: "Image processed with Galaxy AI Studio.",
      };
  }
}

export async function searchGalaxyAI(query: string): Promise<SearchAIResult> {
  await new Promise((res) => setTimeout(res, 450));
  const q = query.toLowerCase();

  if (q.includes("photo") || q.includes("camera") || q.includes("zoom") || q.includes("lens")) {
    return {
      query,
      aiOverview:
        "The **Galaxy S25 Ultra** is rated as the premier smartphone for mobile photography and videography. It features a 200MP wide sensor, quad-optical zoom system (up to 100x Space Zoom), and Galaxy AI Generative Edit for on-device object removal and horizon auto-filling.",
      keyInsights: [
        "200MP Quad-Telephoto Camera System with 5x Optical Periscope zoom.",
        "Nightography Video 2.0 with dedicated AI noise reduction ISP.",
        "Generative Edit enables moving subjects and erasing reflections in seconds.",
        "S-Pen acts as a remote wireless camera shutter button.",
      ],
      matchedDevices: [
        { name: "Galaxy S25 Ultra", slug: "galaxy-s25-ultra", price: 1299.99, reason: "Ultimate 200MP quad-camera & Generative Edit studio." },
        { name: "Galaxy Z Fold 6", slug: "galaxy-z-fold-6", price: 1899.99, reason: "Dual-screen FlexCam with hands-free tripod mode." },
      ],
      relatedQuestions: [
        "How does Generative Edit compare to Photoshop?",
        "What is the maximum optical zoom on Galaxy S25 Ultra?",
        "Can Galaxy AI remove glass reflections from museum photos?",
      ],
      sources: [
        { title: "Galaxy AI Photography Masterclass", url: "/learn/generative-edit-photo-masterclass", domain: "galaxyai.hub" },
        { title: "Quantum NPU Camera Architecture", url: "/learn/on-device-vs-cloud-ai-privacy-deep-dive", domain: "galaxyai.hub" },
      ],
    };
  }

  if (q.includes("student") || q.includes("study") || q.includes("note") || q.includes("school") || q.includes("college")) {
    return {
      query,
      aiOverview:
        "For students and academic researchers, **Galaxy Tab S10 Ultra** and **Galaxy S25+** offer ideal synergy. Features like **Note Assist** auto-summarize 50-page lecture PDFs, **Transcript Assist** records multi-speaker lectures with timestamps, and **Circle to Search** solves complex formulas instantly.",
      keyInsights: [
        "PDF Overlay Translation replaces foreign textbook text in-place.",
        "Note Assist transforms handwritten S-Pen notes into clean typed summaries.",
        "Transcript Assist labels distinct professors and student questions.",
        "Bundled S-Pen requires no battery charging and offers near-zero latency.",
      ],
      matchedDevices: [
        { name: "Galaxy Tab S10 Ultra", slug: "galaxy-tab-s10-ultra", price: 1199.99, reason: "14.6\" AMOLED canvas with S-Pen Note Assist & multi-window." },
        { name: "Galaxy S25+", slug: "galaxy-s25-plus", price: 999.99, reason: "Expansive 6.7\" screen with all-day battery & full AI suite." },
      ],
      relatedQuestions: [
        "Does Galaxy AI work on handwritten S-Pen notes?",
        "Can Note Assist format lecture notes into to-do lists?",
        "Is there a student discount available?",
      ],
      sources: [
        { title: "10x Productivity with Note Assist", url: "/learn/10x-productivity-with-note-assist-and-s-pen", domain: "galaxyai.hub" },
        { title: "Student & Educator AI Deals", url: "/offers", domain: "galaxyai.hub" },
      ],
    };
  }

  if (q.includes("knox") || q.includes("security") || q.includes("privacy") || q.includes("data") || q.includes("offline")) {
    return {
      query,
      aiOverview:
        "**Samsung Knox Vault** provides hardware-isolated EAL5+ security for Galaxy AI data. Sensitive computations like Live Translate and biometric processing run entirely on-device inside the Quantum NPU without transmitting personal data to cloud servers.",
      keyInsights: [
        "Hardware EAL5+ isolation enclave protects encryption keys.",
        "On-device NPU processing allows 100% offline Live Translation.",
        "Master AI Toggle gives users 1-click option to block cloud processing.",
      ],
      matchedDevices: [
        { name: "Galaxy S25 Ultra", slug: "galaxy-s25-ultra", price: 1299.99, reason: "Knox Vault EAL5+ hardware isolation titan." },
        { name: "Galaxy Z Fold 6", slug: "galaxy-z-fold-6", price: 1899.99, reason: "Dual-screen enterprise security workstation." },
      ],
      relatedQuestions: [
        "How do I enable 100% on-device AI processing?",
        "What is Knox Matrix security?",
      ],
      sources: [
        { title: "On-Device NPU vs Cloud AI Privacy Deep Dive", url: "/learn/on-device-vs-cloud-ai-privacy-deep-dive", domain: "galaxyai.hub" },
      ],
    };
  }

  return {
    query,
    aiOverview: `Galaxy AI delivers a comprehensive suite of on-device and cloud-assisted intelligence tools across Galaxy smartphones, tablets, and wearables. For your query "${query}", Galaxy AI accelerates productivity, streamlines multi-language translation, and enhances creative workflows.`,
    keyInsights: [
      "On-device Quantum NPU enables instant offline translations with Knox Vault security.",
      "Circle to Search provides instantaneous multimodal insights without app switching.",
      "Universal ecosystem sync connects smartphones, tablets, watches, and buds.",
    ],
    matchedDevices: [
      { name: "Galaxy S25 Ultra", slug: "galaxy-s25-ultra", price: 1299.99, reason: "Flagship AI Titan with Snapdragon 8 Elite." },
      { name: "Galaxy Watch Ultra", slug: "galaxy-watch-ultra", price: 649.99, reason: "Rugged Titanium Health AI with Energy Score." },
    ],
    relatedQuestions: [
      "Which Galaxy devices support on-device Live Translate?",
      "How does Knox Vault protect biometric AI data?",
      "Where can I try the interactive AI demos?",
    ],
    sources: [
      { title: "Explore All Galaxy AI Features", url: "/ai/features", domain: "galaxyai.hub" },
      { title: "Interactive AI Demo Studio", url: "/ai/demos", domain: "galaxyai.hub" },
    ],
  };
}

export async function getAssistantResponse(
  message: string,
  history: { role: string; content: string }[] = []
): Promise<{ reply: string; suggestedLinks?: { label: string; url: string }[] }> {
  await new Promise((res) => setTimeout(res, 400));
  const m = message.toLowerCase();

  // 1. Photography / Camera
  if (m.includes("photo") || m.includes("camera") || m.includes("edit") || m.includes("picture") || m.includes("zoom")) {
    return {
      reply:
        "For flagship photography and generative editing, the **Galaxy S25 Ultra** is our top recommendation! It features a 200MP quad-telephoto system, 100x Space Zoom, and built-in **Generative Edit** so you can relocate subjects and remove glass reflections in seconds.\n\nWould you like to test the photo editor demo or view full specs?",
      suggestedLinks: [
        { label: "📸 Try Photo Edit Demo", url: "/ai/demos?tab=photo" },
        { label: "📱 Galaxy S25 Ultra Specs", url: "/devices/galaxy-s25-ultra" },
      ],
    };
  }

  // 2. Student / Education / Note Assist
  if (m.includes("student") || m.includes("school") || m.includes("college") || m.includes("note") || m.includes("study") || m.includes("lecture")) {
    return {
      reply:
        "For students and academic work, combining **Galaxy Tab S10 Ultra** with **Note Assist** & **Transcript Assist** is unbeatable! You can record multi-speaker lectures, generate executive bullet summaries, and solve math formulas with **Circle to Search**.\n\nPlus, there is an active student discount promo!",
      suggestedLinks: [
        { label: "🎓 Galaxy Tab S10 Ultra", url: "/devices/galaxy-tab-s10-ultra" },
        { label: "📝 Note Assist Demo", url: "/ai/demos?tab=notes" },
        { label: "🎁 Student Deals", url: "/offers" },
      ],
    };
  }

  // 3. Translation / Language / Travel
  if (m.includes("translate") || m.includes("language") || m.includes("travel") || m.includes("spanish") || m.includes("korean") || m.includes("japan") || m.includes("interpreter")) {
    return {
      reply:
        "Galaxy AI offers **Live Translate** and **Interpreter Mode**. You can perform real-time two-way voice translation during phone calls or use dual-screen flex mode on **Galaxy Z Fold 6 / Z Flip 6** to speak face-to-face with locals 100% offline!",
      suggestedLinks: [
        { label: "🌐 Try Live Translate Demo", url: "/ai/demos?tab=translation" },
        { label: "📖 Traveler's Guide", url: "/learn/travelers-guide-to-live-translate-and-interpreter" },
      ],
    };
  }

  // 4. Security / Knox / Privacy
  if (m.includes("knox") || m.includes("security") || m.includes("privacy") || m.includes("safe") || m.includes("offline")) {
    return {
      reply:
        "Privacy is paramount in Galaxy AI. **Samsung Knox Vault** uses hardware EAL5+ isolation enclaves to ensure sensitive tools (like Live Translate & biometric data) run on-device inside the Quantum NPU without leaving your hardware.",
      suggestedLinks: [
        { label: "🔒 Privacy Deep Dive Guide", url: "/learn/on-device-vs-cloud-ai-privacy-deep-dive" },
        { label: "✨ All AI Features", url: "/ai/features" },
      ],
    };
  }

  // 5. Comparison / Differences
  if (m.includes("compare") || m.includes("difference") || m.includes("vs") || m.includes("better")) {
    return {
      reply:
        "You can evaluate up to 3 Galaxy devices side-by-side on our **Device Comparison Matrix**! Compare display nits, chipsets, camera MP, battery life, and AI feature matrices.",
      suggestedLinks: [
        { label: "⚖️ Open Device Comparison", url: "/compare" },
        { label: "📱 Browse Hardware Catalog", url: "/devices" },
      ],
    };
  }

  // 6. Offers / Discounts / Coupon Codes
  if (m.includes("discount") || m.includes("deal") || m.includes("offer") || m.includes("coupon") || m.includes("price") || m.includes("sale")) {
    return {
      reply:
        "We currently have several active promo codes!\n• **GALAXYAI2025** — 15% off any Galaxy AI order\n• **STUDENTAI** — $100 off Tab S10 or S25 series\n• **WATCHAI50** — $50 off Galaxy Watch Ultra\n• **BUDSECO** — 20% off Galaxy Buds3 Pro",
      suggestedLinks: [
        { label: "🏷️ View All Active Offers", url: "/offers" },
        { label: "🛒 View Cart", url: "/cart" },
      ],
    };
  }

  // 7. Foldables / Galaxy Z Series
  if (m.includes("fold") || m.includes("flip") || m.includes("foldable")) {
    return {
      reply:
        "The **Galaxy Z Fold 6** and **Z Flip 6** unlock unique AI form factors! Enjoy dual-screen Interpreter mode, hands-free FlexCam photo capture, and split-screen multi-tasking Note Assist.",
      suggestedLinks: [
        { label: "📱 Galaxy Z Fold 6", url: "/devices/galaxy-z-fold-6" },
        { label: "📱 Galaxy Z Flip 6", url: "/devices/galaxy-z-flip-6" },
      ],
    };
  }

  // 8. Watch / Wearables / Health AI
  if (m.includes("watch") || m.includes("health") || m.includes("fitness") || m.includes("buds") || m.includes("audio")) {
    return {
      reply:
        "Galaxy Health AI on **Galaxy Watch Ultra** calculates your daily Energy Score, tracks sleep apnea, and pairs with **Galaxy Buds3 Pro** for in-ear live audio translation!",
      suggestedLinks: [
        { label: "⌚ Galaxy Watch Ultra", url: "/devices/galaxy-watch-ultra" },
        { label: "🎧 Galaxy Buds3 Pro", url: "/devices/galaxy-buds3-pro" },
      ],
    };
  }

  // Default Assistant Fallback
  return {
    reply:
      "Hello! I am your **Galaxy AI Assistant**. I can help you find the ideal Galaxy device, explain our AI tools (Circle to Search, Live Translate, Generative Edit, Note Assist), compare models, or guide you through live interactive demos. What would you like to explore today?",
    suggestedLinks: [
      { label: "✨ Interactive AI Studio Demos", url: "/ai/demos" },
      { label: "📱 Device Catalog", url: "/devices" },
      { label: "🎯 Galaxy AI for You", url: "/#persona-section" },
    ],
  };
}
