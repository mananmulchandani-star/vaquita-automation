import React from 'react';
import { cn } from '@/lib/utils';
import { Image as ImageIcon, Video, FileText } from 'lucide-react';

export interface TemplatePreviewProps {
  template: {
    name: string;
    components: any[];
  };
  variables?: Record<string, string>;
  className?: string;
}

export function TemplatePreview({ template, variables = {}, className }: TemplatePreviewProps) {
  const header = template.components.find((c: any) => c.type === 'HEADER');
  const body = template.components.find((c: any) => c.type === 'BODY');
  const footer = template.components.find((c: any) => c.type === 'FOOTER');
  const buttons = template.components.find((c: any) => c.type === 'BUTTONS');

  // Replace variables in text
  const processText = (text: string) => {
    if (!text) return '';
    return text.replace(/\{\{(\d+)\}\}/g, (match, p1) => {
      return variables[p1] || `[Var ${p1}]`;
    });
  };

  return (
    <div className={cn("w-[300px] border-[8px] border-vaquita-border rounded-[2.5rem] bg-[#0a0a0a] overflow-hidden relative shadow-2xl", className)}>
      <div className="absolute top-0 inset-x-0 h-6 bg-vaquita-border rounded-b-2xl z-10 flex justify-center">
        <div className="w-16 h-4 bg-[#0a0a0a] rounded-full mt-1"></div>
      </div>
      
      <div 
        className="h-full pt-10 pb-4 px-3 flex flex-col bg-cover bg-center"
        style={{
          backgroundImage: 'radial-gradient(#262626 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      >
        <div className="bg-vaquita-bg-elevated border border-vaquita-border rounded-xl rounded-tl-sm p-3 shadow-sm relative">
          
          {header && (
            <div className="mb-2">
              {header.format === 'TEXT' && (
                <p className="font-bold text-sm text-vaquita-white">{processText(header.text)}</p>
              )}
              {header.format === 'IMAGE' && (
                <div className="w-full h-32 bg-vaquita-bg-secondary rounded-lg flex items-center justify-center border border-vaquita-border/50">
                  <ImageIcon className="text-vaquita-text-tertiary" size={24} />
                </div>
              )}
              {header.format === 'VIDEO' && (
                <div className="w-full h-32 bg-vaquita-bg-secondary rounded-lg flex items-center justify-center border border-vaquita-border/50">
                  <Video className="text-vaquita-text-tertiary" size={24} />
                </div>
              )}
            </div>
          )}

          {body && (
            <p className="text-sm text-vaquita-text whitespace-pre-wrap leading-relaxed">
              {processText(body.text)}
            </p>
          )}

          {footer && (
            <p className="text-[11px] text-vaquita-text-tertiary mt-2 uppercase tracking-wide">
              {processText(footer.text)}
            </p>
          )}

          {buttons && (
            <div className="mt-3 space-y-2 border-t border-vaquita-border/50 pt-3">
              {buttons.buttons.map((btn: any, idx: number) => (
                <div key={idx} className="w-full py-2 bg-vaquita-bg-secondary rounded text-center text-sm font-medium text-vaquita-info flex items-center justify-center">
                  {btn.type === 'URL' && <span className="mr-1.5">🔗</span>}
                  {btn.type === 'PHONE_NUMBER' && <span className="mr-1.5">📞</span>}
                  {btn.text}
                </div>
              ))}
            </div>
          )}
          
          <div className="absolute bottom-1 right-2 text-[9px] text-vaquita-text-tertiary">
            12:00 PM
          </div>
        </div>
      </div>
    </div>
  );
}
