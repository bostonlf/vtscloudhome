
var express = require("express");
var app = express();
var cfenv = require("cfenv");
var bodyParser = require('body-parser');
var ejs = require('ejs');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var hbs = require('hbs');
var morgan = require('morgan');
var http = require('http');
var https = require('https');
var passport = require('passport');
var fs = require('fs');
var session = require("express-session");

var configurePassport = require('./config/passport')
const shouldConfigureLocal = true;
var privateKey = fs.readFileSync('cert/private.pem', 'utf8');
var certificate = fs.readFileSync('cert/file.crt', 'utf8')
var credentials = {
  key: privateKey,
  cert: certificate
};
var configureRoutes = require('./route/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

//serve static file (index.html, images, css)
app.use(express.static(__dirname + '/public'));


hbs.registerPartials(path.resolve(__dirname, 'views/partials'));
hbs.localsAsTemplateData(app);
app.use(morgan('dev'));

/*====== MIDDLEWARE BOILERPLATE FOR INITIALIZING PASSPORT WITH SESSIONS ====== */
// Parses payload bodies in requests so it is easier to work with
app.use(bodyParser.urlencoded({
  extended: false
}));

// Parses requests cookies. This is needed to get the user session cookie
app.use(cookieParser());

// Creates user session cookies that allows users to navigate between protected routes without
// having to log in every time
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));



// Configure passport with SAML strategy
configurePassport(passport, shouldConfigureLocal);

// Initialize passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());
/*====== END OF MIDDLEWARE BOILERPLATE ====== */

// Set static route to map to static asset
app.use('/static', express.static(path.resolve(__dirname, './static')));


// Add routes to app
app.use(configureRoutes(passport));


//do not forget add 404 to here

var httpsServer = https.createServer(credentials, app)
var sslport = 3001;
httpsServer.listen(sslport, function () {
  console.log('HTTPs server is running on https://localhost:%s', sslport)
})

var port = process.env.PORT || 3000
app.listen(port, function() {
  console.log("To view your app, open this link in your browser: http://localhost:" + port);
});