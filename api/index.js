const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())
app.use(bodyParser.json({ limit: '150mb' }))
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
    res.send(board[coords]);
})

app.post('/api/:coords', (req, res) => {
    const { coords } = req.params;
    const { char } = req.body;
    board[coords] = char;
    res.send('success!');
})

// const app = require('express')()
// // const { v4 } = require('uuid')

// app.get('/api', (req, res) => {
//   // const path = `/api/item/${v4()}`
//   res.setHeader('Content-Type', 'text/html')
//   res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate')
//   res.end(`Hello! Go to item: <a href="${path}">${path}</a>`)
// })

// app.get('/api/item/:slug', (req, res) => {
//   const { slug } = req.params
//   res.end(`Item: ${slug}`)
// })

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// })
module.exports = app;