import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../utils/useSocket';
import './GentleChat.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'counselor';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

interface GentleChatProps {
  conversationId?: string;
  counselorId?: string;
}

const GentleChat: React.FC<GentleChatProps> = ({ conversationId, counselorId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [counselorTyping, setCounselorTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on('message:received', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('message:typing', () => {
      setCounselorTyping(true);
    });

    socket.on('message:stop_typing', () => {
      setCounselorTyping(false);
    });

    return () => {
      socket.off('message:received');
      socket.off('message:typing');
      socket.off('message:stop_typing');
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, counselorTyping]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Simulate sending
    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
        )
      );
    }, 500);

    // Emit typing indicator
    if (socket && counselorId) {
      socket.emit('message:typing', { to: counselorId, conversationId });
    }
  };

  const handleTyping = () => {
    if (socket && counselorId) {
      socket.emit('message:typing', { to: counselorId, conversationId });
    }
  };

  return (
    <div className="gentle-chat-container">
      <div className="chat-messages" role="log" aria-live="polite">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-message chat-message-${message.sender}`}
          >
            <div className="message-bubble">
              <p className="message-text">{message.text}</p>
              <div className="message-meta">
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                {message.sender === 'user' && (
                  <span className={`message-status status-${message.status}`} aria-label={`Message ${message.status}`}>
                    {message.status === 'sending' && '⏳'}
                    {message.status === 'sent' && '✓'}
                    {message.status === 'delivered' && '✓✓'}
                    {message.status === 'read' && '✓✓'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {counselorTyping && (
          <div className="chat-message chat-message-counselor">
            <div className="typing-indicator">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <textarea
          className="chat-input"
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            handleTyping();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type your message..."
          rows={2}
          aria-label="Message input"
        />
        <button
          className="chat-send-button"
          onClick={handleSend}
          disabled={!inputText.trim()}
          aria-label="Send message"
        >
          <span className="send-icon">→</span>
        </button>
      </div>
    </div>
  );
};

export default GentleChat;

