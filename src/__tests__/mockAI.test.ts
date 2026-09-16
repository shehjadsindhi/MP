import {
  getAssistantResponse,
  translateText,
  rewriteText,
  processNotes,
  searchGalaxyAI,
} from "@/lib/mockAI";

describe("Mock AI Simulation Engines", () => {
  describe("getAssistantResponse", () => {
    it("should provide contextual response for photography query", async () => {
      const res = await getAssistantResponse("tell me about the camera and photography");
      expect(res).toBeDefined();
      expect(typeof res.reply).toBe("string");
      expect(res.reply.length).toBeGreaterThan(20);
      expect(Array.isArray(res.suggestedLinks)).toBe(true);
    });

    it("should provide contextual response for Knox security query", async () => {
      const res = await getAssistantResponse("how does Knox security protect my data?");
      expect(res.reply.toLowerCase()).toContain("knox");
    });

    it("should handle general inquiries with fallback answers", async () => {
      const res = await getAssistantResponse("what is this hub?");
      expect(res.reply).toBeDefined();
      expect(res.suggestedLinks && res.suggestedLinks.length > 0).toBe(true);
    });
  });

  describe("translateText", () => {
    it("should translate English to Spanish", async () => {
      const result = await translateText("Hello, how are you?", "en", "es");
      expect(result).toBeDefined();
      expect(result.sourceText).toBe("Hello, how are you?");
      expect(result.translatedText).toBeDefined();
      expect(typeof result.translatedText).toBe("string");
      expect(result.detectedConfidence).toBeGreaterThan(0.8);
    });

    it("should handle empty or same language inputs gracefully", async () => {
      const result = await translateText("Same language test", "en", "en");
      expect(result.translatedText).toBe("Same language test");
    });
  });

  describe("rewriteText (Tone Studio)", () => {
    const original = "I need this project finished quickly because we are behind schedule.";

    it("should generate professional tone rewrite", async () => {
      const res = await rewriteText(original, "Professional");
      expect(res).toBeDefined();
      expect(res.originalText).toBe(original);
      expect(res.improvedText).toBeDefined();
      expect(res.tone).toBe("Professional");
      expect(Array.isArray(res.suggestions)).toBe(true);
    });

    it("should generate casual tone rewrite", async () => {
      const res = await rewriteText(original, "Casual");
      expect(res.tone).toBe("Casual");
      expect(res.improvedText).toBeDefined();
    });

    it("should generate concise tone rewrite", async () => {
      const res = await rewriteText(original, "Concise");
      expect(res.tone).toBe("Concise");
      expect(res.improvedText).toBeDefined();
    });
  });

  describe("processNotes (Note Assist)", () => {
    const rawNotes = `Meeting Notes:
- Finalize Q3 hardware marketing strategy
- Review Galaxy AI Photo Editor performance metrics
- Team deadline is Friday at 5 PM`;

    it("should summarize notes", async () => {
      const res = await processNotes(rawNotes, "summarize");
      expect(res).toBeDefined();
      expect(Array.isArray(res.summary)).toBe(true);
      expect(res.summary.length).toBeGreaterThan(0);
    });

    it("should extract actionable tasks", async () => {
      const res = await processNotes(rawNotes, "extractTasks");
      expect(res).toBeDefined();
      expect(Array.isArray(res.tasks)).toBe(true);
      expect(res.tasks && res.tasks.length > 0).toBe(true);
    });
  });

  describe("searchGalaxyAI (Circle to Search Simulation)", () => {
    it("should return visual search entities and suggestions", async () => {
      const res = await searchGalaxyAI("Galaxy S25 Ultra camera");
      expect(res).toBeDefined();
      expect(res.aiOverview).toBeDefined();
      expect(Array.isArray(res.keyInsights)).toBe(true);
      expect(Array.isArray(res.matchedDevices)).toBe(true);
    });
  });
});
