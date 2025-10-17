/**
 * Feature Flag Service
 *
 * Centralized service for checking feature flag status.
 * Implements singleton pattern for consistent state management.
 *
 * Future enhancements:
 * - Remote config integration (Firebase Remote Config)
 * - A/B testing support
 * - User group targeting
 * - Analytics integration
 */

import { FEATURE_FLAGS, type FeatureFlagKey } from '../config/featureFlags';

export class FeatureFlagService {
  private static instance: FeatureFlagService;

  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor() {}

  /**
   * Get singleton instance of FeatureFlagService
   */
  public static getInstance(): FeatureFlagService {
    if (!FeatureFlagService.instance) {
      FeatureFlagService.instance = new FeatureFlagService();
    }
    return FeatureFlagService.instance;
  }

  /**
   * Check if a feature flag is enabled
   *
   * @param flag - The feature flag key to check
   * @returns true if the feature is enabled, false otherwise
   *
   * @example
   * ```typescript
   * const service = FeatureFlagService.getInstance();
   * if (service.isEnabled('CLOUD_SYNC')) {
   *   await syncToCloud();
   * }
   * ```
   */
  public isEnabled(flag: FeatureFlagKey): boolean {
    // Phase 1: Simple boolean check from config
    // Phase 2+: Can be extended to check:
    // - Remote config values
    // - User permissions
    // - A/B test groups
    // - Environment overrides
    return FEATURE_FLAGS[flag];
  }

  /**
   * Get all feature flags with their current values
   *
   * @returns Copy of all feature flags
   */
  public getAllFlags(): Readonly<typeof FEATURE_FLAGS> {
    return { ...FEATURE_FLAGS };
  }

  /**
   * Get list of enabled feature flag keys
   *
   * @returns Array of enabled feature flag keys
   */
  public getEnabledFlags(): FeatureFlagKey[] {
    return (Object.keys(FEATURE_FLAGS) as FeatureFlagKey[]).filter((key) => this.isEnabled(key));
  }

  /**
   * Get list of disabled feature flag keys
   *
   * @returns Array of disabled feature flag keys
   */
  public getDisabledFlags(): FeatureFlagKey[] {
    return (Object.keys(FEATURE_FLAGS) as FeatureFlagKey[]).filter((key) => !this.isEnabled(key));
  }

  // Future methods for Phase 2+:
  // public getRolloutPercentage(flag: FeatureFlagKey): number { ... }
  // public isEnabledForUser(flag: FeatureFlagKey, userId: string): boolean { ... }
  // public isEnabledForGroup(flag: FeatureFlagKey, group: string): boolean { ... }
}
