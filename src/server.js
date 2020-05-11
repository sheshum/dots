const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const _log = console.log;

const router = require("./router");

const PORT = 5001;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "../public/")))
app.use("/api", router);

app.all("/*", (_req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});




function onServerUp() {
    _log(`\nServer listening on http://localhost:${PORT}\n`);
}
app.listen(PORT, () => onServerUp());