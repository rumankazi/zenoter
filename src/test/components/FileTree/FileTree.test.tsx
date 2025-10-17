import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FileTree } from '../../../components/FileTree/FileTree';

describe('FileTree Component', () => {
  it('should render the file tree container', () => {
    render(<FileTree />);
    expect(screen.getByRole('tree')).toBeInTheDocument();
  });

  it('should display root folder', () => {
    render(<FileTree />);
    expect(screen.getByText('Notes')).toBeInTheDocument();
  });
});
