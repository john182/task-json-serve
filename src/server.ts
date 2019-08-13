import * as jsonServer from 'json-server'
import { Express } from 'express'

import * as fs from 'fs'
import * as https from 'https'

import { handleAuthentication } from './auth';
import { handleAuthorization } from './authz';

const server: Express = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const port = process.env.PORT || 3000;

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)

//middleware para login
server.post('/login', handleAuthentication)
server.use('/tasks', handleAuthorization)

// Use default router
server.use(router)

const options = {
  cert: fs.readFileSync('./keys/cert.pem'),
  key: fs.readFileSync('./keys/key.pem')
}

https.createServer(options, server).listen(port, () => {
  console.log(`[SERVER] Running at http://localhost:`+port);
});