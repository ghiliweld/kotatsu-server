const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())

const board = {};
board["10_10"] = "🍊"

app.get('/', (req, res) => {
  res.send('Hello World!')
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})