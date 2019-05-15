var express = require('express');
var http = require('http');
var fs = require('fs');
var cfenv = require("cfenv");
const appEnv = cfenv.getAppEnv({});
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');

var isLoggedIn = require('../middleware/isLoggedIn');
var patchSAMLRequest = require('../middleware/patchSAMLRequest');
const router = express.Router();
var mydb = require('../DB/cloudant');
var DBhandler = require('../DB/DBhandler');

//bodyParser 需要用，不然JS裏接收不了數據
// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({
    extended: false
  }))
  
  // parse application/json
  router.use(bodyParser.json())

// 密钥
const Tokensecret = 'vtscloud';

/* GET home page. */
function configureRoutes(passport) {

    router.get('/login', passport.authenticate('saml'));
    //这里之前是 success ，提示回调 post /login的时候找不到， 改成login就好了， 应该是哪个地方有设置
    //ACS HTTP Posthttps://vtscloud.mybluemix.net/login 就这里设置的
    //我用的本地的设置这里是 success，所以要在本地测试需要改成 success ，pub到cloud时，得改回 login
    //有空给改成一样的，已改，等带验证
    router.post('/success',
        patchSAMLRequest,
        passport.authenticate('saml', {
            successRedirect: '/success',
            failureRedirect: '/error',
        })
    );
    router.get('/success', isLoggedIn, function (req, res, next) {
        console.log(req.user);
        //A cookies shoud be generated here cookies:{w3idlogin:true,projectUser:true}
        //projectUser:true success
        //projectUser:failed usernotexisting
        var UserINFO = {
            userID: "feilv@cn.ibm.com",
            usergroup: "admin",
            otherINFO: "otherINFO"
        };

        // Token 数据
        const payload = UserINFO;//这里必须是个json
        // 签发 Token
        const token = jwt.sign(payload, Tokensecret, { expiresIn: '1day' });
        // 输出签发的 Token
        console.log(token);
        res.cookie("Usertoken", token, { maxAge: 900000, httpOnly: true });
        res.render('success', {
            user: req.user,
            logintoken: token
        });
    });

    router.get('/error', function (req, res, next) {
        res.render('error');
    });

    // Log the user out of the application and send them home.
    router.get('/logout', (request, response) => {
        request.logout();
        response.redirect('/');
    });

    router.use(function (req, res, next) {//這個每次都走
        console.log("x111111111111111111111111111x");
        var Usertoken = req.cookies.Usertoken;
        function verifyToken() {
            var res = "";
            jwt.verify(Usertoken, Tokensecret, (error, decoded) => {
                if (error) {
                    console.log("error : " + error.message);
                    res = "error";
                } else {
                    console.log(decoded);
                    //res.render('mytest',{"testMSG":testMSG});
                    res = "good";
                }
            })
            return res;
        }
        var tokeyFLG = verifyToken();//這裏需要寫成function，不然404
        if (tokeyFLG == "error") {
            console.log("tokeyFLG:" + tokeyFLG);
            res.render('mytest', { "testMSG": "Please re-login" });
        } else {
            console.log("tokeyFLG:" + tokeyFLG);
            next();
        }
    });

    router.get("/test", function (req, res) {
        var Usertoken = req.cookies.Usertoken;
        var testMSG = "start";
        console.log("teststart");
        console.log("testUserToken : " + Usertoken);

        //1 check cookies (token)
        res.render('mytest', { "testMSG": testMSG });
        // var mytest = process.env.NODE_ENV;
        // var appEnvINFO = JSON.stringify(appEnv);
        //res.send("this test"+mytest+"appEnvINFO:"+appEnvINFO);
    })

    //here should be redirected to homepage
    router.get('/', function (req, res, next) {
        res.render('index');
    });

    /* Endpoint to greet and add a new visitor to database.
     * Send a POST request to localhost:3000/api/visitors with body
     * {
     * 	"name": "Bob"
     * }
     */
    router.post("/api/visitors", function (request, response) {
        var userName = request.body.name;
        console.log("xxxxx22222222222");
        console.log(JSON.stringify(request.body));
        var doc = {
            "name": userName
        };
        if (!mydb) {
            console.log("No database.");
            response.send(doc);
            return;
        }
        // insert the username as a document
        mydb.insert(doc, function (err, body, header) {
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
    router.get("/api/visitors", function (request, response) {

  DBhandler.list(function(result){
            response.json(result);
        });

        // var names = [];
        // if (!mydb) {
        //     response.json(names);
        //     return;
        // }

        // mydb.list({
        //     include_docs: true
        // }, function (err, body) {
        //     if (!err) {
        //         body.rows.forEach(function (row) {
        //             if (row.doc.name)
        //                 names.push(row.doc.name);
        //         });
        //         response.json(names);
        //     }
        // });

    });

    return router;
}

module.exports = configureRoutes;