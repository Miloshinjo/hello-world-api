/*
* Primary file for the API
*
*/

// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// HTTP Server
const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res);
});

httpServer.listen(9000, () => {
  console.log('Server is listening on port 9000')
});

// All the server logic
const unifiedServer = (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');

  const queryStringObject = parsedUrl.query;

  const headers = req.headers;

  const method = req.method.toLowerCase();

  const decoder = new StringDecoder('utf-8');

  let payload = '';
  req.on('data', data => {
    payload += decoder.write(data);
  });
  req.on('end', () => {
    payload += decoder.end();

    const chosenHandler = typeof(router[path]) !== 'undefined' ? router[path] : handlers.notFound;

    const data = {
      path,
      queryStringObject,
      method,
      headers,
      payload
    }

    chosenHandler(data, (statusCode = 200, payload = {}) => {
      const payloadString = JSON.stringify(payload);

      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      console.log('Returning this response:', statusCode, payloadString);
    });
  });
}

const handlers = {};

handlers.hello = (data, callback) => {
  callback(201, {
    message: 'Hello World!'
  });
};

handlers.notFound = (data, callback) => {
  callback(404);
}

const router = {
  'hello': handlers.hello
};