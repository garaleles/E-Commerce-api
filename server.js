import http from 'http';
import app from './app/app.js';

//create server
const server = http.createServer(app);
//listen to port
const port = process.env.PORT || 3000;

//start server
server.listen(port, () => {
  console.log(`Uygulama http://localhost:${port} üzerinde çalışıyor.`)
});

