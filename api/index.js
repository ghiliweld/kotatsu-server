const express = require("express");
const cors = require("cors");
import { http_server as braidify } from 'braidify';

const app = express();
let versionNum = 0;

// Subscription data
var subscriptions = {}
var subscription_hash = (req) => JSON.stringify([req.headers.peer, req.url])

let log = 'hello'
console.log = (message) => {log += message + '\n'}

app.options('*', cors())
app.use(express.json());
//app.use(free_the_cors());
app.use(braidify);    // Add braid stuff to req and res

const board = {};
for (let i = 1; i < 11; i++) {
  for (let j = 1; j < 11; j++) {
    board[`${i}_${j}`] = ".";
  }
}

app.get("/api/board", (req, res) => {
  // res.json(board);
  console.log('test')
  try{
    if (req.subscribe) {     // Using the new subscription feature braidify is adding to req & res
      res.startSubscription({ onClose: _=> delete subscriptions[subscription_hash(req)] })
      subscriptions[subscription_hash(req)] = res
      console.log('We are subscribing at hash', subscription_hash(req))
      res.statusCode = 200
    } else {
        res.statusCode = 200
    }
  
    // Send the current version
    res.sendVersion({
        version: versionNum++,
        body: JSON.stringify(board)
    })
    res.setHeader("Access-Control-Allow-Origin", "*")
    if (!req.subscribe) res.end()
  } catch (error) {
    log += '\n' + error.toString()
  }
});

app.get('/api/log', (req, res) => {
  res.send(log)
})

// app.post("/api/board", (req, res) => {
//   for (let i = 1; i < 11; i++) {
//     for (let j = 1; j < 11; j++) {
//       board[`${i}_${j}`] = ".";
//     }
//   }
//   res.json({ msg: "success!" });
// });

app.put("/api/board", (req, res) => {
  // board[coord] = req.body.char;
  // res.json({ msg: "success!" });

  // var patches = await req.patches()  // Braidify adds .patches() to request objects

  // // Bug: Should return error code (40x?) for invalid request instead of crashing
  // assert(patches.length === 1)
  // assert(patches[0].range === '[-0:-0]')
  // assert(patches[0].unit === 'json')

  // resources['/chat'].push(JSON.parse(patches[0].content))
  board[req.body.coord] = req.body.char;

  // Now send the data to all subscribers
  for (var k in subscriptions) {
      var [peer, url] = JSON.parse(k)
      if (url === req.url  // Send only to subscribers of this URL
          && peer !== req.headers.peer)  { // Skip the peer that sent this PUT

          let v = versionNum;
          subscriptions[k].sendVersion({
              version: v,
              body: JSON.stringify(board)
          })
          versionNum++;
      }
  }
  
  res.statusCode = 200
  res.end()
});

// Free the CORS!
function free_the_cors (req, res, next) {
  console.log('free the cors!', req.method, req.url)

  // Hey... these headers aren't about CORS!  Let's move them into the braid
  // libraries:
  res.setHeader('Range-Request-Allow-Methods', 'PATCH, PUT')
  res.setHeader('Range-Request-Allow-Units', 'json')
  res.setHeader("Patches", "OK")
  // ^^ Actually, it looks like we're going to delete these soon.

  var free_the_cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS, HEAD, GET, PUT, UNSUBSCRIBE",
      "Access-Control-Allow-Headers": "subscribe, peer, version, parents, merge-type, content-type, patches, cache-control, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  }
  Object.entries(free_the_cors).forEach(x => res.setHeader(x[0], x[1]))
  if (req.method === 'OPTIONS') {
      res.writeHead(200)
      res.end()
  } else
      next()
}

module.exports = app;
