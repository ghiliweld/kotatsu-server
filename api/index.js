const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const board = {};
for (let i = 1; i < 11; i++) {
  for (let j = 1; j < 11; j++) {
    board[`${i}_${j}`] = ".";
  }
}

app.get("/api/board", (req, res) => {
  res.json(board);
});

app.post("/api/board", (req, res) => {
  for (let i = 1; i < 11; i++) {
    for (let j = 1; j < 11; j++) {
      board[`${i}_${j}`] = ".";
    }
  }
  res.json({ msg: "success!" });
});

app.put("/api/board", (req, res) => {
  board[req.body.coord] = req.body.char;
  res.json({ msg: "success!" });
});

module.exports = app;
