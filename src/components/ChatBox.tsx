import {useEffect, useState, useRef, ChangeEvent, FormEventHandler} from 'react';
import './ChatBox.scss'
import Message from './Message'
import sendIcon from '/send.svg'
import { type Message as MessageType } from '../types/Message.ts';
import { getMessages, postMessage, getMessageStream } from '../api/messages.ts';

function ChatBox() {
    const chatBoxRef = useRef<HTMLElement | null>(null);
    const [formData, setFormData] = useState<{message: string}>({
        message: '',
    });
    const [messages, setMessages] = useState<MessageType[]>([]);

    function scrollChatBoxToBottom() {
        setTimeout(() =>  {
            chatBoxRef.current?.scrollTo({ top: chatBoxRef.current.scrollHeight, behavior: 'smooth' });
        });
    }

    function handleMessageInputChange(e: ChangeEvent){
        setFormData({
            message: e.target.value
        });
    }

    async function handleMessageSubmit(e: FormEventHandler) {
        e.preventDefault();

        try {
            const messageResponse: MessageType = await postMessage(formData.message);
            messageResponse.type = 'outgoing';
            setMessages(messages => [...messages, messageResponse]);
            setFormData({
                message: ''
            });
            scrollChatBoxToBottom();
        } catch(error) {
            console.error(error);
        }
    }

    useEffect(() => {
        async function fetchMessages () {
            try {
                const messagesResponse: MessageType[] = await getMessages();
                setMessages(messagesResponse);
            } catch(error) {
                console.error(error);
            }
        }
        fetchMessages();

        const eventSource = getMessageStream();
        eventSource.onmessage = function(e) {
            const newMessage: MessageType = JSON.parse(e.data);
            newMessage.type = 'incoming';
            setMessages(messages => [...messages, newMessage]);
            scrollChatBoxToBottom();
        }
    }, []);

    const messageList = messages.map((message, index) => <Message key={index} {...message}></Message>);

    return (
        <div className="chat-box">
            <div className="chat-box__header">
                Group: Planning Meeting
            </div>
            <div className="chat-box__messages" ref={chatBoxRef}>
                {messageList}
            </div>
            <form className="chat-box__controls" onSubmit={handleMessageSubmit}>
                <input className="chat-box__controls__input"
                       type="text"
                       onChange={handleMessageInputChange}
                       value={formData.message} />
                <button className="chat-box__controls__submit" type="submit">
                    <img src={sendIcon} alt="send" />
                </button>
            </form>
        </div>
    )
}

export default ChatBox
