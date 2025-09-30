class LocalAIService {
  
  private async generateText(prompt: string): Promise<string> {
    const messages = [
      { role: 'user', content: prompt }
    ];

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages })
      });

      if (!response.ok || !response.body) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';
      let partialChunk = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = (partialChunk + chunk).split('\n');
        partialChunk = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() === '') continue;
          try {
            const parsed = JSON.parse(line);
            if (parsed.message && parsed.message.content) {
              fullResponse += parsed.message.content;
            }
          } catch (e) {
            console.warn('Failed to parse stream chunk in localAIService:', line, e);
          }
        }
      }
      return fullResponse;
    } catch (error) {
      console.error("Backend AI call failed:", error);
      return "An error occurred while communicating with the AI.";
    }
  }

  public async analyzeSymptoms(symptomText: string): Promise<string> {
    const prompt = `
      As an AI medical assistant for an astronaut on a solo Mars mission, analyze the following logged symptom.
      Provide a brief, clear analysis and a simple, safe recommendation.
      The astronaut has a standard medical kit. Prioritize caution.
      Symptom: "${symptomText}"
      Analysis:
    `;
    return this.generateText(prompt);
  }

  public async generateLegacyLog(entryText: string): Promise<string> {
    const prompt = `
      Convert the following diary entry from an astronaut into a formal, third-person "Legacy Log" entry, suitable for historical archives.
      Focus on mission-critical events, observations, and psychological state.
      Original Entry: "${entryText}"
      Legacy Log:
    `;
    return this.generateText(prompt);
  }

  public async createEarthLinkMessage(entryText: string): Promise<string> {
    const prompt = `
      Condense the following astronaut's diary entry into a brief, personal message (under 280 characters) to be sent to their family via the EarthLink.
      Capture the essence and emotion of the entry.
      Original Entry: "${entryText}"
      EarthLink Message:
    `;
    return this.generateText(prompt);
  }
  
  public async runCoPilotMAITRI(prompt: string): Promise<string> {
    const specializedPrompt = `
      You are MAITRI, an AI Co-Pilot. The user wants to modify their mission schedule.
      If they state a clear intention to add a task with a time, respond with ONLY a JSON object with the format:
      JSON:{"time": "HH:MM", "task": "Description"}
      For example, if the user says "Add a geology survey for 14:30", you respond with:
      JSON:{"time": "14:30", "task": "Geology Survey"}
      If the user's request is ambiguous or conversational, just respond as a helpful AI assistant without the JSON prefix.

      User's request: "${prompt}"
    `;
    return this.generateText(specializedPrompt);
  }
}

export const localAIService = new LocalAIService();