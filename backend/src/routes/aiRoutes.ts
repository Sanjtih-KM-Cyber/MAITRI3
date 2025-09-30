import { Router, Request, Response } from 'express';

const router = Router();

const OLLAMA_URL = 'http://localhost:11434/api/chat';

router.post('/chat', async (req: Request, res: Response) => {
  const { messages } = req.body;

  if (!messages) {
    return res.status(400).send('Missing "messages" in request body');
  }

  try {
    const ollamaPayload = {
      model: 'gemma:2b',
      messages: messages,
      stream: true,
    };

    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ollamaPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ollama API error:', errorText);
      return res.status(response.status).send(`Ollama error: ${errorText}`);
    }

    // Set the content type for a streaming response
    res.setHeader('Content-Type', 'application/x-ndjson');
    
    // Pipe the streaming response body directly to the client
    if (response.body) {
       // @ts-ignore - response.body is a ReadableStream which is compatible with pipe
      response.body.pipe(res);
    } else {
      res.status(500).send('Ollama response body was empty.');
    }

  } catch (error: any) {
    console.error('Error proxying to Ollama:', error);
    res.status(500).send(`Failed to connect to Ollama service. Is it running? Error: ${error.message}`);
  }
});

export default router;
