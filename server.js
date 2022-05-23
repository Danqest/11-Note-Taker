const express = require('express');
const fs = require('fs');
const path = require('path')
const noteData = require('./db/db.json')
const uuid = require('./helpers/uuid')

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
)

app.get('/notes', (req, res) => {
    console.info(`GET /public/notes.html`)
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})

app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received to retrieve notes`)
    res.sendFile(path.join(__dirname, '/db/db.json'))
})

app.delete('/api/notes/:id', (req, res) => {
    // NEEDS STUFF AND THINGS
})

app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a note`)
  const { title, text } = req.body

  if (title && text) {
    const newNote = {
        title,
        text,
        id: uuid()
    }
    
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err)
        } else {
            const parsedNotes = JSON.parse(data)

            parsedNotes.push(newNote)

            fs.writeFile(
                './db/db.json',
                JSON.stringify(parsedNotes, null, 4),
                (writeErr) =>
                    writeErr
                    ? console.error(writeErr)
                    : console.info('Successfully updated notes!')
            )
        }
    })

    const response = {
        status: 'success',
        body: newNote,
    }

    console.log(response)
    res.status(201).json(response)
  } else {
    res.status(500).json('Error in posting note')
  }
})

app.listen(PORT, () =>
  console.log(`Express server listening at http://localhost:${PORT}`)
);
