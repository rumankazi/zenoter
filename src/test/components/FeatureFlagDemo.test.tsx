import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FeatureFlagDemo } from '../../components/FeatureFlagDemo';
import * as hooks from '../../hooks/useFeatureFlag';

// Mock the hooks
vi.mock('../../hooks/useFeatureFlag', () => ({
  useFeatureFlag: vi.fn(),
  useEnabledFeatures: vi.fn(),
}));

// Mock FeatureFlagService
vi.mock('../../services/featureFlag.service', () => ({
  FeatureFlagService: {
    getInstance: vi.fn(() => ({
      getDisabledFlags: vi.fn(() => ['CLOUD_SYNC', 'AUTH_SYSTEM']),
    })),
  },
}));

describe('FeatureFlagDemo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the demo component', () => {
    vi.mocked(hooks.useEnabledFeatures).mockReturnValue(['LOCAL_STORAGE', 'DARK_MODE']);
    vi.mocked(hooks.useFeatureFlag).mockReturnValue(false);

    render(<FeatureFlagDemo />);

    expect(screen.getByText('🚩 Feature Flags Demo')).toBeInTheDocument();
  });

  it('should display enabled features', () => {
    vi.mocked(hooks.useEnabledFeatures).mockReturnValue(['LOCAL_STORAGE', 'DARK_MODE']);
    vi.mocked(hooks.useFeatureFlag).mockReturnValue(false);

    render(<FeatureFlagDemo />);

    expect(screen.getByText(/Enabled Features/)).toBeInTheDocument();
    expect(screen.getByText('LOCAL_STORAGE')).toBeInTheDocument();
    expect(screen.getByText('DARK_MODE')).toBeInTheDocument();
  });

  it('should display disabled features', () => {
    vi.mocked(hooks.useEnabledFeatures).mockReturnValue(['LOCAL_STORAGE']);
    vi.mocked(hooks.useFeatureFlag).mockReturnValue(false);

    render(<FeatureFlagDemo />);

    expect(screen.getByText(/Disabled Features/)).toBeInTheDocument();
    expect(screen.getByText('CLOUD_SYNC')).toBeInTheDocument();
    expect(screen.getByText('AUTH_SYSTEM')).toBeInTheDocument();
  });

  it('should show CLOUD_SYNC disabled message when flag is false', () => {
    vi.mocked(hooks.useEnabledFeatures).mockReturnValue(['LOCAL_STORAGE']);
    vi.mocked(hooks.useFeatureFlag).mockImplementation((flag) => {
      if (flag === 'CLOUD_SYNC') return false;
      if (flag === 'DARK_MODE') return true;
      return false;
    });

    render(<FeatureFlagDemo />);

    expect(screen.getByText('❌ Cloud Sync is disabled (Phase 2 feature)')).toBeInTheDocument();
  });

  it('should show CLOUD_SYNC enabled message when flag is true', () => {
    vi.mocked(hooks.useEnabledFeatures).mockReturnValue(['CLOUD_SYNC']);
    vi.mocked(hooks.useFeatureFlag).mockImplementation((flag) => {
      if (flag === 'CLOUD_SYNC') return true;
      if (flag === 'DARK_MODE') return false;
      return false;
    });

    render(<FeatureFlagDemo />);

    expect(screen.getByText('✅ Cloud Sync UI would render here')).toBeInTheDocument();
  });

  it('should show DARK_MODE disabled message when flag is false', () => {
    vi.mocked(hooks.useEnabledFeatures).mockReturnValue(['LOCAL_STORAGE']);
    vi.mocked(hooks.useFeatureFlag).mockImplementation((flag) => {
      if (flag === 'CLOUD_SYNC') return false;
      if (flag === 'DARK_MODE') return false;
      return false;
    });

    render(<FeatureFlagDemo />);

    expect(screen.getByText('❌ Dark Mode is disabled')).toBeInTheDocument();
  });

  it('should show DARK_MODE enabled message when flag is true', () => {
    vi.mocked(hooks.useEnabledFeatures).mockReturnValue(['DARK_MODE']);
    vi.mocked(hooks.useFeatureFlag).mockImplementation((flag) => {
      if (flag === 'CLOUD_SYNC') return false;
      if (flag === 'DARK_MODE') return true;
      return false;
    });

    render(<FeatureFlagDemo />);

    expect(screen.getByText('✅ Dark Mode toggle would render here')).toBeInTheDocument();
  });

  it('should display usage examples section', () => {
    vi.mocked(hooks.useEnabledFeatures).mockReturnValue(['LOCAL_STORAGE']);
    vi.mocked(hooks.useFeatureFlag).mockReturnValue(false);

    render(<FeatureFlagDemo />);

    expect(screen.getByText('🧪 Usage Examples')).toBeInTheDocument();
    expect(screen.getByText("useFeatureFlag('CLOUD_SYNC')")).toBeInTheDocument();
    expect(screen.getByText("useFeatureFlag('DARK_MODE')")).toBeInTheDocument();
  });
});
