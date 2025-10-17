import { FC } from 'react';
import { motion } from 'framer-motion';

/**
 * FileTree component displays a hierarchical tree structure of notes and folders
 * Following TDD approach - this is the minimal implementation to pass initial tests
 */
export const FileTree: FC = () => {
  return (
    <motion.div
      role="tree"
      aria-label="File tree navigation"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring' as const, stiffness: 300 }}
      style={{
        padding: '1rem',
        height: '100%',
        overflow: 'auto',
      }}
    >
      <div role="treeitem" aria-expanded="true">
        Notes
      </div>
    </motion.div>
  );
};
