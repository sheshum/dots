const express = require("express");
const router = express.Router();

const { startGA } = require("./main");
const { getResults } = require("./libs/dataHandler");


router.get("/ga/results", (_req, res) => {
    getResults().then((data) => {
        res.status(200).send(data);
    });
});

router.post("/ga/generate", (req, res) => {
    return startGA(req.body).then((p) => {
        console.log("returning data");
        res.status(200).send(p);
    }).catch(err => {
        console.log(err);
        res.status(500).send("Internal error");
    })
});

module.exports = router;