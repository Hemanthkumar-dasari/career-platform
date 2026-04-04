import React from 'react';
import { Bot, User } from 'lucide-react';
import Loader from './Loader';

/**
 * ChatMessage
 * Renders individual messages for the Interview Simulator conversation.
 * Handles both "interviewer" (AI) and "candidate" (User) roles.
 */
export default function ChatMessage({ role, content, isLatest = false }) {
  const isAI = role === 'interviewer' || role === 'assistant';

  return (
    <div className={`flex w-full mb-6 animate-fade-in ${isAI ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[85%] sm:max-w-[75%] gap-3 ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border shadow-lg ${
          isAI 
            ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' 
            : 'bg-primary-500/10 border-primary-500/20 text-primary-400'
        }`}>
          {isAI ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
        </div>

        {/* Message Bubble */}
        <div className={`relative px-5 py-3.5 rounded-2xl border backdrop-blur-xl shadow-xl ${
          isAI 
            ? 'bg-surface-card/80 border-surface-border text-slate-200 rounded-tl-sm' 
            : 'bg-primary-500/10 border-primary-500/20 text-white rounded-tr-sm'
        }`}>
          <div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
            {content || (isLatest && isAI ? <Loader /> : '')}
          </div>
          
          {/* Subtle Role Label */}
          <span className={`absolute -top-5 text-[10px] font-bold uppercase tracking-widest opacity-30 ${
            isAI ? 'left-0' : 'right-0'
          }`}>
            {isAI ? 'Interviewer' : 'Candidate'}
          </span>
        </div>
      </div>
    </div>
  );
}
