import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    fetch('/api/notes')
      .then(res => res.json())
      .then(data => setNotes(data))
      .catch(err => console.error(err));
  }, []);

  const handleAddNote = (event) => {
    event.preventDefault();

    const noteObject = {
      content: newNote,
      id: notes.length + 1,
    };

    setNotes(notes.concat(noteObject));
    setNewNote('');
  };

  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  };

  const handleDelete = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const onDragEnd = (result) => {
    // Verifica se a nota foi solta fora de uma lista
    if (!result.destination) {
      return;
    }
    const notesCopy = [...notes];
    const [reorderedItem] = notesCopy.splice(result.source.index, 1);
    notesCopy.splice(result.destination.index, 0, reorderedItem);

    setNotes(notesCopy);
  };

  return (
    <div className="board">
      <div className='notes'> 
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="notes">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {notes.map((note, index) => (
                <Draggable key={note.id} draggableId={note.id} index={index}>
                  {(provided) => (
                    <div
                      className="note"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div className="note-header">
                        <span className="note-id">{note.id}</span>
                        <span className="note-delete" onClick={() => handleDelete(note.id)}>
                          X
                        </span>
                      </div>
                      <div className="note-body" dangerouslySetInnerHTML={{ __html: note.content }}></div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <form onSubmit={handleAddNote}>
      <div className="form-container">
        <input type="text" value={newNote} onChange={handleNoteChange} />
        <button type="submit">Note It</button>
        </div>
      </form>
    </div>
    </div>
  );
}

export default App;
