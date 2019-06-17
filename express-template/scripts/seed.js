#!/usr/bin/env node
'use strict';

require('dotenv').config();
const
  debug = require('debug')('seed'),
  { MongoClient } = require('mongodb');
var conn, db;
process.env.MONGO_SERVER = process.env.MONGO_SERVER_DEV;


MongoClient.connect(process.env.MONGO_SERVER)
  .then(client => (conn = client).db('example'))
  .then(result => (db = result).dropDatabase())
  .then(() => Promise.all([
    db.createCollection('sessions').then(() => debug('Sessions dropped'))
  ])).catch(err => debug('*err %O', err)).then(() => conn && conn.close())
