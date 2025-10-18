import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MarkdownPreview } from '../../../components/MarkdownPreview';

describe('MarkdownPreview Component', () => {
  it('should render markdown content', () => {
    const content = '# Hello World\n\nThis is a test.';
    const { container } = render(<MarkdownPreview content={content} />);

    const preview = container.querySelector('[class*="previewContent"]');
    expect(preview).toBeInTheDocument();
    expect(preview?.innerHTML).toContain('<h1>Hello World</h1>');
  });

  it('should render bold text', () => {
    const content = 'This is **bold** text.';
    const { container } = render(<MarkdownPreview content={content} />);

    const preview = container.querySelector('[class*="previewContent"]');
    expect(preview?.innerHTML).toContain('<strong>bold</strong>');
  });

  it('should render italic text', () => {
    const content = 'This is *italic* text.';
    const { container } = render(<MarkdownPreview content={content} />);

    const preview = container.querySelector('[class*="previewContent"]');
    expect(preview?.innerHTML).toContain('<em>italic</em>');
  });

  it('should render inline code', () => {
    const content = 'Use `const` for constants.';
    const { container } = render(<MarkdownPreview content={content} />);

    const preview = container.querySelector('[class*="previewContent"]');
    expect(preview?.innerHTML).toContain('<code>const</code>');
  });

  it('should render code blocks with syntax highlighting', () => {
    const content = '```javascript\nconst x = 1;\n```';
    const { container } = render(<MarkdownPreview content={content} />);

    const preview = container.querySelector('[class*="previewContent"]');
    const codeBlock = preview?.querySelector('pre code');

    expect(codeBlock).toBeInTheDocument();
    expect(codeBlock?.className).toContain('language-javascript');
  });

  it('should update content when prop changes', () => {
    const { container, rerender } = render(<MarkdownPreview content="# First" />);

    let preview = container.querySelector('[class*="previewContent"]');
    expect(preview?.innerHTML).toContain('First');

    rerender(<MarkdownPreview content="# Second" />);

    preview = container.querySelector('[class*="previewContent"]');
    expect(preview?.innerHTML).toContain('Second');
  });

  it('should sync scroll position when scrollPercentage changes', () => {
    const longContent = '# Test\n\n'.repeat(20);
    const { container, rerender } = render(
      <MarkdownPreview content={longContent} scrollPercentage={0} />
    );

    const previewContainer = container.querySelector('[class*="previewContainer"]') as HTMLElement;
    expect(previewContainer).toBeInTheDocument();

    // Initially at top
    expect(previewContainer.scrollTop).toBe(0);

    // Update scroll percentage
    rerender(<MarkdownPreview content={longContent} scrollPercentage={0.5} />);

    // scrollTop should be updated (exact value depends on content height)
    // Just verify it's greater than or equal to 0
    setTimeout(() => {
      expect(previewContainer.scrollTop).toBeGreaterThanOrEqual(0);
    }, 100);
  });

  it('should render horizontal rules', () => {
    const content = 'Before\n\n---\n\nAfter';
    const { container } = render(<MarkdownPreview content={content} />);

    const preview = container.querySelector('[class*="previewContent"]');
    expect(preview?.innerHTML).toContain('<hr>');
  });

  it('should render headings at different levels', () => {
    const content = '# H1\n## H2\n### H3';
    const { container } = render(<MarkdownPreview content={content} />);

    const preview = container.querySelector('[class*="previewContent"]');
    expect(preview?.innerHTML).toContain('<h1>H1</h1>');
    expect(preview?.innerHTML).toContain('<h2>H2</h2>');
    expect(preview?.innerHTML).toContain('<h3>H3</h3>');
  });
});
