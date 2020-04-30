const express = require("express");
const router = express.Router();

const { startGA } = require("./main");

router.post("/ga/results", (_req, res) => {
    const p = startGA();
    // res.setHeader('Content-Type', 'application/json');
    res.status(200).send(p);
});


module.exports = router;