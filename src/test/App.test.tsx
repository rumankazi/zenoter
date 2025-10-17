import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from '../App';

describe('App Component', () => {
  it('should render the application layout', () => {
    render(<App />);

    // Check if main structure is present
    expect(screen.getByRole('complementary')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should display the app title', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /Zenoter - Phase 1 MVP/i })).toBeInTheDocument();
  });

  it('should display the app description', () => {
    render(<App />);

    expect(screen.getByText(/Modern note-taking app for developers/i)).toBeInTheDocument();
  });

  it('should render FileTree component', () => {
    render(<App />);

    // FileTree renders with role="tree"
    expect(screen.getByRole('tree')).toBeInTheDocument();
  });
});
