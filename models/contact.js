'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Contact = new Schema({
  _id: String,
  name: String,  
  email: String,
  messages: [{
    _id: String,
    message: String,
    date: Date
  }]  
});

module.exports = mongoose.model('Contact', Contact);