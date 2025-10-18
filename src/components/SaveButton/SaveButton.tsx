/**
 * Save Button Component
 * Shows save status and allows manual save
 */

import { FC } from 'react';
import { motion } from 'framer-motion';
import styles from './SaveButton.module.css';

interface SaveButtonProps {
  hasUnsavedChanges: boolean;
  onSave: () => void;
  isSaving?: boolean;
}

export const SaveButton: FC<SaveButtonProps> = ({
  hasUnsavedChanges,
  onSave,
  isSaving = false,
}) => {
  return (
    <motion.button
      className={`${styles.saveButton} ${!hasUnsavedChanges ? styles.disabled : ''}`}
      onClick={onSave}
      disabled={!hasUnsavedChanges || isSaving}
      whileHover={hasUnsavedChanges ? { scale: 1.05 } : {}}
      whileTap={hasUnsavedChanges ? { scale: 0.95 } : {}}
      aria-label={hasUnsavedChanges ? 'Save note' : 'No changes to save'}
      title={hasUnsavedChanges ? 'Save note (Ctrl+S)' : 'No changes to save'}
    >
      {isSaving ? (
        <svg width="16" height="16" viewBox="0 0 16 16" className={styles.icon}>
          <circle
            cx="8"
            cy="8"
            r="6"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            opacity="0.3"
          />
          <path
            d="M8 2 A 6 6 0 0 1 14 8"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 8 8"
              to="360 8 8"
              dur="1s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      ) : hasUnsavedChanges ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.icon}>
          <path
            d="M13.5 1.5H2.5C1.94772 1.5 1.5 1.94772 1.5 2.5V13.5C1.5 14.0523 1.94772 14.5 2.5 14.5H13.5C14.0523 14.5 14.5 14.0523 14.5 13.5V2.5C14.5 1.94772 14.0523 1.5 13.5 1.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.5 1.5V5.5C11.5 5.77614 11.2761 6 11 6H5C4.72386 6 4.5 5.77614 4.5 5.5V1.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M4.5 10.5H11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.icon}>
          <path
            d="M13.3 4.7L6 12L2.7 8.7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </motion.button>
  );
};
