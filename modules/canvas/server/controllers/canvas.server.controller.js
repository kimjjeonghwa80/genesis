'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Canva = mongoose.model('Canva'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Canva
 */
exports.create = function(req, res) {
  var canva = new Canva(req.body);
  canva.user = req.user;

  canva.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(canva);
    }
  });
};

/**
 * Show the current Canva
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var canva = req.canva ? req.canva.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  canva.isCurrentUserOwner = req.user && canva.user && canva.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(canva);
};

/**
 * Update a Canva
 */
exports.update = function(req, res) {
  var canva = req.canva ;

  canva = _.extend(canva , req.body);

  canva.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(canva);
    }
  });
};

/**
 * Delete an Canva
 */
exports.delete = function(req, res) {
  var canva = req.canva ;

  canva.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(canva);
    }
  });
};

/**
 * List of Canvas
 */
exports.list = function(req, res) { 
  Canva.find().sort('-created').populate('user', 'displayName').exec(function(err, canvas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(canvas);
    }
  });
};

/**
 * Canva middleware
 */
exports.canvaByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Canva is invalid'
    });
  }

  Canva.findById(id).populate('user', 'displayName').exec(function (err, canva) {
    if (err) {
      return next(err);
    } else if (!canva) {
      return res.status(404).send({
        message: 'No Canva with that identifier has been found'
      });
    }
    req.canva = canva;
    next();
  });
};
