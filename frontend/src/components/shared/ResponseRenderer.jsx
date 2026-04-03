import React, { useMemo, useState, useEffect } from 'react';
import { CheckCircle2, Zap, Target, BookOpen, MessageSquare } from 'lucide-react';

/**
 * ResponseRenderer
 * Parses markdown structured AI responses into 4 distinct animated cards.
 * Headers: ## 📌 Summary, ## 🔑 Key Points, ## ✅ Action Steps, ## 📚 Resource
 */
export default function ResponseRenderer({ content }) {
  const [revealedIds, setRevealedIds] = useState(new Set());

  const blocks = useMemo(() => {
    if (!content) return [];

    const rawBlocks = content.split('## 📌 Summary').filter(block => block.trim());
    
    const parsed = rawBlocks.map((blockContent, blockIndex) => {
      const fullBlock = '## 📌 Summary' + blockContent;
      
      const headerConfigs = [
        { id: 'summary', label: 'Summary', marker: '## 📌 Summary', color: 'border-purple-500', icon: <Zap className="w-5 h-5 text-purple-400" />, animation: 'animate-slide-up-1' },
        { id: 'keyPoints', label: 'Key Points', marker: '## 🔑 Key Points', color: 'border-green-500', icon: <Target className="w-5 h-5 text-green-400" />, animation: 'animate-slide-up-2' },
        { id: 'actionSteps', label: 'Action Steps', marker: '## ✅ Action Steps', color: 'border-blue-500', icon: <CheckCircle2 className="w-5 h-5 text-blue-400" />, animation: 'animate-slide-up-3' },
        { id: 'resource', label: 'Resource', marker: '## 📚 Resource', color: 'border-amber-500', icon: <BookOpen className="w-5 h-5 text-amber-400" />, animation: 'animate-slide-up-4' }
      ];

      const sections = [];
      headerConfigs.forEach((config, index) => {
        const headerIndex = fullBlock.indexOf(config.marker);
        if (headerIndex !== -1) {
          const start = headerIndex + config.marker.length;
          let nextIndex = fullBlock.length;
          headerConfigs.slice(index + 1).forEach(nextConfig => {
            const found = fullBlock.indexOf(nextConfig.marker);
            if (found !== -1 && found < nextIndex) nextIndex = found;
          });
          
          const body = fullBlock.substring(start, nextIndex).trim();
          if (body) {
            sections.push({ ...config, uniqueId: `${blockIndex}-${config.id}`, body });
          }
        }
      });
      return { id: `block-${blockIndex}`, sections };
    });

    return parsed;
  }, [content]);

  // Track which IDs have been seen to lock their animation
  useEffect(() => {
    setRevealedIds(prev => {
      const newIds = new Set(prev);
      let changed = false;
      blocks.forEach(block => {
        block.sections.forEach(section => {
          if (!newIds.has(section.uniqueId)) {
            newIds.add(section.uniqueId);
            changed = true;
          }
        });
      });
      return changed ? newIds : prev;
    });
  }, [blocks]);

  if (!blocks.length && !content) return null;
  
  if (!blocks.length && content) {
    return (
       <div className="glass-card p-6 border-l-4 border-slate-500 text-slate-300 whitespace-pre-wrap animate-fade-in shadow-xl shadow-black/20">
         <div className="flex items-center gap-3 mb-4 opacity-50">
           <MessageSquare className="w-5 h-5" />
           <span className="text-xs font-bold uppercase tracking-widest">Unstructured Response</span>
         </div>
         {content}
       </div>
    );
  }

  return (
    <div className="space-y-12 w-full py-4 overflow-hidden">
      {blocks.map((block, bIndex) => (
        <div key={block.id} className="space-y-6">
          {bIndex > 0 && <div className="h-px w-full bg-gradient-to-r from-transparent via-surface-border to-transparent my-12" />}
          
          {block.sections.map((section) => (
            <div
              key={section.uniqueId}
              className={`group glass-card border-l-4 ${section.color} p-6 transition-all hover:translate-x-1 shadow-xl shadow-black/20 ${
                !revealedIds.has(section.uniqueId) ? section.animation : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-surface/80 border border-surface-border group-hover:scale-110 transition-transform">
                  {section.icon}
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight leading-none">{section.label}</h3>
              </div>

              <div className="text-slate-300 leading-relaxed text-sm sm:text-base">
                {section.id === 'keyPoints' ? (
                  <ul className="space-y-3">
                    {section.body.split('\n').filter(line => line.trim()).map((line, i) => (
                      <li key={i} className="flex items-start gap-4 group/item">
                        <CheckCircle2 className="w-5 h-5 text-green-500/50 mt-0.5 shrink-0 group-hover/item:text-green-500 transition-colors" />
                        <span>{line.replace(/^[-*]\s*/, '').trim()}</span>
                      </li>
                    ))}
                  </ul>
                ) : section.id === 'actionSteps' ? (
                  <div className="space-y-5">
                    {section.body.split('\n').filter(line => line.trim()).map((line, i) => (
                      <div key={i} className="flex gap-4 items-start group/step">
                        <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-sm font-bold group-hover/step:bg-blue-500/20 transition-colors">
                          {i + 1}
                        </span>
                        <p className="pt-1">{line.replace(/^\d+\.\s*/, '').trim()}</p>
                      </div>
                    ))}
                  </div>
                ) : section.id === 'resource' ? (
                  <div className="inline-flex items-center px-5 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-semibold hover:bg-amber-500/20 shadow-lg shadow-amber-500/10 transition-all cursor-default animate-fade-in">
                    {section.body.replace(/^[*_#-]*\s*/, '').trim()}
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{section.body}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
