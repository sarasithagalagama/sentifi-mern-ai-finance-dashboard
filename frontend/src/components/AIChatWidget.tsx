import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, User, Loader } from 'lucide-react';
import { aiApi } from '../api/aiApi';
import { useAuth } from '../context/AuthContext';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I am your Sentifi AI Financial Advisor. I can analyze your spending habits and provide personalized tips. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const { user } = useAuth();

  // Suggested questions
  const defaultQuestions = [
    "How can I save more money?",
    "Analyze my spending habits",
    "What are my highest expenses?",
    "Create a monthly budget plan"
  ];

  const suggestedQuestions = (user?.customQuestions && user.customQuestions.length > 0) 
    ? user.customQuestions 
    : defaultQuestions;

  const handleSend = async (textOverride?: string) => {
    const textToSend = typeof textOverride === 'string' ? textOverride : input;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await aiApi.chat(textToSend);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: response.advice || "I'm sorry, I couldn't process that request.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("AI Chat Error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "I'm having trouble connecting to the server. Please try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: 30,
          right: 30,
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'var(--primary)',
          color: '#000',
          border: 'none',
          boxShadow: '0 4px 12px rgba(74, 222, 128, 0.4)',
          cursor: 'pointer',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
        className="ai-widget-toggle"
      >
        {isOpen ? <X size={24} /> : <Bot size={28} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            bottom: 100,
            right: 30,
            width: 380,
            height: 500,
            background: 'var(--bg-secondary)', // #1e1e1e
            border: '1px solid var(--border)', // #333
            borderRadius: '24px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 9999,
            overflow: 'hidden',
            animation: 'slideUp 0.3s ease-out'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '20px',
            background: 'var(--card-accent)', // #18181b
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: 40, height: 40,
              borderRadius: '50%',
              background: 'rgba(74, 222, 128, 0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--primary)'
            }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: 2 }}>Sentifi AI</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, background: '#22c55e', borderRadius: '50%' }}></span>
                <span className="text-small text-mute">Online Advisor</span>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1,
            padding: '20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  gap: '8px'
                }}
              >
                {msg.sender === 'ai' && (
                  <div style={{
                    minWidth: 28, height: 28,
                    borderRadius: '50%',
                    background: 'rgba(74, 222, 128, 0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--primary)',
                    marginTop: 4
                  }}>
                    <Bot size={16} />
                  </div>
                )}
                
                <div style={{
                  maxWidth: '80%',
                  padding: '12px 16px',
                  borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: msg.sender === 'user' ? 'var(--primary)' : 'var(--bg-tertiary)',
                  color: msg.sender === 'user' ? '#000' : 'var(--text-primary)',
                  fontSize: '0.95rem',
                  lineHeight: 1.5,
                  boxShadow: msg.sender === 'user' ? '0 2px 5px rgba(74, 222, 128, 0.2)' : 'none'
                }}>
                  {msg.text}
                </div>

                {msg.sender === 'user' && (
                  <div style={{
                    minWidth: 28, height: 28,
                    borderRadius: '50%',
                    background: 'var(--bg-tertiary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-secondary)',
                    marginTop: 4
                  }}>
                    <User size={16} />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div style={{ display: 'flex', gap: '8px' }}>
                 <div style={{
                    minWidth: 28, height: 28,
                    borderRadius: '50%',
                    background: 'rgba(74, 222, 128, 0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--primary)',
                    marginTop: 4
                  }}>
                    <Bot size={16} />
                  </div>
                  <div style={{
                    padding: '12px',
                    borderRadius: '18px 18px 18px 4px',
                    background: 'var(--bg-tertiary)',
                    display: 'flex', alignItems: 'center', gap: 4
                  }}>
                    <div className="typing-dot" style={{animationDelay: '0s'}}></div>
                    <div className="typing-dot" style={{animationDelay: '0.2s'}}></div>
                    <div className="typing-dot" style={{animationDelay: '0.4s'}}></div>
                  </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          <div style={{ 
            padding: '0 16px 12px 16px',
            display: 'flex', 
            gap: '8px',
            overflowX: 'auto',
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none',  // IE/Edge
          }}>
             {suggestedQuestions.map((q, i) => (
               <button
                 key={i}
                 onClick={() => handleSend(q)}
                 style={{
                   whiteSpace: 'nowrap',
                   padding: '8px 12px',
                   borderRadius: '16px',
                   border: '1px solid var(--border)',
                   background: 'var(--bg-tertiary)',
                   color: 'var(--text-primary)',
                   fontSize: '0.8rem',
                   cursor: 'pointer',
                   flexShrink: 0,
                   transition: 'all 0.2s',
                 }}
                 onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.color = 'var(--primary)';
                    e.currentTarget.style.background = 'rgba(74, 222, 128, 0.05)';
                 }}
                 onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                    e.currentTarget.style.background = 'var(--bg-tertiary)';
                 }}
               >
                 {q}
               </button>
             ))}
          </div>

          {/* Input Area */}
          <div style={{
            padding: '16px',
            background: 'var(--card-accent)',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            gap: '10px'
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask for advice..."
              disabled={isTyping}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '0.95rem'
              }}
            />
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: input.trim() ? 'var(--primary)' : 'var(--bg-tertiary)',
                color: input.trim() ? '#000' : 'var(--text-secondary)',
                border: 'none',
                cursor: input.trim() ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'var(--transition)'
              }}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .typing-dot {
          width: 6px;
          height: 6px;
          background: var(--text-secondary);
          borderRadius: 50%;
          animation: bounce 1.4s infinite ease-in-out both; 
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        /* Hide scrollbar for suggestions */
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};

export default AIChatWidget;
