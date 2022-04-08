// Initialisierung
const express = require('express');
const app = express();

app.listen(3002, function() {
    console.log("listening on 3002")
});

app.use(express.static(__dirname + "/three"));

app.get("/", function(req, res) {
    res.redirect("/demo/demonstrator/index.html");
});
