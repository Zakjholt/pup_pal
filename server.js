var express = require('express');
var app = express();
app.use(express.static('public'));
app.listen(process.env.PORT || 8080, function() {
    console.log("server is running at http://localhost:8080");
});

exports.app = app;
