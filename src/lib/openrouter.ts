export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

// Tried in order; OpenRouter falls back automatically if one is down or rate-limited.
// Override with OPENROUTER_MODEL (comma-separated) without touching code.
const DEFAULT_MODELS = ['openrouter/free'];

function models(): string[] {
  const fromEnv = process.env.OPENROUTER_MODEL?.split(',').map((m) => m.trim()).filter(Boolean);
  return fromEnv?.length ? fromEnv : DEFAULT_MODELS;
}

// Streams a chat completion, calling onChunk for each piece of text. Resolves with the full text.
export async function streamChat(messages: ChatMessage[], onChunk: (text: string) => void): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY is not set');

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'X-Title': 'Reyca De Alba Portfolio',
    },
    body: JSON.stringify({ models: models(), messages, stream: true, max_tokens: 700 }),
    signal: AbortSignal.timeout(45000),
  });

  if (!response.ok || !response.body) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`OpenRouter ${response.status}: ${err.error?.message || response.statusText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    // Keep the trailing partial line for the next read
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      // Lines starting with ":" are OpenRouter keepalive comments
      if (!line.startsWith('data: ') || line === 'data: [DONE]') continue;
      let data;
      try {
        data = JSON.parse(line.slice(6));
      } catch {
        continue;
      }
      if (data.error) throw new Error(`OpenRouter: ${data.error.message}`);
      const text = data.choices?.[0]?.delta?.content;
      if (text) {
        fullText += text;
        onChunk(text);
      }
    }
  }

  return fullText;
}
