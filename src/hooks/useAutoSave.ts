/**
 * useAutoSave Hook
 * Debounced auto-save functionality
 */

import { useEffect, useRef } from 'react';

interface UseAutoSaveOptions {
  value: string;
  onSave: () => void | Promise<void>;
  delay?: number;
  enabled?: boolean;
}

export const useAutoSave = ({ value, onSave, delay = 500, enabled = true }: UseAutoSaveOptions) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousValueRef = useRef<string>(value);

  useEffect(() => {
    // Don't auto-save if disabled or value hasn't changed
    if (!enabled || value === previousValueRef.current) {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(() => {
      onSave();
      previousValueRef.current = value;
    }, delay);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, onSave, delay, enabled]);

  // Update previous value ref when value changes externally (e.g., note selection)
  useEffect(() => {
    previousValueRef.current = value;
  }, [value]);
};
