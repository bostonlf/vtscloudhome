var cloudantDB = require('./cloudant');

var handler = {};
handler.find = function (boname, esq, callback) {
    console.log("findstart"+esq);
    var names = [];
    if (!cloudantDB) {
        // response.json(names);
        console.log("cloudantDB error");
        return;
    }

    // var query = {
    //     "selector": {
    //         "PosName": requestData.PosName,
    //         "BOtype": "request"
    //     },
    //     "fields": ["_id", "_rev"],
    //     "skip": 0,
    //     "execution_stats": true
    // }

    cloudantDB(boname).find(esq, function (err, data) {
        console.log('testFindError:', err);
        // console.log('testFindData:', data);
        if (err) {
            console.log('Error:' + err);
            return;
        };
        callback(data.docs);
    });
}


handler.createNewDoc = function (boname, data, callback) {
    console.log("createNewDoc");
    cloudantDB(boname).insert(data, function (err, body, header) {
        if (err) {
            console.log('[mydb.insert] ', err.message);
            callback("Error: " + err.message);
            return;
        }
        //doc._id = body.id;
        callback(body.id);
    });

}

handler.updateExistingDoc = function (boname, data, callback) {
    console.log("updateExistingDoc");

      data.lftestupdate = "lftestupdate";

    cloudantDB(boname).insert(data, function (err, body, header) {
        if (err) {
            console.log('[mydb.insert] ', err.message);
            callback("Error: " + err.message);
            return;
        }
        //doc._id = body.id;
        callback(body.id);
    });
}


// exports.ModifyCurrentRequest = function(docid, newrequestdata, callback) {
//     console.log("Updating document 'request'");
//     initDBConnection("request", function(database) {
//         database.get(docid, function(err, requestData) {
//             //console.log('Error:', err);
//             // keep a copy of the doc so we know its revision token
//             var newrequestdataOBJ = JSON.parse(newrequestdata);
//             requestData.requestNumber = newrequestdataOBJ.requestNumber;
//             requestData.UserData.FormData.Fname = newrequestdataOBJ.Fname;
//             requestData.UserData.FormData.Lname = newrequestdataOBJ.Lname;
//             database.insert(requestData, function(err, newrequest) {
//                 //console.log('Error:', err);
//                 var resMSG = "updateSuccefully"
//                 if (err) resMSG = "updateFailed"
//                 callback(resMSG)
//                 // var query = {
//                 //     "selector": {
//                 //         "BOtype": "request"
//                 //     },
//                 //     "fields": ["_id", "_rev", "PosName", "requestNumber", "OverviewData", "UserData", "CreateDate"],
//                 //     "skip": 0,
//                 //     "execution_stats": true
//                 // }
//                 // database.find(query, function(err, searchRESdata) {
//                 //     var requestArr = searchRESdata.docs;
//                 //     callback(requestArr)
//                 // })
//             });
//         })
//     })
// }


handler.deleteOneRequest = function (boname, data, callback) {
    console.log("start deleteOneRequest");
    cloudantDB(boname).destroy(data._id, data._rev, function (err, data) {
        console.log('Error:', err);
        // Data: { ok: true,
        //     id: 'b8dd82f40cd98b73d93ac2a69908d350',
        //     rev: '2-8e4f3c1bd5927490c3dcfbc36cfebfa0' }
        if (callback) callback(err, data);
    });
}

handler.deleteRequests = function (boname, data, callback) {
    console.log("deleteRequests");
    var res = "";
    for (var i = 0; data[i]; i++) {
        cloudantDB(boname).destroy(data._id, data._rev, function (err, data) {
            if (err) {
                console.log('Error:', err);

                res += err
            } else {
                console.log('Data:', data);
                res += data
            }
        });
    }
    callback(res);
}

handler.list = function (boname, esq, callback) {
    console.log("liststart");
    var names = [];
    if (!cloudantDB) {
        // response.json(names);
        console.log("cloudantDB error");
        return;
    }

    cloudantDB(boname).list(esq, function (err, body) {
        if (!err) {
            body.rows.forEach(function (row) {
                if (row.doc.name)
                    names.push(row.doc.name);
            });
            // response.json(names);
            callback(names);
            console.log("liststart:" + names.length);
        }
        console.log("listend");
    })
}

module.exports = handler;