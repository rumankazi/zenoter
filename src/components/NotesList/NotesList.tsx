/**
 * NotesList Component
 *
 * Displays a list of notes from the database with create/delete actions.
 * Replaces the temporary FileTree component.
 */

import { FC } from 'react';
import { motion } from 'framer-motion';
import type { Note } from '../../services/database.client';
import styles from './NotesList.module.css';

interface NotesListProps {
  notes: Note[];
  selectedNoteId: number | null;
  onNoteSelect: (note: Note) => void;
  onNoteCreate: () => void;
  onNoteDelete: (id: number) => void;
  isLoading?: boolean;
}

export const NotesList: FC<NotesListProps> = ({
  notes,
  selectedNoteId,
  onNoteSelect,
  onNoteCreate,
  onNoteDelete,
  isLoading = false,
}) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getPreview = (content: string): string => {
    // Handle empty string content
    if (!content) {
      return 'No content';
    }

    // Remove markdown syntax for preview
    const text = content
      .replace(/^#{1,6}\s+/gm, '') // Remove headings
      .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.+?)\*/g, '$1') // Remove italic
      .replace(/`(.+?)`/g, '$1') // Remove inline code
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim();

    return text.length > 60 ? text.substring(0, 60) + '...' : text || 'Empty note';
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <button
          className={`${styles.createPanel} ${styles.loading}`}
          disabled
          aria-label="Loading notes"
        >
          <svg width="20" height="20" viewBox="0 0 16 16" opacity="0.6">
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
        </button>
        <div className={styles.list}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button
        className={styles.createPanel}
        onClick={onNoteCreate}
        aria-label="Create new note"
        title="Create new note"
      >
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" opacity="0.6">
          <path d="M8 2V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M2 8H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {notes.length === 0 ? (
        <div className={styles.empty}>
          <p>Click above to create your first note</p>
        </div>
      ) : (
        <div className={styles.list}>
          {notes.map((note) => (
            <motion.div
              key={note.id}
              className={`${styles.noteItem} ${selectedNoteId === note.id ? styles.selected : ''}`}
              onClick={() => onNoteSelect(note)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={styles.noteContent}>
                <div className={styles.noteTitle}>{note.title || 'Untitled Note'}</div>
                <div className={styles.notePreview}>{getPreview(note.content)}</div>
                <div className={styles.noteDate}>{formatDate(note.updated_at)}</div>
              </div>
              <button
                className={styles.deleteButton}
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('Delete this note?')) {
                    onNoteDelete(note.id);
                  }
                }}
                aria-label={`Delete note: ${note.title || 'Untitled'}`}
                title="Delete note"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path
                    d="M12.6667 4V13.3333C12.6667 13.7015 12.3682 14 12 14H4C3.63181 14 3.33333 13.7015 3.33333 13.3333V4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.33333 4V2.66667C5.33333 2.29848 5.63181 2 6 2H10C10.3682 2 10.6667 2.29848 10.6667 2.66667V4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.66667 7.33333V11.3333"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M9.33333 7.33333V11.3333"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
