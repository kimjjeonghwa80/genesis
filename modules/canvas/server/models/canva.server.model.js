'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Canva Schema
 */
var CanvaSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Canva name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Canva', CanvaSchema);
