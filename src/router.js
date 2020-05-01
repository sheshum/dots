const express = require("express");
const router = express.Router();

const { startGA } = require("./main");
const { getResults } = require("./libs/dataHandler");


router.get("/ga/results", (_req, res) => {
    getResults().then((data) => {
        res.status(200).send(data);
    });
});

router.post("/ga/generate", (_req, res) => {
    return startGA().then(() => {
        console.log("returning data");
        res.status(200).send({ success: true });
    });
});

module.exports = router;