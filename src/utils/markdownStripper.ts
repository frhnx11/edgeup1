// Utility function to strip markdown formatting from text
export function stripMarkdown(text: string): string {
  if (!text) return '';
  
  // Remove bold formatting (**text** or __text__)
  let stripped = text.replace(/\*\*([^*]+)\*\*/g, '$1');
  stripped = stripped.replace(/__([^_]+)__/g, '$1');
  
  // Remove italic formatting (*text* or _text_)
  stripped = stripped.replace(/\*([^*]+)\*/g, '$1');
  stripped = stripped.replace(/_([^_]+)_/g, '$1');
  
  // Remove heading markers (# ## ### etc.)
  stripped = stripped.replace(/^#{1,6}\s+/gm, '');
  
  // Remove code blocks (```code```)
  stripped = stripped.replace(/```[^`]*```/g, (match) => {
    const code = match.replace(/```\w*\n?/g, '').replace(/```/g, '');
    return code;
  });
  
  // Remove inline code (`code`)
  stripped = stripped.replace(/`([^`]+)`/g, '$1');
  
  // Remove links [text](url)
  stripped = stripped.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // Remove images ![alt](url)
  stripped = stripped.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1');
  
  // Remove horizontal rules (---, ***, ___)
  stripped = stripped.replace(/^(\*{3,}|-{3,}|_{3,})$/gm, '');
  
  // Remove blockquotes (> text)
  stripped = stripped.replace(/^>\s+/gm, '');
  
  // Remove unordered list markers (*, -, +)
  stripped = stripped.replace(/^[\*\-\+]\s+/gm, '• ');
  
  // Remove ordered list markers (1. 2. etc.)
  stripped = stripped.replace(/^\d+\.\s+/gm, '');
  
  // Remove extra whitespace and empty lines
  stripped = stripped.replace(/\n{3,}/g, '\n\n');
  stripped = stripped.trim();
  
  return stripped;
}

// Function to format text for better display
export function formatDisplayText(text: string): string {
  const stripped = stripMarkdown(text);
  
  // Add proper spacing after bullet points
  let formatted = stripped.replace(/•\s+/g, '• ');
  
  // Ensure proper paragraph spacing
  formatted = formatted.replace(/\n\n/g, '\n\n');
  
  return formatted;
}