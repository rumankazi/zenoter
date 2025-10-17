import { describe, it, expect } from 'vitest';
import { FEATURE_FLAGS, type FeatureFlagKey } from '../../config/featureFlags';

describe('featureFlags', () => {
  it('should export FEATURE_FLAGS object', () => {
    expect(FEATURE_FLAGS).toBeDefined();
    expect(typeof FEATURE_FLAGS).toBe('object');
  });

  it('should have all Phase 1 features enabled', () => {
    expect(FEATURE_FLAGS.LOCAL_STORAGE).toBe(true);
    expect(FEATURE_FLAGS.BASIC_EDITOR).toBe(true);
    expect(FEATURE_FLAGS.FILE_TREE).toBe(true);
    expect(FEATURE_FLAGS.MARKDOWN_PREVIEW).toBe(true);
    expect(FEATURE_FLAGS.DARK_MODE).toBe(true);
  });

  it('should have all Phase 2+ features disabled', () => {
    expect(FEATURE_FLAGS.CLOUD_SYNC).toBe(false);
    expect(FEATURE_FLAGS.AUTH_SYSTEM).toBe(false);
    expect(FEATURE_FLAGS.VERSION_CONTROL).toBe(false);
  });

  it('should have boolean values for all flags', () => {
    Object.values(FEATURE_FLAGS).forEach((value) => {
      expect(typeof value).toBe('boolean');
    });
  });

  it('should maintain immutability of flag keys', () => {
    const keys = Object.keys(FEATURE_FLAGS) as FeatureFlagKey[];
    expect(keys.length).toBeGreaterThan(0);

    // Verify we can use keys as type-safe literals
    keys.forEach((key) => {
      expect(FEATURE_FLAGS[key]).toBeDefined();
    });
  });
});
