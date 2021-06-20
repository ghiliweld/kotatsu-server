const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const app = express()
const port = 3000

app.use(cors())
// app.use(bodyParser.json({ limit: '150mb' }))
app.use(express.json());

const board = {};
for (let i = 1; i < 11; i++) {
  for (let j = 1; j < 11; j++) {
    board[`${i}_${j}`] = '.';
  }
}

app.get('/api', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/board', (req, res) => {
  res.json(board)
})

app.get('/api/:coords', (req, res) => {
    const { coords } = req.params;
    res.json({ char: board[coords] });
})

app.post('/api/:coords', (req, res) => {
    const { coords } = req.params;
    const { char } = req.body;
    board[coords] = char;
    res.json({ msg: 'success!' });
})

module.exports = app;