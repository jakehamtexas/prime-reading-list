import Express from 'express';
import BookManager from './Managers/BookManager';
const app: Express.Application = Express();
const port: number = 8080; // default port to listen

app.set('port', port);

const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/list', async req => {
  if (req) {
    const numPages = req.params.numPages || Number.MAX_VALUE;
    let hasAbortedRequest = new Promise<boolean>(resolve => resolve(false));
    req.on('close', () => (hasAbortedRequest = Promise.resolve(true)));
    await BookManager.list(io, Number(numPages), hasAbortedRequest);
  }
});

http.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
