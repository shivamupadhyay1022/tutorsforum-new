import React from 'react';
import { MathfieldElement } from 'mathlive';


export function parseTextWithImages(input = "") {
  let text = input.trim();
  const parts = [];
  let lastIndex = 0;

  // Regex for: $...$ or ::::url:::: or ::::url::height::width::::
  const regex = /(?:\$(.+?)\$)|(?:::::(.*?)(?:::([\d.]+)::([\d.]+))?::::)/gs;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const [fullMatch] = match;

    // Add any text before the current match
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex, match.index),
      });
    }

    // Math content ($...$)
    if (match[1]) {
      parts.push({
        type: 'mathfield',
        content: match[1].trim(),
      });
    }
    // Image content
    else if (match[2]) {
      const url = match[2];
      const height = match[3] || 100;
      const width = match[4] || 100;
      parts.push({
        type: 'img',
        src: url,
        height,
        width,
      });
    }

    lastIndex = regex.lastIndex;
  }

  // Add remaining text if any
  if (lastIndex < text.length) {
    parts.push({
      type: 'text',
      content: text.slice(lastIndex),
    });
  }

  return (
    <div className="w-full break-words whitespace-pre-wrap text-base leading-relaxed px-2">
      {parts.map((part, idx) => {
        if (part.type === 'text') {
          return <span key={idx}>{part.content}</span>;
        } else if (part.type === 'mathfield') {
          return (
            <math-field
              key={idx}
              read-only
              style={{
                display: 'inline-block',
                fontSize: '1.05rem',
              }}
            >
              {part.content}
            </math-field>
          );
        } else if (part.type === 'img') {
          return (
            <img
              key={idx}
              src={part.src}
              alt="inline-img"
              style={{
                width: `${part.width}px`,
                height: `${part.height}px`,
                display: 'inline-block',
                verticalAlign: 'middle',
                margin: '4px',
              }}
            />
          );
        }
        return null;
      })}
    </div>
  );
}
