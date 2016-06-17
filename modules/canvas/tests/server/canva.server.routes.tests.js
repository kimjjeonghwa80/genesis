'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Canva = mongoose.model('Canva'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, canva;

/**
 * Canva routes tests
 */
describe('Canva CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Canva
    user.save(function () {
      canva = {
        name: 'Canva name'
      };

      done();
    });
  });

  it('should be able to save a Canva if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Canva
        agent.post('/api/canvas')
          .send(canva)
          .expect(200)
          .end(function (canvaSaveErr, canvaSaveRes) {
            // Handle Canva save error
            if (canvaSaveErr) {
              return done(canvaSaveErr);
            }

            // Get a list of Canvas
            agent.get('/api/canvas')
              .end(function (canvasGetErr, canvasGetRes) {
                // Handle Canva save error
                if (canvasGetErr) {
                  return done(canvasGetErr);
                }

                // Get Canvas list
                var canvas = canvasGetRes.body;

                // Set assertions
                (canvas[0].user._id).should.equal(userId);
                (canvas[0].name).should.match('Canva name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Canva if not logged in', function (done) {
    agent.post('/api/canvas')
      .send(canva)
      .expect(403)
      .end(function (canvaSaveErr, canvaSaveRes) {
        // Call the assertion callback
        done(canvaSaveErr);
      });
  });

  it('should not be able to save an Canva if no name is provided', function (done) {
    // Invalidate name field
    canva.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Canva
        agent.post('/api/canvas')
          .send(canva)
          .expect(400)
          .end(function (canvaSaveErr, canvaSaveRes) {
            // Set message assertion
            (canvaSaveRes.body.message).should.match('Please fill Canva name');

            // Handle Canva save error
            done(canvaSaveErr);
          });
      });
  });

  it('should be able to update an Canva if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Canva
        agent.post('/api/canvas')
          .send(canva)
          .expect(200)
          .end(function (canvaSaveErr, canvaSaveRes) {
            // Handle Canva save error
            if (canvaSaveErr) {
              return done(canvaSaveErr);
            }

            // Update Canva name
            canva.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Canva
            agent.put('/api/canvas/' + canvaSaveRes.body._id)
              .send(canva)
              .expect(200)
              .end(function (canvaUpdateErr, canvaUpdateRes) {
                // Handle Canva update error
                if (canvaUpdateErr) {
                  return done(canvaUpdateErr);
                }

                // Set assertions
                (canvaUpdateRes.body._id).should.equal(canvaSaveRes.body._id);
                (canvaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Canvas if not signed in', function (done) {
    // Create new Canva model instance
    var canvaObj = new Canva(canva);

    // Save the canva
    canvaObj.save(function () {
      // Request Canvas
      request(app).get('/api/canvas')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Canva if not signed in', function (done) {
    // Create new Canva model instance
    var canvaObj = new Canva(canva);

    // Save the Canva
    canvaObj.save(function () {
      request(app).get('/api/canvas/' + canvaObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', canva.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Canva with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/canvas/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Canva is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Canva which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Canva
    request(app).get('/api/canvas/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Canva with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Canva if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Canva
        agent.post('/api/canvas')
          .send(canva)
          .expect(200)
          .end(function (canvaSaveErr, canvaSaveRes) {
            // Handle Canva save error
            if (canvaSaveErr) {
              return done(canvaSaveErr);
            }

            // Delete an existing Canva
            agent.delete('/api/canvas/' + canvaSaveRes.body._id)
              .send(canva)
              .expect(200)
              .end(function (canvaDeleteErr, canvaDeleteRes) {
                // Handle canva error error
                if (canvaDeleteErr) {
                  return done(canvaDeleteErr);
                }

                // Set assertions
                (canvaDeleteRes.body._id).should.equal(canvaSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Canva if not signed in', function (done) {
    // Set Canva user
    canva.user = user;

    // Create new Canva model instance
    var canvaObj = new Canva(canva);

    // Save the Canva
    canvaObj.save(function () {
      // Try deleting Canva
      request(app).delete('/api/canvas/' + canvaObj._id)
        .expect(403)
        .end(function (canvaDeleteErr, canvaDeleteRes) {
          // Set message assertion
          (canvaDeleteRes.body.message).should.match('User is not authorized');

          // Handle Canva error error
          done(canvaDeleteErr);
        });

    });
  });

  it('should be able to get a single Canva that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Canva
          agent.post('/api/canvas')
            .send(canva)
            .expect(200)
            .end(function (canvaSaveErr, canvaSaveRes) {
              // Handle Canva save error
              if (canvaSaveErr) {
                return done(canvaSaveErr);
              }

              // Set assertions on new Canva
              (canvaSaveRes.body.name).should.equal(canva.name);
              should.exist(canvaSaveRes.body.user);
              should.equal(canvaSaveRes.body.user._id, orphanId);

              // force the Canva to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Canva
                    agent.get('/api/canvas/' + canvaSaveRes.body._id)
                      .expect(200)
                      .end(function (canvaInfoErr, canvaInfoRes) {
                        // Handle Canva error
                        if (canvaInfoErr) {
                          return done(canvaInfoErr);
                        }

                        // Set assertions
                        (canvaInfoRes.body._id).should.equal(canvaSaveRes.body._id);
                        (canvaInfoRes.body.name).should.equal(canva.name);
                        should.equal(canvaInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Canva.remove().exec(done);
    });
  });
});
