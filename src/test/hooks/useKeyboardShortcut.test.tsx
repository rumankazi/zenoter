/**
 * Tests for useKeyboardShortcut Hook
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut';

describe('useKeyboardShortcut Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call handler when matching key is pressed', () => {
    const handler = vi.fn();

    renderHook(() =>
      useKeyboardShortcut({
        key: 's',
        ctrlKey: true,
        handler,
        enabled: true,
      })
    );

    // Simulate Ctrl+S
    const event = new KeyboardEvent('keydown', { key: 's', ctrlKey: true });
    window.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should not call handler when wrong key is pressed', () => {
    const handler = vi.fn();

    renderHook(() =>
      useKeyboardShortcut({
        key: 's',
        ctrlKey: true,
        handler,
        enabled: true,
      })
    );

    // Simulate Ctrl+A (wrong key)
    const event = new KeyboardEvent('keydown', { key: 'a', ctrlKey: true });
    window.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
  });

  it('should not call handler when modifiers do not match', () => {
    const handler = vi.fn();

    renderHook(() =>
      useKeyboardShortcut({
        key: 's',
        ctrlKey: true,
        handler,
        enabled: true,
      })
    );

    // Simulate S without Ctrl
    const event = new KeyboardEvent('keydown', { key: 's', ctrlKey: false });
    window.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
  });

  it('should not call handler when disabled', () => {
    const handler = vi.fn();

    renderHook(() =>
      useKeyboardShortcut({
        key: 's',
        ctrlKey: true,
        handler,
        enabled: false,
      })
    );

    // Simulate Ctrl+S
    const event = new KeyboardEvent('keydown', { key: 's', ctrlKey: true });
    window.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
  });

  it('should handle Shift modifier', () => {
    const handler = vi.fn();

    renderHook(() =>
      useKeyboardShortcut({
        key: 'F',
        ctrlKey: true,
        shiftKey: true,
        handler,
        enabled: true,
      })
    );

    // Simulate Ctrl+Shift+F
    const event = new KeyboardEvent('keydown', {
      key: 'F',
      ctrlKey: true,
      shiftKey: true,
    });
    window.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should handle Alt modifier', () => {
    const handler = vi.fn();

    renderHook(() =>
      useKeyboardShortcut({
        key: 'a',
        altKey: true,
        handler,
        enabled: true,
      })
    );

    // Simulate Alt+A
    const event = new KeyboardEvent('keydown', { key: 'a', altKey: true });
    window.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should handle Meta (Cmd/Win) modifier', () => {
    const handler = vi.fn();

    renderHook(() =>
      useKeyboardShortcut({
        key: 'k',
        metaKey: true,
        handler,
        enabled: true,
      })
    );

    // Simulate Cmd/Win+K
    const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
    window.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should be case-insensitive for keys', () => {
    const handler = vi.fn();

    renderHook(() =>
      useKeyboardShortcut({
        key: 'S',
        ctrlKey: true,
        handler,
        enabled: true,
      })
    );

    // Simulate lowercase s
    const event = new KeyboardEvent('keydown', { key: 's', ctrlKey: true });
    window.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should prevent default when handler is called', () => {
    const handler = vi.fn();

    renderHook(() =>
      useKeyboardShortcut({
        key: 's',
        ctrlKey: true,
        handler,
        enabled: true,
      })
    );

    const event = new KeyboardEvent('keydown', {
      key: 's',
      ctrlKey: true,
      cancelable: true,
    });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    window.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(handler).toHaveBeenCalledWith(event);
  });

  it('should cleanup event listener on unmount', () => {
    const handler = vi.fn();
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() =>
      useKeyboardShortcut({
        key: 's',
        ctrlKey: true,
        handler,
        enabled: true,
      })
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('should handle multiple modifiers together', () => {
    const handler = vi.fn();

    renderHook(() =>
      useKeyboardShortcut({
        key: 'p',
        ctrlKey: true,
        shiftKey: true,
        altKey: true,
        handler,
        enabled: true,
      })
    );

    // Simulate Ctrl+Shift+Alt+P
    const event = new KeyboardEvent('keydown', {
      key: 'p',
      ctrlKey: true,
      shiftKey: true,
      altKey: true,
    });
    window.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should not trigger if one required modifier is missing', () => {
    const handler = vi.fn();

    renderHook(() =>
      useKeyboardShortcut({
        key: 'p',
        ctrlKey: true,
        shiftKey: true,
        handler,
        enabled: true,
      })
    );

    // Missing Shift
    const event = new KeyboardEvent('keydown', { key: 'p', ctrlKey: true });
    window.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
  });
});
