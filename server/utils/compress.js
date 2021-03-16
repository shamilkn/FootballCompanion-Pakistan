var fs = require("fs");
var zip = require("node-native-zip");
const { createBlog } = require("../controllers/blog.controller");

exports.archive = (output, files = [], textFiles = [], callback, callback2) => {

    var archive = new zip();
    
    textFiles.map(textFile => {
        archive.add(textFile.name, new Buffer(textFile.content, "utf8"));
    })

    archive.addFiles(files, function (err) {
        if (err)
            return callback(500, {status: 'fail', mesaage: JSON.stringify(err)})

        var buff = archive.toBuffer();

        fs.writeFile('./zips/' + output, buff, function () {
            callback(200, {status: 'success'})
        });
    });

}