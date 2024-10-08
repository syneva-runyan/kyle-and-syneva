import express from 'express';
import dotenv from 'dotenv';
const app = express();
const PORT = 3000;

dotenv.config()

import { handler as lookup } from "./lookup/index.mjs";
import { handler as saveResponse } from "./saveResponse/index.mjs";
import { handler as askQuestion } from "./askQuestion/index.mjs";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/lookup-invite', async (req, res) => {
    const resp = await lookup({
        queryStringParameters: req.query
    });
    res.send(resp.body);
});

app.post('/save-response', async (req, res) => {
    const resp = await saveResponse(req, res.send.bind(res));
    res.send(resp.body);
});

app.post('/comment-or-question', async (req, res) => {
    const resp = await askQuestion(req, res.send.bind(res));
    res.send(resp.body);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});