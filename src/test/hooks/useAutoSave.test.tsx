/**
 * Tests for useAutoSave Hook
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAutoSave } from '../../hooks/useAutoSave';

describe('useAutoSave Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should not call onSave initially', () => {
    const onSave = vi.fn();
    renderHook(() => useAutoSave({ value: 'test', onSave, delay: 500 }));

    expect(onSave).not.toHaveBeenCalled();
  });

  it('should call onSave after delay when value changes', async () => {
    const onSave = vi.fn();
    const { rerender } = renderHook(
      ({ value }) => useAutoSave({ value, onSave, delay: 500, enabled: true }),
      { initialProps: { value: 'initial' } }
    );

    // Change value
    rerender({ value: 'updated' });

    // Fast-forward time
    await vi.advanceTimersByTimeAsync(500);

    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('should debounce multiple rapid changes', async () => {
    const onSave = vi.fn();
    const { rerender } = renderHook(
      ({ value }) => useAutoSave({ value, onSave, delay: 500, enabled: true }),
      { initialProps: { value: 'initial' } }
    );

    // Rapid changes
    rerender({ value: 'change1' });
    await vi.advanceTimersByTimeAsync(200);

    rerender({ value: 'change2' });
    await vi.advanceTimersByTimeAsync(200);

    rerender({ value: 'change3' });
    await vi.advanceTimersByTimeAsync(500);

    expect(onSave).toHaveBeenCalledTimes(1); // Only called once after final change
  });

  it('should not call onSave when disabled', () => {
    const onSave = vi.fn();
    const { rerender } = renderHook(
      ({ value }) => useAutoSave({ value, onSave, delay: 500, enabled: false }),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });
    vi.advanceTimersByTime(1000);

    expect(onSave).not.toHaveBeenCalled();
  });

  it('should not call onSave when value does not change', () => {
    const onSave = vi.fn();
    renderHook(() => useAutoSave({ value: 'same', onSave, delay: 500, enabled: true }));

    vi.advanceTimersByTime(1000);

    expect(onSave).not.toHaveBeenCalled();
  });

  it('should cancel pending save on unmount', async () => {
    const onSave = vi.fn();
    const { rerender, unmount } = renderHook(
      ({ value }) => useAutoSave({ value, onSave, delay: 500, enabled: true }),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });
    await vi.advanceTimersByTimeAsync(200);

    unmount();
    await vi.advanceTimersByTimeAsync(500);

    expect(onSave).not.toHaveBeenCalled();
  });

  it('should use custom delay', async () => {
    const onSave = vi.fn();
    const { rerender } = renderHook(
      ({ value }) => useAutoSave({ value, onSave, delay: 1000, enabled: true }),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });

    // Should not trigger before delay
    await vi.advanceTimersByTimeAsync(999);
    expect(onSave).not.toHaveBeenCalled();

    // Should trigger after delay
    await vi.advanceTimersByTimeAsync(1);
    expect(onSave).toHaveBeenCalledTimes(1);
  });
});
