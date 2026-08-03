import OpenAI from "openai";

/**
 * SpaceXAI / xAI (OpenAI-compatible).
 * Set XAI_API_KEY in env. Optional XAI_MODEL (default grok-4-1-fast-non-reasoning or grok-4.5).
 */
export function isAiEnabled() {
  return Boolean(process.env.XAI_API_KEY?.trim());
}

export function getXaiClient() {
  const apiKey = process.env.XAI_API_KEY?.trim();
  if (!apiKey) return null;
  return new OpenAI({
    apiKey,
    baseURL: process.env.XAI_BASE_URL || "https://api.x.ai/v1",
  });
}

export function extractiveSummary(content: string, maxSentences = 3): string {
  const plain = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`\[\]()!]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const sentences = plain
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 40);

  if (sentences.length === 0) {
    return plain.slice(0, 280) + (plain.length > 280 ? "…" : "");
  }

  // Score by length + keyword density (simple extractive)
  const keywords = ["product", "design", "craft", "team", "user", "build", "write", "system"];
  const scored = sentences.map((s, i) => {
    const lower = s.toLowerCase();
    const kw = keywords.reduce((n, k) => n + (lower.includes(k) ? 1 : 0), 0);
    const positionBoost = i < 3 ? 2 : i < 8 ? 1 : 0;
    return { s, score: kw * 2 + positionBoost + Math.min(s.length / 80, 2) };
  });

  scored.sort((a, b) => b.score - a.score);
  const picked = scored.slice(0, maxSentences).map((x) => x.s);
  // restore roughly original order
  const ordered = sentences.filter((s) => picked.includes(s)).slice(0, maxSentences);
  return ordered.join(" ");
}

export async function generateAiSummary(input: {
  title: string;
  content: string;
}): Promise<{ summary: string; provider: "xai" | "extractive" }> {
  const client = getXaiClient();
  const plain = input.content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .slice(0, 12_000);

  if (!client) {
    return { summary: extractiveSummary(input.content), provider: "extractive" };
  }

  const model = process.env.XAI_MODEL || "grok-4-1-fast-non-reasoning";

  try {
    // Prefer chat.completions for broad compatibility with OpenAI-compatible APIs
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.4,
      max_tokens: 400,
      messages: [
        {
          role: "system",
          content:
            "You write concise editorial summaries for a premium publication. 3–5 sentences. No bullet points. Capture the thesis and key takeaways. Neutral, elegant tone.",
        },
        {
          role: "user",
          content: `Title: ${input.title}\n\nArticle:\n${plain}\n\nWrite the summary:`,
        },
      ],
    });

    const summary = completion.choices[0]?.message?.content?.trim();
    if (!summary) {
      return { summary: extractiveSummary(input.content), provider: "extractive" };
    }
    return { summary, provider: "xai" };
  } catch {
    return { summary: extractiveSummary(input.content), provider: "extractive" };
  }
}
