import { type Message } from '../types/Message.ts';

const searchParams = new URLSearchParams(window.location.search);
const userId = searchParams.get('user');

export async function getMessages(): Promise<Message[]> {
    const response = await fetch(`${import.meta.env.VITE_API_BASE}/messages?userId=${userId}`);
    const responseJson = await response.json();
    return responseJson.messages;
}

export async function postMessage(text: string): Promise<Message> {
    const message = {
        text,
        userId,
        date: new Date()
    }
    const response = await fetch(`${import.meta.env.VITE_API_BASE}/messages`, {
        method: 'POST',
        body: JSON.stringify(message),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const responseJson = await response.json();
    return responseJson.message;
}

export function getMessageStream(): EventSource {
    return new EventSource(`${import.meta.env.VITE_API_BASE}/sse?userId=${userId}`);;
}



