'use strict';

/**
 * Module dependencies
 */
var canvasPolicy = require('../policies/canvas.server.policy'),
  canvas = require('../controllers/canvas.server.controller');

module.exports = function(app) {
  // Canvas Routes
  app.route('/api/canvas').all(canvasPolicy.isAllowed)
    .get(canvas.list)
    .post(canvas.create);

  app.route('/api/canvas/:canvaId').all(canvasPolicy.isAllowed)
    .get(canvas.read)
    .put(canvas.update)
    .delete(canvas.delete);

  // Finish by binding the Canva middleware
  app.param('canvaId', canvas.canvaByID);
};
