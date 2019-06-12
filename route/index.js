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


mydb = mydb("mydb");
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

    router.get('/login', passport.authenticate('saml'));//这里会从前端返回一个backurl参数，想办法弄到，直接跳转回去
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
        console.log("First time login successfully , IBMuserINFO:" + JSON.stringify(req.user));

        // {
        //     "issuer": {
        //         "_": "https://w3id.alpha.sso.ibm.com/auth/sps/samlidp2/saml20",
        //         "$": {
        //             "Format": "urn:oasis:names:tc:SAML:2.0:nameid-format:entity"
        //         }
        //     },
        //     "sessionIndex": "uuidfd52c0ae-016a-148d-b7d0-a3e9d282deec",
        //     "nameID": "feilv@cn.ibm.com",
        //     "nameIDFormat": "urn:ibm:names:ITFIM:5.1:accessmanager",
        //     "firstName": "Fei",
        //     "uid": "053946672",
        //     "lastName": "Lv",
        //     "emailaddress": "feilv@cn.ibm.com",
        //     "cn": "Fei Lv",
        //     "blueGroups": ["cn=ITSAS General Access 1,ou=memberlist,ou=ibmgroups,o=ibm.com", "cn=user - perf,ou=memberlist,ou=ibmgroups,o=ibm.com", "cn=BSO-AP-GCG_CN-BJ-CDL-DEP2,ou=memberlist,ou=ibmgroups,o=ibm.com", "cn=BSO-AP-GCG_CN-SH-CDL-ShuiOn1,ou=memberlist,ou=ibmgroups,o=ibm.com", "cn=BSO-AP-GCG_TW-CDL-ALL2,ou=memberlist,ou=ibmgroups,o=ibm.com", "cn=BSO-AP-GCG_HK-G6O-SWG-G2,ou=memberlist,ou=ibmgroups,o=ibm.com", "cn=BSO-AP-GCG_CN-XA-CDL-DEP2,ou=memberlist,ou=ibmgroups,o=ibm.com", "cn=BSO-AP-GCG_CN-NB-CDL-DEP1,ou=memberlist,ou=ibmgroups,o=ibm.com", "cn=rptHRMS_cn,ou=memberlist,ou=ibmgroups,o=ibm.com", "cn=BSO-AP-GCG_CN-XA-CSTL-DEP2,ou=memberlist,ou=ibmgroups,o=ibm.com", "cn=ratsuite183_RTCuser,ou=memberlist,ou=ibmgroups,o=ibm.com", "cn=MS__OFFICE__2013SE__B,ou=memberlist,ou=ibmgroups,o=ibm.com", "cn=MS__OFFICE__2010SE__MASTER,ou=memberlist,ou=ibmgroups,o=ibm.com", "cn=MS__OFFICE__2013SE__MASTER,ou=memberlist,ou=ibmgroups,o=ibm.com", "cn=MS__OFFICE__2011SE__MASTER,ou=memberlist,ou=ibmgroups,o=ibm.com", "cn=LIS Regular China,ou=memberlist,ou=ibmgroups,o=ibm.com", "cn=legalibm,ou=memberlist,ou=ibmgroups,o=ibm.com", "cn=WSE - Order&Workflow Squad,ou=memberlist,ou=ibmgroups,o=ibm.com", "cn=w3id-saml-adopters-techcontacts,ou=memberlist,ou=ibmgroups,o=ibm.com", "cn=HRMS_employees_ch_hk,ou=memberlist,ou=ibmgroups,o=ibm.com", "cn=pSeriesADS,ou=memberlist,ou=ibmgroups,o=ibm.com", "cn=ThinkNews,ou=memberlist,ou=ibmgroups,o=ibm.com", "cn=SH IBM Reqular 201808,ou=memberlist,ou=ibmgroups,o=ibm.com", "cn=SH IBM Reqular 201808-1,ou=memberlist,ou=ibmgroups,o=ibm.com", "cn=SH IBM Reqular 201808 P,ou=memberlist,ou=ibmgroups,o=ibm.com", "cn=G_China_Grp,ou=memberlist,ou=ibmgroups,o=ibm.com", "cn=MD test group1,ou=memberlist,ou=ibmgroups,o=ibm.com"]
        // }

        //A cookies shoud be generated here cookies:{w3idlogin:true,projectUser:true}
        //projectUser:true success
        //projectUser:failed usernotexisting
        var UserINFO = req.user;

        // Token 数据
        const payload = UserINFO;//这里必须是个json
        // 签发 Token
        const token = jwt.sign(payload, Tokensecret, { expiresIn: '1day' });
        // 输出签发的 Token
        // console.log("first time set tokken , and generate cookie ,token:"+token);
        console.log("cookie IBMuserINFO:" + JSON.stringify(req.user));
        res.cookie("Usertoken", token, { maxAge: 900000, httpOnly: true });
        res.cookie("IBMuserINFO", req.user, { maxAge: 900000, httpOnly: true });
        res.render('success', {
            user: req.user.uid,
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
        // console.log("@@@@@@@@@@@@@check Usertoken start@@@@@@@@@@@@@@");
        var Usertoken = req.cookies.Usertoken;
        function verifyToken() {
            var res = "";
            jwt.verify(Usertoken, Tokensecret, (error, decoded) => {
                if (error) {
                    console.log("error : " + error.message);
                    res = "error";
                } else {
                    //console.log("decoded : "+JSON.stringify(decoded));
                    //res.render('mytest',{"testMSG":testMSG});
                    res = "good";
                }
            })
            return res;
        }
        var tokeyFLG = verifyToken();//這裏需要寫成function，不然404
        if (tokeyFLG == "error") {
            console.log("tokeyFLG:" + tokeyFLG);
            //res.render('mytest', { "testMSG": "Please re-login" });
            res.send('loginError');
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

    router.get("/testnewAJAX", function (req, res) {
        console.log("5555555555555555555555555555555555");
        console.log(req);
        var IBMuserINFO = req.cookies.IBMuserINFO;
        res.send("search");
    });

    //********************************real route start******************************************//


    //add new doc
    router.post("/API/createNewDoc", function (req, res) {
        // var BO=req.BOname;
        console.log(req.body);
        var BO = "user";
        var data = req.body;
        DBhandler.createNewDoc(BO, data, function (result) {
            console.log("newUserID: " + JSON.stringify(result));
            // response.json(result);
            res.send(JSON.stringify(result));
        });

    });


    //search user for report
    router.get("/API/searchUsers", function (req, res) {
        // console.log("req : "+JSON.stringify(req));
        // console.log("req.query : "+JSON.stringify(req.query));
        // console.log("req.params : "+JSON.stringify(req.params));

        // 用req.query获取参数
        // // GET /shoes?order=desc&shoe[color]=blue&shoe[type]=converse
        // req.query.order
        // // => "desc"
        // req.query.shoe.color
        // // => "blue"
        // req.query.shoe.type
        // 用req.params获取参数
        // 例如，如果你有route/user/：name，那么“name”属性可作为req.params.name。

        var esq = {
            "selector": {
            },
            "fields": ["_id", "_rev", "x_userid", "role", "x_firstname", "x_lastname", "Status", "x_modified"],
            "skip": 0,
            "execution_stats": true
        }

        DBhandler.find("user", esq, function (result) {
            res.json(result);
        });
    });

    router.delete("/API/deleteSelectedUsers", function (req, res) {
        // var BO=req.BOname;
        console.log(req.query);
        // query:
        // { id: '12345',
        // selectedUser:
        //  [ 'e81c6a059d6f09f2188936ebd06b1ea0@1-6c68340985d3d0e2166c6420abd3751f',
        //    'ff529e1d98caa929b5f9c8c43917a2a3@1-aa249fca3c9e9c782a55961f6a3dccbe',
        //    'ff529e1d98caa929b5f9c8c4391fae71@1-6e8bc08cad3f0c15fef8eaa4f327b6e2' ] }
        var Userres = [];
        var BO = "user";
        var data = {};
        var selectedUser = req.query.selectedUser;
        if (selectedUser instanceof Array) {
            for (var i = 0; selectedUser[i]; i++) {
                var Cuser = selectedUser[i];
                data._id = Cuser.split("@")[0];
                data._rev = Cuser.split("@")[1];
                DBhandler.deleteOneRequest(BO, data, function (error, result) {
                    var deleteOnedocRES = error ? error : result;
                    console.log("deletedUser: " + JSON.stringify(deleteOnedocRES) + "iiiiiiii:" + i);
                    Userres.push(deleteOnedocRES);

                    // Data: { ok: true,
                    //     id: 'b8dd82f40cd98b73d93ac2a69908d350',
                    //     rev: '2-8e4f3c1bd5927490c3dcfbc36cfebfa0' }

                    if (deleteOnedocRES.ok) {
                        console.log("111111111111111111111" + result.id);
                        if (result.id == selectedUser[i - 1].split("@")[0]) {
                            console.log("deletedUserArr: " + JSON.stringify(Userres));
                            res.send(JSON.stringify(Userres));
                        }
                    }
                    // if(i==selectedUser.length-1){
                    //     console.log("deletedUserArr: "+JSON.stringify(res));
                    //     res.send(JSON.stringify(res));
                    // }
                });
            }
        } else {
            data._id = req.query.selectedUser.split("@")[0];
            data._rev = req.query.selectedUser.split("@")[1];
            DBhandler.deleteOneRequest(BO, data, function (error, result) {
                console.log("deletedUser: " + JSON.stringify(error ? error : result));
                // response.json(result);
                res.send(JSON.stringify(error ? error : result));
            });
        }
    });

    //tested ok
    router.delete("/API/deleteOneUsers", function (req, res) {
        // var BO=req.BOname;
        console.log(req.query);
        // query:
        // { id: '12345',
        //   selectedUser: 'b8dd82f40cd98b73d93ac2a69908d350@1-fc073255ffdedb1a62eb5ca02e150450' }
        var BO = "user";
        var data = {};
        //req.query.selectedUser is like 'b8dd82f40cd98b73d93ac2a69908d350@1-fc073255ffdedb1a62eb5ca02e150450'
        data._id = req.query.selectedUser.split("@")[0];
        data._rev = req.query.selectedUser.split("@")[1];
        DBhandler.deleteOneRequest(BO, data, function (error, result) {
            console.log("deletedUser: " + JSON.stringify(error ? error : result));
            // response.json(result);
            res.send(JSON.stringify(error ? error : result));
        });
    });

    //search docs
    router.get("/API/getLoginUser", function (req, res) {
        var IBMuserINFO = req.cookies.IBMuserINFO;
        res.send(IBMuserINFO);
    });

    //add new doc
    router.post("/getLoginUser", function (req, res) {
        var IBMuserINFO = req.cookies.IBMuserINFO;
        res.send("add");
    });

    //update a existing doc
    router.put("/getLoginUser", function (req, res) {
        var IBMuserINFO = req.cookies.IBMuserINFO;
        res.send("update");
    });

    //delete a existing doc
    router.delete("/getLoginUser", function (req, res) {
        var IBMuserINFO = req.cookies.IBMuserINFO;
        res.send("delete");
    });
    //********************************real route end******************************************//

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

        DBhandler.list("mydb", {
            include_docs: true
        }, function (result) {
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