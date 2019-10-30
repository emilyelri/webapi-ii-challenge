const express = require('express');
const server = express();
const router = require('./router.js');
const port = 8000;

server.use(express.json());
server.use('/api/posts', router);

server.listen(port, () => {
  console.log(`~~~ listening on port ${port}  ~~~`)
});
