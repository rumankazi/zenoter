/**
 * Database Tester Component
 *
 * Temporary component for manually testing database CRUD operations.
 * This will be removed once database integration is complete.
 */

import { useState } from 'react';
import { databaseClient, type Note } from '../../services/database.client';
import styles from './DatabaseTester.module.css';

export const DatabaseTester = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [testContent, setTestContent] = useState('# Test Note\n\nThis is a test note.');
  const [testTitle, setTestTitle] = useState('Test Note');
  const [status, setStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Check if Electron API is available
  const isElectronAvailable =
    typeof window !== 'undefined' && window.electron && window.electron.db !== undefined;

  const showStatus = (message: string, isError = false) => {
    setStatus(isError ? `❌ ${message}` : `✅ ${message}`);
    setTimeout(() => setStatus(''), 3000);
  };

  const handleCreateNote = async () => {
    try {
      const note = await databaseClient.createNote({
        title: testTitle,
        content: testContent,
      });
      showStatus(`Created note #${note.id}`);
      await loadAllNotes();
    } catch (error) {
      showStatus(`Error creating note: ${error}`, true);
    }
  };

  const loadAllNotes = async () => {
    try {
      const allNotes = await databaseClient.getAllNotes();
      setNotes(allNotes);
      showStatus(`Loaded ${allNotes.length} notes`);
    } catch (error) {
      showStatus(`Error loading notes: ${error}`, true);
    }
  };

  const handleSelectNote = async (id: number) => {
    try {
      const note = await databaseClient.getNoteById(id);
      setSelectedNote(note);
      if (note) {
        setTestTitle(note.title);
        setTestContent(note.content);
        showStatus(`Selected note #${note.id}`);
      }
    } catch (error) {
      showStatus(`Error loading note: ${error}`, true);
    }
  };

  const handleUpdateNote = async () => {
    if (!selectedNote) {
      showStatus('No note selected', true);
      return;
    }

    try {
      const updated = await databaseClient.updateNote(selectedNote.id, {
        title: testTitle,
        content: testContent,
      });
      if (updated) {
        showStatus(`Updated note #${updated.id}`);
        await loadAllNotes();
        setSelectedNote(updated);
      }
    } catch (error) {
      showStatus(`Error updating note: ${error}`, true);
    }
  };

  const handleDeleteNote = async (id: number) => {
    try {
      const success = await databaseClient.deleteNote(id);
      if (success) {
        showStatus(`Deleted note #${id}`);
        if (selectedNote?.id === id) {
          setSelectedNote(null);
          setTestTitle('');
          setTestContent('');
        }
        await loadAllNotes();
      }
    } catch (error) {
      showStatus(`Error deleting note: ${error}`, true);
    }
  };

  const handleSearch = async () => {
    try {
      const results = await databaseClient.searchNotes(searchQuery);
      setNotes(results);
      showStatus(`Found ${results.length} matching notes`);
    } catch (error) {
      showStatus(`Error searching: ${error}`, true);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🧪 Database Tester</h2>

      <div className={styles.electronStatus}>
        {isElectronAvailable ? (
          <span style={{ color: '#4caf50', fontWeight: 'bold', fontSize: '14px' }}>
            ✅ Electron API Available - Ready to test!
          </span>
        ) : (
          <div
            style={{
              padding: '20px',
              backgroundColor: '#fff3cd',
              border: '2px solid #ffc107',
              borderRadius: '8px',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#856404',
                marginBottom: '12px',
              }}
            >
              ⚠️ You're viewing this in a WEB BROWSER
            </div>
            <div style={{ color: '#856404', lineHeight: '1.6' }}>
              <p style={{ marginBottom: '8px' }}>
                <strong>The database only works in the Electron DESKTOP WINDOW.</strong>
              </p>
              <p style={{ marginBottom: '12px', fontSize: '14px' }}>
                When you run{' '}
                <code style={{ background: '#fff', padding: '2px 6px', borderRadius: '3px' }}>
                  pnpm electron:dev
                </code>
                , it opens TWO windows:
              </p>
              <ol style={{ paddingLeft: '20px', fontSize: '14px', marginBottom: '12px' }}>
                <li style={{ marginBottom: '4px' }}>
                  <strong>Web browser</strong> at localhost:5173 (❌ you are here - database won't
                  work)
                </li>
                <li style={{ marginBottom: '4px' }}>
                  <strong>Electron desktop app</strong> (✅ look for this window - database works
                  here!)
                </li>
              </ol>
              <p style={{ fontSize: '13px', fontStyle: 'italic', color: '#664d03' }}>
                💡 The Electron window looks like a standalone desktop app - check your taskbar!
              </p>
            </div>
          </div>
        )}
      </div>

      {status && <div className={styles.status}>{status}</div>}

      <div className={styles.section}>
        <h3>Create/Update Note</h3>
        <input
          type="text"
          placeholder="Note title"
          value={testTitle}
          onChange={(e) => setTestTitle(e.target.value)}
          className={styles.input}
        />
        <textarea
          placeholder="Note content (markdown)"
          value={testContent}
          onChange={(e) => setTestContent(e.target.value)}
          className={styles.textarea}
          rows={5}
        />
        <div className={styles.buttonGroup}>
          <button onClick={handleCreateNote} className={styles.button}>
            ➕ Create Note
          </button>
          <button onClick={handleUpdateNote} className={styles.button} disabled={!selectedNote}>
            💾 Update Selected
          </button>
          <button
            onClick={() => {
              setSelectedNote(null);
              setTestTitle('');
              setTestContent('');
            }}
            className={styles.button}
          >
            🆕 Clear Form
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Search Notes</h3>
        <div className={styles.searchGroup}>
          <input
            type="text"
            placeholder="Search query..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.input}
          />
          <button onClick={handleSearch} className={styles.button}>
            🔍 Search
          </button>
          <button onClick={loadAllNotes} className={styles.button}>
            📋 Load All
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Notes ({notes.length})</h3>
        <div className={styles.notesList}>
          {notes.length === 0 ? (
            <p className={styles.empty}>No notes yet. Create one above!</p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className={`${styles.noteCard} ${selectedNote?.id === note.id ? styles.selected : ''}`}
              >
                <div className={styles.noteHeader}>
                  <strong>#{note.id}</strong> - {note.title}
                </div>
                <div className={styles.noteContent}>
                  {note.content.substring(0, 100)}
                  {note.content.length > 100 ? '...' : ''}
                </div>
                <div className={styles.noteMeta}>
                  Created: {new Date(note.created_at).toLocaleString()}
                </div>
                <div className={styles.buttonGroup}>
                  <button onClick={() => handleSelectNote(note.id)} className={styles.smallButton}>
                    ✏️ Edit
                  </button>
                  <button onClick={() => handleDeleteNote(note.id)} className={styles.smallButton}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
