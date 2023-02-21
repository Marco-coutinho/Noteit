const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 5000;

const db = new sqlite3.Database('./server/noteit.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the NoteIt database.');
});

app.use(express.json());

// GET all notes
app.get('/api/notes', (req, res) => {
  db.all('SELECT * FROM notes', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal server error');
    } else {
      res.send(rows);
    }
  });
});

// POST a new note
app.post('/api/notes', (req, res) => {
  const { content } = req.body;
  if (!content) {
    res.status(400).send('Note content is required');
  } else {
    db.run('INSERT INTO notes (content) VALUES (?)', content, function(err) {
      if (err) {
        console.error(err.message);
        res.status(500).send('Internal server error');
      } else {
        const newNote = {
          id: this.lastID,
          content,
        };
        res.send(newNote);
      }
    });
  }
});

app.listen(port, () => {
  console.log(`NoteIt server listening at http://localhost:${port}`);
});
