var express = require('express');
var http = require('http');
var fs = require('fs');
var isLoggedIn = require('../middleware/isLoggedIn');
var patchSAMLRequest = require('../middleware/patchSAMLRequest');
const router = express.Router();
var mydb = require('../DB/cloudant');

/* GET home page. */
function configureRoutes(passport) {

router.get("/test", function (req, res) {
console.log("teststart");
    res.send("this test");
})

router.get('/', function (req, res, next) {
    res.render('index');
  });
router.get('/login', passport.authenticate('saml'));

router.post('/login',
    patchSAMLRequest,
    passport.authenticate('saml', {
        successRedirect: '/success',
        failureRedirect: '/error',
    })
);
router.get('/success', isLoggedIn, function (req, res, next) {
    console.log(req.user);
    res.render('success', {
        user: req.user
    });
  });
  router.get('/error', function (req, res, next) {
    res.render('error');
  });



/* Endpoint to greet and add a new visitor to database.
 * Send a POST request to localhost:3000/api/visitors with body
 * {
 * 	"name": "Bob"
 * }
 */
router.post("/api/visitors", function(request, response) {
    var userName = request.body.name;
    var doc = {
      "name": userName
    };
    if (!mydb) {
      console.log("No database.");
      response.send(doc);
      return;
    }
    // insert the username as a document
    mydb.insert(doc, function(err, body, header) {
      if (err) {
        console.log('[mydb.insert] ', err.message);
        response.send("Error");
        return;
      }
      doc._id = body.id;
      response.send(doc);
    });
  });
  
  /**
   * Endpoint to get a JSON array of all the visitors in the database
   * REST API example:
   * <code>
   * GET http://localhost:3000/api/visitors
   * </code>
   *
   * Response:
   * [ "Bob", "Jane" ]
   * @return An array of all the visitor names
   */
  router.get("/api/visitors", function(request, response) {
    var names = [];
    if (!mydb) {
      response.json(names);
      return;
    }
  
    mydb.list({
      include_docs: true
    }, function(err, body) {
      if (!err) {
        body.rows.forEach(function(row) {
          if (row.doc.name)
            names.push(row.doc.name);
        });
        response.json(names);
      }
    });
  });
  
    return router;
}

module.exports = configureRoutes;