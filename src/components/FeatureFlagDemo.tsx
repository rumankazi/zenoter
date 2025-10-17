/**
 * Feature Flag Demo Component
 *
 * Demonstrates how to use feature flags in React components.
 * This component shows enabled/disabled features and can be removed
 * in production or kept as a developer tools panel.
 */

import { motion } from 'framer-motion';
import { useFeatureFlag, useEnabledFeatures } from '../hooks/useFeatureFlag';
import { FeatureFlagService } from '../services/featureFlag.service';
import styles from './FeatureFlagDemo.module.css';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { type: 'spring' as const, stiffness: 300 },
};
export const FeatureFlagDemo = () => {
  const service = FeatureFlagService.getInstance();
  const enabledFeatures = useEnabledFeatures();
  const disabledFeatures = service.getDisabledFlags();

  // Example: Conditional rendering based on feature flag
  const hasCloudSync = useFeatureFlag('CLOUD_SYNC');
  const hasDarkMode = useFeatureFlag('DARK_MODE');

  return (
    <motion.div {...fadeIn} className={styles.container}>
      <h2 className={styles.heading}>🚩 Feature Flags Demo</h2>

      <section className={styles.section}>
        <h3>✅ Enabled Features ({enabledFeatures.length})</h3>
        <ul className={styles.featureList}>
          {enabledFeatures.map((feature) => (
            <motion.li
              key={feature}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={styles.enabledFeature}
            >
              <strong>{feature}</strong>
              <span className={styles.enabledBadge}>✓ Available</span>
            </motion.li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h3>❌ Disabled Features ({disabledFeatures.length})</h3>
        <ul className={styles.featureList}>
          {disabledFeatures.map((feature) => (
            <motion.li
              key={feature}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={styles.disabledFeature}
            >
              <strong>{feature}</strong>
              <span className={styles.disabledBadge}>🔒 Coming soon</span>
            </motion.li>
          ))}
        </ul>
      </section>

      <section className={styles.examplesSection}>
        <h3 className={styles.heading}>🧪 Usage Examples</h3>

        {/* Example 1: Conditional rendering */}
        <div className={styles.exampleDiv}>
          <code className={styles.codeBlock}>useFeatureFlag('CLOUD_SYNC')</code>
          {hasCloudSync ? (
            <p className={styles.successText}>✅ Cloud Sync UI would render here</p>
          ) : (
            <p className={styles.errorText}>❌ Cloud Sync is disabled (Phase 2 feature)</p>
          )}
        </div>

        {/* Example 2: Another conditional feature */}
        <div>
          <code className={styles.codeBlock}>useFeatureFlag('DARK_MODE')</code>
          {hasDarkMode ? (
            <p className={styles.successText}>✅ Dark Mode toggle would render here</p>
          ) : (
            <p className={styles.errorText}>❌ Dark Mode is disabled</p>
          )}
        </div>
      </section>
    </motion.div>
  );
};
