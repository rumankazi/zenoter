/**
 * Feature Flags Configuration
 *
 * Controls feature visibility and availability across different phases.
 * Flags can be toggled without code changes for gradual rollouts.
 *
 * @see PLAN.md for rollout strategy
 */

export const FEATURE_FLAGS = {
  // ==========================================
  // Phase 1 - MVP (Local Only) - All Enabled
  // ==========================================

  /** Enable local SQLite storage for notes */
  LOCAL_STORAGE: true,

  /** Enable basic Monaco editor functionality */
  BASIC_EDITOR: true,

  /** Enable file tree navigation with drag-and-drop */
  FILE_TREE: true,

  /** Enable markdown preview pane */
  MARKDOWN_PREVIEW: true,

  /** Enable dark mode theme switching */
  DARK_MODE: true,

  // ==========================================
  // Phase 2 - Cloud Foundation - Disabled
  // ==========================================

  /** Enable cloud sync with Firebase/GCP */
  CLOUD_SYNC: false,

  /** Enable authentication system (OAuth) */
  AUTH_SYSTEM: false,

  /** Enable version control for notes (git-like diffs) */
  VERSION_CONTROL: false,

  // ==========================================
  // Phase 3+ - Future Features - Disabled
  // ==========================================

  /** Enable advanced full-text search with PostgreSQL */
  ADVANCED_SEARCH: false,

  /** Enable real-time sync across devices */
  REAL_TIME_SYNC: false,

  /** Enable collaborative editing features */
  COLLABORATION: false,

  /** Enable AI-powered suggestions and autocomplete */
  AI_SUGGESTIONS: false,

  /** Enable custom theme creation and marketplace */
  CUSTOM_THEMES: false,

  /** Enable plugin system for extensions */
  PLUGIN_SYSTEM: false,

  /** Enable mobile app versions (iOS/Android) */
  MOBILE_APPS: false,
} as const;

/**
 * Type-safe feature flag keys
 */
export type FeatureFlagKey = keyof typeof FEATURE_FLAGS;

/**
 * Type-safe feature flag values
 */
export type FeatureFlagValue = (typeof FEATURE_FLAGS)[FeatureFlagKey];

/**
 * Feature flag configuration with metadata (for future use)
 */
export interface FeatureFlagConfig {
  enabled: boolean;
  rolloutPercentage?: number;
  userGroups?: ('beta' | 'premium' | 'enterprise')[];
  remoteConfigKey?: string;
  environments?: ('development' | 'staging' | 'production')[];
  description?: string;
}
