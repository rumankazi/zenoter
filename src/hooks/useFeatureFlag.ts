/**
 * React hook for accessing feature flags
 *
 * Provides a simple, type-safe way to check feature flags in components.
 *
 * @example
 * ```typescript
 * const CloudSyncButton = () => {
 *   const isEnabled = useFeatureFlag('CLOUD_SYNC');
 *
 *   if (!isEnabled) return null;
 *
 *   return <Button onClick={syncToCloud}>Sync</Button>;
 * };
 * ```
 */

import { FeatureFlagService } from '../services/featureFlag.service';
import type { FeatureFlagKey } from '../config/featureFlags';

/**
 * Hook to check if a feature flag is enabled
 *
 * @param flag - The feature flag key to check
 * @returns true if the feature is enabled, false otherwise
 */
export function useFeatureFlag(flag: FeatureFlagKey): boolean {
  const service = FeatureFlagService.getInstance();
  return service.isEnabled(flag);
}

/**
 * Hook to get all enabled feature flags
 *
 * @returns Array of enabled feature flag keys
 *
 * @example
 * ```typescript
 * const FeatureList = () => {
 *   const enabledFeatures = useEnabledFeatures();
 *
 *   return (
 *     <ul>
 *       {enabledFeatures.map(feature => (
 *         <li key={feature}>{feature}</li>
 *       ))}
 *     </ul>
 *   );
 * };
 * ```
 */
export function useEnabledFeatures(): FeatureFlagKey[] {
  const service = FeatureFlagService.getInstance();
  return service.getEnabledFlags();
}
