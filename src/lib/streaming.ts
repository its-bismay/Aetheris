
export async function processStream(
  response: Response,
  onChunk: (text: string) => void
): Promise<void> {
  if (!response.body) {
    throw new Error('Response body is null');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';


  const tokenQueue: string[] = [];
  let isDraining = false;
  let isStreamFinished = false;


  const drainQueue = async () => {
    if (isDraining) return;
    isDraining = true;
    
    while (tokenQueue.length > 0 || !isStreamFinished) {
      if (tokenQueue.length > 0) {
        const token = tokenQueue.shift();
        if (token) {
          onChunk(token);

          const delay = tokenQueue.length > 40 ? 5 : 30; 
          await new Promise(r => setTimeout(r, delay));
        }
      } else {

        await new Promise(r => setTimeout(r, 10));
      }
    }
    isDraining = false;
  };

  try {

    drainQueue();

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        isStreamFinished = true;
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const chunks = buffer.split(/\r?\n\r?\n/);
      buffer = chunks.pop() || '';

      for (const chunk of chunks) {
        const dataPrefix = 'data: ';
        if (chunk.startsWith(dataPrefix)) {
          const jsonString = chunk.slice(dataPrefix.length).trim();
          if (jsonString === '') continue;

          try {
            const data = JSON.parse(jsonString);
            const textPart = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (textPart) {
              const tokens = textPart.match(/(\S+\s*|\s+)/g) || [textPart];
              tokenQueue.push(...tokens);
            }
          } catch (e) {
            console.warn('Failed to parse Gemini chunk JSON:', e, jsonString);
          }
        }
      }
    }
  } finally {
    isStreamFinished = true;
    reader.releaseLock();
  }

  while (isDraining) {
      await new Promise(r => setTimeout(r, 50));
  }
}
