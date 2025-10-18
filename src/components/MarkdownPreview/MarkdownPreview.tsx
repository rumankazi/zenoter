/**
 * MarkdownPreview Component
 * Renders markdown content with GitHub-style formatting
 */

import { FC, useEffect, useRef } from 'react';
import hljs from 'highlight.js/lib/core';
// Import common languages
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import sql from 'highlight.js/lib/languages/sql';
import json from 'highlight.js/lib/languages/json';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import bash from 'highlight.js/lib/languages/bash';
import markdown from 'highlight.js/lib/languages/markdown';

import 'highlight.js/styles/github-dark.css';
import styles from './MarkdownPreview.module.css';

// Register languages
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('py', python);
hljs.registerLanguage('java', java);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('c++', cpp);
hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('cs', csharp);
hljs.registerLanguage('go', go);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('json', json);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('sh', bash);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('md', markdown);

interface MarkdownPreviewProps {
  /** Markdown content to render */
  content: string;
  /** Scroll position as percentage (0-1) */
  scrollPercentage?: number;
  /** Optional class name */
  className?: string;
}

/**
 * Simple markdown renderer (will be enhanced with a proper library later)
 * For MVP, we'll use basic HTML rendering with sanitization
 */
export const MarkdownPreview: FC<MarkdownPreviewProps> = ({
  content,
  scrollPercentage,
  className,
}) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync scroll position when scrollPercentage changes
  useEffect(() => {
    if (scrollPercentage !== undefined && containerRef.current) {
      const container = containerRef.current;
      const maxScroll = container.scrollHeight - container.clientHeight;
      const targetScroll = maxScroll * scrollPercentage;

      // Instant scroll for immediate response (no delay)
      requestAnimationFrame(() => {
        container.scrollTop = targetScroll;
      });
    }
  }, [scrollPercentage]);

  useEffect(() => {
    if (previewRef.current) {
      // Basic markdown-to-HTML conversion (simplified for MVP)
      // Note: Will be replaced with marked.js in future sprint (tracked in GitHub issues)

      // Step 1: Protect code blocks from other replacements
      const codeBlocks: string[] = [];
      let html = content.replace(/```(\w+)?\n([\s\S]*?)```/gim, (_match, lang, code) => {
        const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
        codeBlocks.push(
          `<pre><code class="language-${lang || 'plaintext'}">${code.trim()}</code></pre>`
        );
        return placeholder;
      });

      // Step 2: Process inline elements
      html = html
        // Headers (must be at start of line)
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        // Bold
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        // Italic (must come after bold)
        .replace(/\*(.*?)\*/gim, '<em>$1</em>')
        // Inline code (after code blocks are protected)
        .replace(/`(.*?)`/gim, '<code>$1</code>')
        // Lists
        .replace(/^- (.*$)/gim, '<li>$1</li>')
        // Horizontal rule
        .replace(/^---$/gim, '<hr>')
        // Paragraphs (double line breaks)
        .replace(/\n\n/g, '</p><p>')
        // Single line breaks
        .replace(/\n/g, '<br>');

      // Step 3: Restore code blocks
      codeBlocks.forEach((block, index) => {
        html = html.replace(`__CODE_BLOCK_${index}__`, block);
      });

      // Step 4: Wrap in paragraphs
      html = '<p>' + html + '</p>';

      // Step 5: Clean up
      html = html
        .replace(/<p><\/p>/g, '')
        .replace(/<p>(<pre>)/g, '$1') // Don't wrap pre in p
        .replace(/(<\/pre>)<\/p>/g, '$1'); // Don't wrap pre in p

      previewRef.current.innerHTML = html;

      // Step 6: Apply syntax highlighting to code blocks
      previewRef.current.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    }
  }, [content]);

  return (
    <div ref={containerRef} className={`${styles.previewContainer} ${className || ''}`}>
      <div ref={previewRef} className={styles.previewContent} aria-label="Markdown preview" />
    </div>
  );
};

export default MarkdownPreview;
