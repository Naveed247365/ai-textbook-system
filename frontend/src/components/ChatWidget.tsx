import React, { useState, useEffect, useRef } from 'react';
import './ChatWidget.css';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Handle text selection
  useEffect(() => {
    const handleTextSelection = () => {
      const selectedText = window.getSelection()?.toString().trim();
      if (selectedText) {
        setSelectedText(selectedText);
      }
    };

    document.addEventListener('mouseup', handleTextSelection);
    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
    };
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAskAI = async () => {
    if (!selectedText && !inputValue.trim()) return;

    const userMessage = selectedText || inputValue;
    const newMessage: Message = {
      id: Date.now().toString(),
      content: userMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setSelectedText(null);
    setIsLoading(true);

    try {
      // In a real implementation, this would call the backend API
      // For now, we'll simulate a response
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: `I received your query about: "${userMessage}". This is a simulated response. In the full implementation, this would connect to the backend RAG system to provide contextually relevant answers based on the textbook content.`,
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error processing your request.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskAI();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating button to open chat */}
      <button 
        className={`chat-float ${isOpen ? 'hidden' : ''}`} 
        onClick={toggleChat}
        aria-label="Open chat"
      >
        💬
      </button>

      {/* Chat widget */}
      {isOpen && (
        <div className="chat-widget">
          <div className="chat-header">
            <h3>AI Assistant</h3>
            <button className="chat-close" onClick={toggleChat}>
              ×
            </button>
          </div>
          
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="chat-welcome">
                <p>Hello! Select any text in the document and click here to ask AI about it, or type your question below.</p>
                {selectedText && (
                  <div className="selected-text-preview">
                    <small>You selected: "{selectedText.substring(0, 50)}{selectedText.length > 50 ? '...' : ''}"</small>
                  </div>
                )}
              </div>
            ) : (
              messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`message ${message.sender}`}
                >
                  <div className="message-content">
                    {message.content}
                  </div>
                  <div className="message-timestamp">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {selectedText && (
            <div className="selected-text-bar">
              <span className="selected-preview">
                Query: "{selectedText.substring(0, 60)}{selectedText.length > 60 ? '...' : ''}"
              </span>
              <button 
                className="use-selection-btn" 
                onClick={handleAskAI}
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Ask AI'}
              </button>
            </div>
          )}
          
          <div className="chat-input-area">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={selectedText ? "Or add more context..." : "Ask about the textbook content..."}
              rows={2}
              disabled={isLoading}
            />
            <button 
              onClick={handleAskAI} 
              disabled={isLoading || (!inputValue.trim() && !selectedText)}
              className="send-button"
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;