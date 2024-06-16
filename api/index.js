const express = require('express');
const app = express();
const PORT = 3000;

const lookup = require("./lookup");

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/lookup-invite', (req, res) => {
    lookup.handler(req, {}, res.send);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});