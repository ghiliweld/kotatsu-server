const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())

const board = {};
for (let i = 1; i < 11; i++) {
  for (let j = 1; j < 11; j++) {
    board[`${i}_${j}`] = '.';
  }
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/board', (req, res) => {
  res.json(board)
})

app.get('/:coords', (req, res) => {
    const { coords } = req.params;
    res.send(board[coords]);
})

app.post('/:coords', (req, res) => {
    const { coords } = req.params;
    const { char } = req.body;
    board[coords] = char;
    res.send('success!');
})

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// })
module.exports = app;