import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FeatureFlagService } from '../../services/featureFlag.service';
import * as featureFlagsModule from '../../config/featureFlags';

describe('FeatureFlagService', () => {
  let service: FeatureFlagService;

  beforeEach(() => {
    service = FeatureFlagService.getInstance();
  });

  describe('getInstance', () => {
    it('should return a singleton instance', () => {
      const instance1 = FeatureFlagService.getInstance();
      const instance2 = FeatureFlagService.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('should return the same instance across multiple calls', () => {
      const instances = Array.from({ length: 5 }, () => FeatureFlagService.getInstance());
      const firstInstance = instances[0];
      instances.forEach((instance) => {
        expect(instance).toBe(firstInstance);
      });
    });
  });

  describe('isEnabled', () => {
    it('should return true for enabled Phase 1 features', () => {
      expect(service.isEnabled('LOCAL_STORAGE')).toBe(true);
      expect(service.isEnabled('BASIC_EDITOR')).toBe(true);
      expect(service.isEnabled('FILE_TREE')).toBe(true);
      expect(service.isEnabled('MARKDOWN_PREVIEW')).toBe(true);
      expect(service.isEnabled('DARK_MODE')).toBe(true);
    });

    it('should return false for disabled Phase 2+ features', () => {
      expect(service.isEnabled('CLOUD_SYNC')).toBe(false);
      expect(service.isEnabled('AUTH_SYSTEM')).toBe(false);
      expect(service.isEnabled('VERSION_CONTROL')).toBe(false);
    });

    it('should read from FEATURE_FLAGS configuration', () => {
      const spy = vi.spyOn(featureFlagsModule, 'FEATURE_FLAGS', 'get');
      service.isEnabled('DARK_MODE');
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('getAllFlags', () => {
    it('should return all feature flags', () => {
      const flags = service.getAllFlags();
      expect(flags).toBeDefined();
      expect(Object.keys(flags).length).toBeGreaterThan(0);
    });

    it('should return a copy, not the original object', () => {
      const flags = service.getAllFlags();
      expect(flags).not.toBe(featureFlagsModule.FEATURE_FLAGS);
      expect(flags).toEqual(featureFlagsModule.FEATURE_FLAGS);
    });
  });

  describe('getEnabledFlags', () => {
    it('should return only enabled flags', () => {
      const enabledFlags = service.getEnabledFlags();
      expect(Array.isArray(enabledFlags)).toBe(true);
      enabledFlags.forEach((flag: featureFlagsModule.FeatureFlagKey) => {
        expect(service.isEnabled(flag)).toBe(true);
      });
    });

    it('should include all Phase 1 flags', () => {
      const enabledFlags = service.getEnabledFlags();
      expect(enabledFlags).toContain('LOCAL_STORAGE');
      expect(enabledFlags).toContain('BASIC_EDITOR');
      expect(enabledFlags).toContain('FILE_TREE');
      expect(enabledFlags).toContain('MARKDOWN_PREVIEW');
      expect(enabledFlags).toContain('DARK_MODE');
    });

    it('should not include disabled Phase 2+ flags', () => {
      const enabledFlags = service.getEnabledFlags();
      expect(enabledFlags).not.toContain('CLOUD_SYNC');
      expect(enabledFlags).not.toContain('AUTH_SYSTEM');
      expect(enabledFlags).not.toContain('VERSION_CONTROL');
    });
  });
});
