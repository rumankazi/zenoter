import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFeatureFlag } from '../../hooks/useFeatureFlag';
import { FeatureFlagService } from '../../services/featureFlag.service';

// Mock the service
vi.mock('../../services/featureFlag.service', () => ({
  FeatureFlagService: {
    getInstance: vi.fn(),
  },
}));

describe('useFeatureFlag', () => {
  let mockService: {
    isEnabled: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockService = {
      isEnabled: vi.fn(),
    };
    vi.mocked(FeatureFlagService.getInstance).mockReturnValue(
      mockService as unknown as FeatureFlagService
    );
  });

  it('should return true when feature is enabled', () => {
    mockService.isEnabled.mockReturnValue(true);

    const { result } = renderHook(() => useFeatureFlag('DARK_MODE'));

    expect(result.current).toBe(true);
    expect(mockService.isEnabled).toHaveBeenCalledWith('DARK_MODE');
  });

  it('should return false when feature is disabled', () => {
    mockService.isEnabled.mockReturnValue(false);

    const { result } = renderHook(() => useFeatureFlag('CLOUD_SYNC'));

    expect(result.current).toBe(false);
    expect(mockService.isEnabled).toHaveBeenCalledWith('CLOUD_SYNC');
  });

  it('should call FeatureFlagService.getInstance', () => {
    mockService.isEnabled.mockReturnValue(true);

    renderHook(() => useFeatureFlag('FILE_TREE'));

    expect(FeatureFlagService.getInstance).toHaveBeenCalled();
  });

  it('should work with all feature flag keys', () => {
    mockService.isEnabled.mockReturnValue(true);

    const flags = [
      'LOCAL_STORAGE',
      'BASIC_EDITOR',
      'FILE_TREE',
      'MARKDOWN_PREVIEW',
      'DARK_MODE',
      'CLOUD_SYNC',
      'AUTH_SYSTEM',
      'VERSION_CONTROL',
    ] as const;

    flags.forEach((flag) => {
      const { result } = renderHook(() => useFeatureFlag(flag));
      expect(result.current).toBe(true);
      expect(mockService.isEnabled).toHaveBeenCalledWith(flag);
    });
  });

  it('should re-render when called multiple times', () => {
    mockService.isEnabled.mockReturnValue(true);

    const { result, rerender } = renderHook(() => useFeatureFlag('DARK_MODE'));

    expect(result.current).toBe(true);

    mockService.isEnabled.mockReturnValue(false);
    rerender();

    expect(result.current).toBe(false);
  });
});
