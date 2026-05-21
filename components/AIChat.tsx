
import React, { useState, useRef, useEffect } from 'react';
import { analyzeFleetPerformance } from '../services/fleetAnalyzer';
import { TowLog, ChatMessage } from '../types';

interface Props {
  logs: TowLog[];
}

const AIChat: React.FC<Props> = ({ logs }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hello! I am Airtrek Insight. Ask me anything about today\'s fleet performance or historical logs.', timestamp: new Date() }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const response = await analyzeFleetPerformance(logs, input);
    
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'assistant', content: response, timestamp: new Date() }]);
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isOpen ? 'w-96 h-[500px]' : 'w-16 h-16'}`}>
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-full h-full bg-orange-500 rounded-full flex items-center justify-center text-white shadow-xl hover:bg-orange-600 transition-colors"
        >
          <i className="fas fa-robot text-2xl"></i>
        </button>
      ) : (
        <div className="w-full h-full bg-[#1C2128] border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <i className="fas fa-robot text-orange-500"></i>
              <span className="font-bold text-sm">AIRTREK INSIGHT</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-200 border border-gray-700'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-800 p-3 rounded-2xl border border-gray-700 flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-700 flex space-x-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about tow logs..."
              className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
            />
            <button 
              onClick={handleSend}
              className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChat;
