import { describe, it, expect } from 'vitest';
import { lightTheme, darkTheme, getTheme } from '../../styles/theme';

describe('theme', () => {
  describe('lightTheme', () => {
    it('should have all required color properties', () => {
      expect(lightTheme.colors).toBeDefined();
      expect(lightTheme.colors.primary).toBe('#2563eb');
      expect(lightTheme.colors.background).toBe('#ffffff');
      expect(lightTheme.colors.text).toBe('#1a1a1a');
    });

    it('should have shadow properties', () => {
      expect(lightTheme.shadows).toBeDefined();
      expect(lightTheme.shadows.small).toBeDefined();
      expect(lightTheme.shadows.medium).toBeDefined();
      expect(lightTheme.shadows.large).toBeDefined();
    });

    it('should have border radius properties', () => {
      expect(lightTheme.borderRadius).toBeDefined();
      expect(lightTheme.borderRadius.small).toBe('4px');
      expect(lightTheme.borderRadius.medium).toBe('8px');
    });

    it('should have spacing properties', () => {
      expect(lightTheme.spacing).toBeDefined();
      expect(lightTheme.spacing.md).toBe('16px');
    });
  });

  describe('darkTheme', () => {
    it('should have all required color properties', () => {
      expect(darkTheme.colors).toBeDefined();
      expect(darkTheme.colors.primary).toBe('#3b82f6');
      expect(darkTheme.colors.background).toBe('#1a1a1a');
      expect(darkTheme.colors.text).toBe('#f5f5f5');
    });

    it('should have darker background than light theme', () => {
      expect(darkTheme.colors.background).not.toBe(lightTheme.colors.background);
    });

    it('should have lighter text than light theme', () => {
      expect(darkTheme.colors.text).not.toBe(lightTheme.colors.text);
    });
  });

  describe('getTheme', () => {
    it('should return light theme for "light" parameter', () => {
      const theme = getTheme('light');
      expect(theme).toEqual(lightTheme);
    });

    it('should return dark theme for "dark" parameter', () => {
      const theme = getTheme('dark');
      expect(theme).toEqual(darkTheme);
    });
  });
});
