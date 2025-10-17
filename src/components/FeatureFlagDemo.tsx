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
    <motion.div
      {...fadeIn}
      style={{
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h2>🚩 Feature Flags Demo</h2>

      <section style={{ marginTop: '20px' }}>
        <h3>✅ Enabled Features ({enabledFeatures.length})</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {enabledFeatures.map((feature) => (
            <motion.li
              key={feature}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                padding: '8px',
                margin: '4px 0',
                backgroundColor: '#e8f5e9',
                borderRadius: '4px',
              }}
            >
              <strong>{feature}</strong>
              <span style={{ marginLeft: '10px', color: '#4caf50' }}>✓ Available</span>
            </motion.li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: '20px' }}>
        <h3>❌ Disabled Features ({disabledFeatures.length})</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {disabledFeatures.map((feature) => (
            <motion.li
              key={feature}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                padding: '8px',
                margin: '4px 0',
                backgroundColor: '#ffebee',
                borderRadius: '4px',
                opacity: 0.6,
              }}
            >
              <strong>{feature}</strong>
              <span style={{ marginLeft: '10px', color: '#f44336' }}>🔒 Coming soon</span>
            </motion.li>
          ))}
        </ul>
      </section>

      <section
        style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
        }}
      >
        <h3>🧪 Usage Examples</h3>

        {/* Example 1: Conditional rendering */}
        <div style={{ marginBottom: '15px' }}>
          <code style={{ backgroundColor: '#fff', padding: '4px 8px', borderRadius: '3px' }}>
            useFeatureFlag('CLOUD_SYNC')
          </code>
          {hasCloudSync ? (
            <p style={{ color: '#4caf50' }}>✅ Cloud Sync UI would render here</p>
          ) : (
            <p style={{ color: '#f44336' }}>❌ Cloud Sync is disabled (Phase 2 feature)</p>
          )}
        </div>

        {/* Example 2: Another conditional feature */}
        <div>
          <code style={{ backgroundColor: '#fff', padding: '4px 8px', borderRadius: '3px' }}>
            useFeatureFlag('DARK_MODE')
          </code>
          {hasDarkMode ? (
            <p style={{ color: '#4caf50' }}>✅ Dark Mode toggle would render here</p>
          ) : (
            <p style={{ color: '#f44336' }}>❌ Dark Mode is disabled</p>
          )}
        </div>
      </section>
    </motion.div>
  );
};
