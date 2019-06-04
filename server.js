
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
var createError = require('http-errors');
var cors = require("cors");// 这个比较重要，解决跨域问题.npm install cors 装一下

var configurePassport = require('./config/passport')
//const shouldConfigureLocal = true;
//这里这个值在cloud是  production ，在local 是 undefined ，不知道是在哪里设置的
//另外，不知道在哪里调用环境变量
const shouldConfigureLocal = process.env.NODE_ENV === 'production';
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

// app.use(cors({
 
//   origin: ['http://localhost:8080'], // 这是本地的默认地址和端口，vue启动的项目就是在这里，这样保证了等会我们在浏览器能访问服务器的数据（user.json）
   
//   methods: ["GET", "POST"],
   
//   alloweHeaders: ["Content-Type", "Authorization"]
   
//   }))

// Configure passport with SAML strategy
configurePassport(passport, shouldConfigureLocal);

// Initialize passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());
/*====== END OF MIDDLEWARE BOILERPLATE ====== */

// Set static route to map to static asset
app.use('/static', express.static(path.resolve(__dirname, './static')));

app.get('apis/api/testcrodata', function (req, res, next) {
  res.send("you can see my data.");
});

// Add routes to app
app.use(configureRoutes(passport));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log("error handler");
  // render the error page
  res.status(err.status || 500);
  res.redirect('./page_404.html');
});

var httpsServer = https.createServer(credentials, app)
var sslport = 3001;
httpsServer.listen(sslport, function () {
  console.log('HTTPs server is running on https://localhost:%s', sslport)
})

var port = process.env.PORT || 3000
app.listen(port, function() {
  console.log("To view your app, open this link in your browser: http://localhost:" + port);
});