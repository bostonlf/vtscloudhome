var cloudantDB = require('./cloudant');

var handler = {};
handler.list = function (callback) {
console.log("liststart");
    var names = [];
    if (!cloudantDB) {
        // response.json(names);
        return;
    }

    cloudantDB.list({
        include_docs: true
    }, function (err, body) {
        if (!err) {
            body.rows.forEach(function (row) {
                if (row.doc.name)
                    names.push(row.doc.name);
            });
            // response.json(names);
            callback(names);
            console.log("liststart:"+names.length);
    }
    console.log("listend");
})
}

module.exports = handler;