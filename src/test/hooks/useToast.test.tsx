/**
 * Tests for useToast Hook
 */

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast } from '../../hooks/useToast';

describe('useToast Hook', () => {
  it('should initialize with empty toasts array', () => {
    const { result } = renderHook(() => useToast());

    expect(result.current.toasts).toEqual([]);
  });

  it('should show a toast with showToast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('Test message', 'info');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]).toMatchObject({
      message: 'Test message',
      type: 'info',
    });
    expect(result.current.toasts[0].id).toBeDefined();
  });

  it('should show success toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success('Success message');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe('success');
    expect(result.current.toasts[0].message).toBe('Success message');
  });

  it('should show error toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.error('Error message');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe('error');
    expect(result.current.toasts[0].message).toBe('Error message');
  });

  it('should show info toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.info('Info message');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe('info');
    expect(result.current.toasts[0].message).toBe('Info message');
  });

  it('should hide toast by id', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success('Toast 1');
      result.current.error('Toast 2');
    });

    expect(result.current.toasts).toHaveLength(2);
    const firstToastId = result.current.toasts[0].id;

    act(() => {
      result.current.hideToast(firstToastId);
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe('Toast 2');
  });

  it('should handle multiple toasts', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success('Toast 1');
      result.current.error('Toast 2');
      result.current.info('Toast 3');
    });

    expect(result.current.toasts).toHaveLength(3);
    expect(result.current.toasts.map((t: { type: string }) => t.type)).toEqual([
      'success',
      'error',
      'info',
    ]);
  });

  it('should generate unique IDs for each toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success('Toast 1');
      result.current.success('Toast 2');
      result.current.success('Toast 3');
    });

    const ids = result.current.toasts.map((t: { id: number }) => t.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(3); // All IDs should be unique
  });
});
