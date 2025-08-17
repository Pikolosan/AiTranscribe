import { useState, useEffect } from "react";
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Undo, 
  Redo 
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Convert markdown-style text to HTML
function convertMarkdownToHtml(text: string): string {
  let html = text;
  
  // Convert headers
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  
  // Convert bold text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Convert italic text
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Convert bullet points (handle both - and * as bullets)
  html = html.replace(/^[-*]\s+(.*)$/gm, '<li>$1</li>');
  
  // Convert numbered lists
  html = html.replace(/^\d+\.\s+(.*)$/gm, '<li>$1</li>');
  
  // Wrap consecutive <li> elements in <ul> or <ol>
  html = html.replace(/(<li>.*<\/li>)/g, (match) => {
    // Check if it looks like a numbered list by looking at the original text
    if (text.includes('1.') || text.includes('2.')) {
      return '<ol>' + match + '</ol>';
    }
    return '<ul>' + match + '</ul>';
  });
  
  // Convert line breaks to proper paragraphs
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br>');
  
  // Wrap in paragraph tags if not already wrapped
  if (!html.includes('<p>') && !html.includes('<h1>') && !html.includes('<h2>') && !html.includes('<h3>')) {
    html = '<p>' + html + '</p>';
  }
  
  // Clean up any double paragraph tags
  html = html.replace(/<\/p><p><\/p><p>/g, '</p><p>');
  
  return html;
}

interface RichTextEditorProps {
  initialContent: string;
  onUpdate: (content: string) => void;
  isUpdating?: boolean;
}

export function RichTextEditor({ initialContent, onUpdate, isUpdating = false }: RichTextEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [wordCount, setWordCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    // Check if content looks like markdown (contains bullets, headers, etc.)
    const looksLikeMarkdown = initialContent.includes('# ') || 
                             initialContent.includes('## ') || 
                             initialContent.includes('### ') || 
                             initialContent.includes('- ') || 
                             initialContent.includes('* ') ||
                             /^\d+\.\s/.test(initialContent);
    
    if (looksLikeMarkdown && !initialContent.includes('<')) {
      // Convert markdown to HTML
      const htmlContent = convertMarkdownToHtml(initialContent);
      setContent(htmlContent);
      updateWordCount(htmlContent);
    } else {
      setContent(initialContent);
      updateWordCount(initialContent);
    }
  }, [initialContent]);

  const updateWordCount = (text: string) => {
    // Remove HTML tags and count words
    const plainText = text.replace(/<[^>]*>/g, '');
    const words = plainText.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  };

  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.innerHTML;
    setContent(newContent);
    updateWordCount(newContent);
    setLastUpdated(new Date());
    
    // Debounce updates to avoid too many API calls
    clearTimeout((window as any).updateTimeout);
    (window as any).updateTimeout = setTimeout(() => {
      onUpdate(newContent);
    }, 1000);
  };

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  const formatDuration = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "just now";
    if (diffMins === 1) return "1 minute ago";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return "1 hour ago";
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div data-testid="rich-text-editor">
      {/* Toolbar */}
      <div className="border-b border-gray-200 pb-3 mb-4">
        <div className="flex items-center space-x-1">
          <Button
            data-testid="toolbar-bold"
            variant="ghost"
            size="sm"
            onClick={() => formatText('bold')}
            className="p-2 text-gray-400 hover:text-gray-600"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            data-testid="toolbar-italic"
            variant="ghost"
            size="sm"
            onClick={() => formatText('italic')}
            className="p-2 text-gray-400 hover:text-gray-600"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            data-testid="toolbar-underline"
            variant="ghost"
            size="sm"
            onClick={() => formatText('underline')}
            className="p-2 text-gray-400 hover:text-gray-600"
            title="Underline"
          >
            <Underline className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          <Button
            data-testid="toolbar-bullet-list"
            variant="ghost"
            size="sm"
            onClick={() => formatText('insertUnorderedList')}
            className="p-2 text-gray-400 hover:text-gray-600"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            data-testid="toolbar-numbered-list"
            variant="ghost"
            size="sm"
            onClick={() => formatText('insertOrderedList')}
            className="p-2 text-gray-400 hover:text-gray-600"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          <Button
            data-testid="toolbar-undo"
            variant="ghost"
            size="sm"
            onClick={() => formatText('undo')}
            className="p-2 text-gray-400 hover:text-gray-600"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            data-testid="toolbar-redo"
            variant="ghost"
            size="sm"
            onClick={() => formatText('redo')}
            className="p-2 text-gray-400 hover:text-gray-600"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div
        data-testid="editor-content"
        className="prose max-w-none focus:outline-none min-h-[300px] p-4 border border-gray-200 rounded-lg"
        contentEditable={true}
        onInput={handleContentChange}
        dangerouslySetInnerHTML={{ __html: content }}
        suppressContentEditableWarning={true}
      />

      {/* Word Count and Status */}
      <div className="mt-3 text-right flex justify-between items-center">
        <div>
          {isUpdating && (
            <span className="text-xs text-blue-600 flex items-center">
              <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600 mr-2"></div>
              Saving...
            </span>
          )}
        </div>
        <span data-testid="editor-word-count" className="text-xs text-gray-500">
          {wordCount} words • Last edited {formatDuration(lastUpdated)}
        </span>
      </div>
    </div>
  );
}
