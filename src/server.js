const path = require('path');
const express = require('express');
const _log = console.log;

const router = require("./router");

const PORT = 5001;
const app = express();

app.use("/api", router);

app.get("/*", (_req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});


function onServerUp() {
    _log(`\nServer listening on http://localhost:${PORT}\n`);
}
app.listen(PORT, () => onServerUp());