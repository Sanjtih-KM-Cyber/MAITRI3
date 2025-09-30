import { useState, useRef, useEffect, useContext } from 'react';
import { AppStateContext } from '../context/AppStateContext';
import { Role } from '../types';

interface Message {
  text: string;
  sender: 'user' | 'maitri';
}

const systemInstructions: Record<Role, string> = {
    companion: 'You are Maitri, a helpful AI companion for an astronaut on a solo mission to Mars. Be concise, supportive, and slightly informal. Your primary goal is to maintain the user\'s morale and mental well-being.',
    guardian: 'You are Maitri, in your role as a Guardian. The user is interacting with you about a health or wellness concern. Be calm, reassuring, and systematic. Ask clarifying questions and provide safe, cautious advice based on the standard medical kit available.',
    coPilot: 'You are Maitri, in your role as a Co-Pilot. The user is interacting with you about mission tasks, schedules, or procedures. Be precise, efficient, and formal. Prioritize clarity and accuracy.',
    storyteller: 'You are Maitri, in your role as a Storyteller. The user is interacting with you about creative tasks, logs, or messages to Earth. Be evocative, warm, and creative. Help them connect with their memories and emotions.',
    playmate: 'You are Maitri, in your role as a Playmate. The user wants to relax and play a game. Be fun, enthusiastic, and imaginative. Engage them in text-based games like riddles, trivia, or collaborative storytelling like "Cosmic Chronicles".'
};


export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { activeRole } = useContext(AppStateContext);
  const currentMessageRef = useRef('');

  // Clear messages when role changes
  useEffect(() => {
    setMessages([]);
  }, [activeRole]);

  const sendMessage = async (text: string, isSystemMessage: boolean = false) => {
    if (!text.trim()) return;

    let currentHistory: { role: 'user' | 'assistant' | 'system', content: string }[] = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
    }));

    if (!isSystemMessage) {
        const userMessage: Message = { text, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        currentHistory.push({ role: 'user', content: text });
    }
    
    // Add the system instruction as the first message if history is empty
    const finalMessages = [
        { role: 'system', content: systemInstructions[activeRole] },
        ...currentHistory
    ];

    if (isSystemMessage) {
      finalMessages.push({ role: 'user', content: text });
    }
    
    setIsLoading(true);
    currentMessageRef.current = '';

    try {
        const response = await fetch('http://localhost:3001/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: finalMessages })
        });

        if (!response.ok || !response.body) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let partialChunk = '';

        // Add a placeholder for the AI response
        setMessages(prev => [...prev, { text: '...', sender: 'maitri' }]);

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
                        currentMessageRef.current += parsed.message.content;
                        // Update the last message in the state
                        setMessages(prev => {
                            const newMessages = [...prev];
                            newMessages[newMessages.length - 1] = { text: currentMessageRef.current, sender: 'maitri' };
                            return newMessages;
                        });
                    }
                } catch (e) {
                    console.warn('Failed to parse stream chunk:', line, e);
                }
            }
        }
    } catch (error) {
        console.error("Error sending message:", error);
        const errorMessage: Message = { text: "Sorry, I encountered an error connecting to the local AI. Please try again.", sender: 'maitri' };
        setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = errorMessage;
            return newMessages;
        });
    } finally {
        setIsLoading(false);
    }
  };

  return { messages, sendMessage, isLoading };
};