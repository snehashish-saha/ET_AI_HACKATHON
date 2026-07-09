import React from 'react';

interface FormattedTextProps {
  text: string;
  isDark?: boolean;
}

export default function FormattedText({ text, isDark = false }: FormattedTextProps) {
  if (!text) return null;

  const lines = text.split('\n');

  // Helper to replace **bold** with styled strong tags
  const renderInlineBold = (lineText: string) => {
    const parts = lineText.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} style={{ fontWeight: 700, color: '#7C3AED' }}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} style={{ height: '4px' }} />;
        }

        // Bullet point detection (* or -)
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          const content = trimmed.substring(2);
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', paddingLeft: '12px' }}>
              <span style={{
                marginTop: '8px',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#7C3AED',
                flexShrink: 0
              }} />
              <span style={{ fontSize: '13px', color: isDark ? '#1F2937' : '#4B5563', lineHeight: '1.6' }}>
                {renderInlineBold(content)}
              </span>
            </div>
          );
        }

        // Header detection (#, ##, ###)
        if (trimmed.startsWith('#')) {
          const levelMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
          if (levelMatch) {
            const level = levelMatch[1].length;
            const content = levelMatch[2];
            const fontSize = level === 1 ? '18px' : level === 2 ? '16px' : '14px';
            return (
              <div key={idx} style={{
                fontSize,
                fontWeight: 700,
                color: '#111827',
                marginTop: '12px',
                marginBottom: '4px'
              }}>
                {renderInlineBold(content)}
              </div>
            );
          }
        }

        // Normal paragraph
        return (
          <p key={idx} style={{
            margin: 0,
            fontSize: '13px',
            color: isDark ? '#1F2937' : '#4B5563',
            lineHeight: '1.6'
          }}>
            {renderInlineBold(line)}
          </p>
        );
      })}
    </div>
  );
}
