import React, { useRef } from 'react';
import { Bold, Italic, List, ListOrdered, Link2, Image, Code } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = '', 
  className = '' 
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    handleInput();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      formatText('insertImage', url);
    }
  };

  const insertCode = () => {
    const code = prompt('Enter code:');
    if (code) {
      const codeElement = `<code>${code}</code>`;
      document.execCommand('insertHTML', false, codeElement);
      handleInput();
    }
  };

  return (
    <div className={`border border-gray-300 rounded-md ${className}`}>
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50">
        <button
          type="button"
          onClick={() => formatText('bold')}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => formatText('italic')}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => formatText('insertUnorderedList')}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => formatText('insertOrderedList')}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => {
            const url = prompt('Enter URL:');
            if (url) {
              formatText('createLink', url);
            }
          }}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Insert Link"
        >
          <Link2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={insertImage}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Insert Image"
        >
          <Image className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={insertCode}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Insert Code"
        >
          <Code className="w-4 h-4" />
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[150px] p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
        onInput={handleInput}
        onPaste={handlePaste}
        dangerouslySetInnerHTML={{ __html: value || '' }}
        data-placeholder={placeholder}
        style={{
          minHeight: '150px'
        }}
      />
      <style>{`
        [data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          display: block;
        }
      `}</style>
    </div>
  );
};